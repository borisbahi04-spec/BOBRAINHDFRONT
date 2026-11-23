// Formulaire « Demande d'intervention » — Tailwind, charte DKL, FR/EN
import { ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import { AppDispatch, RootState } from 'src/redux/store'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { EntityAbility, UserAction } from 'src/configs/Action'
import { enumStatus, PriorityEnum } from 'src/definitions/enum'
import {
  createrequesterAction,
  deleterequesterAction,
  updaterequesterAction
} from 'src/redux/actions/requester/requester-actions'
import { useHd } from 'src/i18n/helpdesk'
import { extractApiError } from 'src/helpers/apiError'
import { Button, ConfirmDialog, Field, Option, PageHeader, SearchSelect, cn } from 'src/components/hd'

import { buildRequesterSchema, normalizeTickets, TEXT_MAX } from '../shared/schema'
import { requesterListHref } from '../shared/listReturn'
import {
  loadLabAgents,
  loadOperators,
  loadRequestTypes,
  loadStations,
  toLabAgentOption,
  toOperatorOption,
  toRequestTypeOption,
  toStationOption
} from '../shared/options'

/* -------------------------------------------------------------------------- */

interface AddCardProps {
  data?: any
  [key: string]: any
}

interface FormValues {
  ticket: string
  priority: PriorityEnum
  station: Option | null
  requesttype: Option | null
  labAgent: Option | null
  operator: Option | null
  description: string
  correction: string
}

const PRIORITY_UI: Record<PriorityEnum, { dot: string; active: string }> = {
  [PriorityEnum.Normal]: { dot: 'bg-gray-400', active: 'border-gray-500 bg-gray-50 text-gray-900' },
  [PriorityEnum.Important]: { dot: 'bg-harvest-500', active: 'border-harvest-500 bg-harvest-50 text-harvest-700' },
  [PriorityEnum.Urgent]: { dot: 'bg-red-500', active: 'border-red-500 bg-red-50 text-red-700' }
}

const Section = ({ icon, title, help, children }: { icon: string; title: string; help: string; children: ReactNode }) => (
  <section className='grid gap-6 border-0 border-b border-solid border-gray-100 px-6 py-6 last:border-b-0 lg:grid-cols-[240px_1fr]'>
    <div>
      <div className='flex items-center gap-2'>
        <span className='flex h-7 w-7 items-center justify-center rounded-full bg-harvest-500 text-white'>
          <Icon icon={icon} fontSize={16} />
        </span>
        <h2 className='m-0 text-sm font-bold uppercase tracking-wide text-brand-700'>{title}</h2>
      </div>
      <p className='m-0 mt-2 text-sm text-gray-500'>{help}</p>
    </div>
    <div className='grid min-w-0 gap-x-5 gap-y-1 md:grid-cols-2'>{children}</div>
  </section>
)

/* -------------------------------------------------------------------------- */

const AddCard = ({ data }: AddCardProps) => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const ability = useContext(AbilityContext)
  const { t, lang } = useHd()
  const session = useSelector((state: RootState) => state.auth?.getuserprofile?.session)

  const isEdit = !!data?.id
  const readOnly = isEdit && data?.status && data.status !== enumStatus.Open
  const canSave = ability.can(isEdit ? UserAction.Edit : UserAction.Create, EntityAbility.REQUESTER) && !readOnly
  const canDelete = isEdit && ability.can(UserAction.Delete, EntityAbility.REQUESTER) && !readOnly

  const [submitting, setSubmitting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const leaving = useRef(false) // navigation volontaire après enregistrement

  // Opératrice par défaut = utilisatrice connectée si son rôle est « opérateur »
  const selfOperator: Option | null = useMemo(() => {
    if (!session?.role?.isForOperator || !session?.userId) return null
    const u = session.userData ?? {}
    return toOperatorOption({ id: session.userId, firstName: u.firstName, lastName: u.lastName, username: session.username })
  }, [session])

  // le schéma est reconstruit quand la langue change (messages traduits)
  const schema = useMemo(() => buildRequesterSchema(t), [t, lang]) // eslint-disable-line react-hooks/exhaustive-deps

  const defaultValues: FormValues = useMemo(
    () => ({
      ticket: data?.ticket ?? '',
      priority: (data?.priority as PriorityEnum) ?? PriorityEnum.Normal,
      station: toStationOption(data?.station),
      requesttype: toRequestTypeOption(data?.requesttype),
      labAgent: toLabAgentOption(data?.labAgent),
      operator: toOperatorOption(data?.operator) ?? (isEdit ? null : selfOperator),
      description: data?.description ?? '',
      correction: data?.correction ?? ''
    }),
    [data, isEdit, selfOperator]
  )

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty, isSubmitSuccessful }
  } = useForm<FormValues>({
    mode: 'onTouched',
    resolver: yupResolver(schema),
    defaultValues
  })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const [description, correction, priority] = useWatch({ control, name: ['description', 'correction', 'priority'] })

  // Avertissement si l'utilisateur quitte avec des modifications non enregistrées
  useEffect(() => {
    if (!isDirty || isSubmitSuccessful) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    const onRoute = () => {
      if (leaving.current) return
      if (!window.confirm(t('form.unsavedChanges'))) {
        router.events.emit('routeChangeError')
        // eslint-disable-next-line no-throw-literal
        throw 'Navigation annulée'
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    router.events.on('routeChangeStart', onRoute)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      router.events.off('routeChangeStart', onRoute)
    }
  }, [isDirty, isSubmitSuccessful, router, t])

  /* ------------------------------ ACTIONS ------------------------------ */

  const goList = () => router.push(requesterListHref())

  const onSubmit: SubmitHandler<FormValues> = values => {
    const payload = {
      ticket: normalizeTickets(values.ticket),
      priority: values.priority,
      stationId: values.station?.id,
      requesttypeId: values.requesttype?.id,
      labAgentId: values.labAgent?.id ?? null, // facultatif
      operatorId: values.operator?.id ?? null, // facultatif
      description: values.description.trim(),
      correction: values.correction.trim()
    }
    setSubmitting(true)

    const onError = (res: any) => {
      setSubmitting(false)
      toast.error(extractApiError(res, t('common.unexpectedError')))
    }

    if (isEdit) {
      dispatch(
        updaterequesterAction(
          data.id,
          payload,
          (res: any) => {
            setSubmitting(false)
            reset(values)
            toast.success(t('form.updated', { ref: res?.reference ?? data.reference }))
            leaving.current = true
            router.push(`/requester/preview/${data.id}`)
          },
          onError
        )
      )
    } else {
      dispatch(
        createrequesterAction(
          payload,
          (res: any) => {
            setSubmitting(false)
            reset(values)
            toast.success(t('form.created', { ref: res?.reference ?? '' }))
            leaving.current = true
            router.push(res?.id ? `/requester/preview/${res.id}` : '/requester/list')
          },
          onError
        )
      )
    }
  }

  const handleDelete = () => {
    setDeleting(true)
    dispatch(
      deleterequesterAction(
        data.id,
        () => {
          setDeleting(false)
          setConfirmDelete(false)
          reset(defaultValues)
          toast.success(t('form.deleted', { ref: data.reference }))
          leaving.current = true
          goList()
        },
        (res: any) => {
          setDeleting(false)
          toast.error(extractApiError(res, t('common.unexpectedError')))
        }
      )
    )
  }

  /* -------------------------------------------------------------------------- */

  const err = (name: keyof FormValues) => (errors[name] as any)?.message as string | undefined

  return (
    <div className='mx-auto w-full max-w-6xl font-sans'>
      <PageHeader
        icon={isEdit ? 'mdi:file-document-edit-outline' : 'mdi:file-document-plus-outline'}
        title={isEdit ? t('form.editTitle') : t('form.newTitle')}
        subtitle={isEdit ? t('form.editSubtitle', { ref: data.reference ?? '—' }) : t('form.newSubtitle')}
      />

      {readOnly && (
        <div className='mb-4 flex items-center gap-2 rounded-lg border border-solid border-harvest-100 bg-harvest-50 px-4 py-3 text-sm text-harvest-700'>
          <Icon icon='mdi:lock-outline' fontSize={18} />
          {t('form.readonlyNotice', { status: t(`status.${data.status}`) })}
        </div>
      )}

      <form noValidate onSubmit={handleSubmit(onSubmit)} className='hd-card overflow-visible'>
        <fieldset disabled={!canSave || submitting} className='m-0 min-w-0 border-0 p-0'>
          {/* 1. Identification */}
          <Section icon='mdi:ticket-confirmation-outline' title={t('form.sectionTicket')} help={t('form.sectionTicketHelp')}>
            <Field id='ticket' label={t('form.ticket')} required error={err('ticket')} help={t('form.ticketHelp')}>
              <input
                id='ticket'
                autoFocus={!isEdit}
                className={cn('hd-input font-mono uppercase tracking-wide placeholder:font-sans placeholder:normal-case placeholder:tracking-normal', errors.ticket && 'hd-input-error')}
                placeholder={t('form.ticketPlaceholder')}
                aria-invalid={!!errors.ticket}
                aria-describedby={errors.ticket ? 'ticket-error' : 'ticket-help'}
                {...register('ticket', {
                  onBlur: e => setValue('ticket', normalizeTickets(e.target.value), { shouldValidate: true })
                })}
              />
            </Field>

            <Field id='priority' label={t('form.priority')} required error={err('priority')}>
              <div role='radiogroup' id='priority' className='grid grid-cols-3 gap-2'>
                {Object.values(PriorityEnum).map(p => (
                  <label
                    key={p}
                    className={cn(
                      'flex h-[42px] cursor-pointer items-center justify-center gap-2 rounded-lg border border-solid text-sm font-semibold transition',
                      priority === p ? PRIORITY_UI[p].active : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    <input type='radio' value={p} className='sr-only' {...register('priority')} />
                    <span className={cn('h-2 w-2 rounded-full', PRIORITY_UI[p].dot)} />
                    {t(`priority.${p}`)}
                  </label>
                ))}
              </div>
            </Field>

            <Field id='station' label={t('form.station')} required error={err('station')}>
              <Controller
                name='station'
                control={control}
                render={({ field }) => (
                  <SearchSelect
                    id='station'
                    icon='mdi:factory'
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    loadOptions={loadStations}
                    placeholder={t('form.stationPlaceholder')}
                    invalid={!!errors.station}
                    disabled={!canSave}
                  />
                )}
              />
            </Field>

            <Field id='requesttype' label={t('form.requestType')} required error={err('requesttype')}>
              <Controller
                name='requesttype'
                control={control}
                render={({ field }) => (
                  <SearchSelect
                    id='requesttype'
                    icon='mdi:shape-outline'
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    loadOptions={loadRequestTypes}
                    placeholder={t('form.requestTypePlaceholder')}
                    invalid={!!errors.requesttype}
                    disabled={!canSave}
                  />
                )}
              />
            </Field>
          </Section>

          {/* 2. Personnes */}
          <Section icon='mdi:account-group-outline' title={t('form.sectionPeople')} help={t('form.sectionPeopleHelp')}>
            <Field id='labAgent' label={t('form.labAgent')} optionalLabel={t('common.optional')} error={err('labAgent')}>
              <Controller
                name='labAgent'
                control={control}
                render={({ field }) => (
                  <SearchSelect
                    id='labAgent'
                    icon='mdi:flask-outline'
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    loadOptions={loadLabAgents}
                    placeholder={t('form.labAgentPlaceholder')}
                    invalid={!!errors.labAgent}
                    disabled={!canSave}
                  />
                )}
              />
            </Field>

            <Field id='operator' label={t('form.operator')} optionalLabel={t('common.optional')} error={err('operator')} help={t('form.operatorHelp')}>
              <Controller
                name='operator'
                control={control}
                render={({ field }) => (
                  <SearchSelect
                    id='operator'
                    icon='mdi:account-tie-outline'
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    loadOptions={loadOperators}
                    placeholder={t('form.operatorPlaceholder')}
                    invalid={!!errors.operator}
                    disabled={!canSave}
                  />
                )}
              />
            </Field>
          </Section>

          {/* 3. Problème & correction */}
          <Section icon='mdi:clipboard-text-outline' title={t('form.sectionDetails')} help={t('form.sectionDetailsHelp')}>
            <Field
              id='description'
              label={t('form.description')}
              required
              error={err('description')}
              counter={t('form.chars', { count: description?.length ?? 0, max: TEXT_MAX })}
              className='md:col-span-2'
            >
              <textarea
                id='description'
                rows={4}
                maxLength={TEXT_MAX}
                className={cn('hd-input resize-y leading-relaxed', errors.description && 'hd-input-error')}
                placeholder={t('form.descriptionPlaceholder')}
                aria-invalid={!!errors.description}
                {...register('description')}
              />
            </Field>

            <Field
              id='correction'
              label={t('form.correction')}
              required
              error={err('correction')}
              counter={t('form.chars', { count: correction?.length ?? 0, max: TEXT_MAX })}
              className='md:col-span-2'
            >
              <textarea
                id='correction'
                rows={4}
                maxLength={TEXT_MAX}
                className={cn(
                  'hd-input resize-y border-l-4 border-l-leaf-500 leading-relaxed',
                  errors.correction && 'hd-input-error'
                )}
                placeholder={t('form.correctionPlaceholder')}
                aria-invalid={!!errors.correction}
                {...register('correction')}
              />
            </Field>
          </Section>
        </fieldset>

        {/* Barre d'actions */}
        <div className='sticky bottom-0 z-10 flex flex-col-reverse gap-3 rounded-b-xl border-0 border-t border-solid border-gray-200 bg-gray-50/95 px-6 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between'>
          <div>
            {canDelete && (
              <Button variant='danger' icon='mdi:trash-can-outline' onClick={() => setConfirmDelete(true)}>
                {t('common.delete')}
              </Button>
            )}
          </div>
          <div className='flex gap-2 sm:justify-end'>
            <Button variant='secondary' className='flex-1 sm:flex-none' onClick={() => router.back()}>
              {t('common.cancel')}
            </Button>
            {canSave && (
              <Button type='submit' icon='mdi:content-save-outline' loading={submitting} className='flex-1 sm:flex-none'>
                {submitting ? t('common.saving') : t('common.save')}
              </Button>
            )}
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={confirmDelete}
        danger
        loading={deleting}
        title={t('form.confirmDeleteTitle')}
        message={t('form.confirmDeleteText', { ref: data?.reference ?? '' })}
        confirmLabel={t('common.delete')}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}

export default AddCard
