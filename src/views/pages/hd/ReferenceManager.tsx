// Gestion générique d'un référentiel simple (liste + recherche + modale de saisie)
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { UserAction } from 'src/configs/Action'
import { useHd } from 'src/i18n/helpdesk'
import { extractApiError, isApiError } from 'src/helpers/apiError'
import { crudCreate, crudDelete, crudGet, crudList, crudUpdate } from 'src/myservices/hd/crud'
import { Button, ConfirmDialog, EmptyState, Field, Modal, PageHeader, Pagination, cn } from 'src/components/hd'

export type RefFieldName = 'displayName' | 'description' | 'phoneNumber' | 'isActive'

export interface ReferenceConfig {
  /** clé i18n : ref.<key>.title / subtitle / entity */
  key: 'stations' | 'departments' | 'requestTypes'
  uri: string
  icon: string
  subject: string
  fields: RefFieldName[]
}

const MAX = { displayName: 120, description: 1000, phoneNumber: 30 }

const ReferenceManager = ({ config }: { config: ReferenceConfig }) => {
  const { t, lang, formatDate } = useHd()
  const router = useRouter()
  const ability = useContext(AbilityContext)
  const can = (a: UserAction) => !ability || ability.can(a, config.subject) || ability.can(UserAction.Manage, 'all')
  const has = (f: RefFieldName) => config.fields.includes(f)
  const entity = t(`ref.${config.key}.entity`)

  const [q, setQ] = useState('')
  const [debounced, setDebounced] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(25)
  const [rows, setRows] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null | undefined>(undefined) // undefined = fermé, null = création
  const [toDelete, setToDelete] = useState<any | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const h = setTimeout(() => {
      setDebounced(q)
      setPage(1)
    }, 350)
    return () => clearTimeout(h)
  }, [q])

  const load = useCallback(async () => {
    setLoading(true)
    const res: any = await crudList(config.uri, { q: debounced, page, perPage })
    setLoading(false)
    if (isApiError(res) || !Array.isArray(res?.data)) {
      setRows([])
      setTotal(0)
      return toast.error(extractApiError(res, t('common.unexpectedError')))
    }
    setRows(res.data)
    setTotal(res.total ?? res.data.length)
  }, [config.uri, debounced, page, perPage, t])

  useEffect(() => {
    load()
  }, [load])

  // compatibilité avec les anciennes routes /add et /edit/[id] (redirigées ici)
  useEffect(() => {
    if (!router.isReady) return
    if (router.query.new === '1') setEditing(null)
    else if (typeof router.query.edit === 'string') {
      const id = router.query.edit
      crudGet(config.uri, id).then((res: any) => !isApiError(res) && res?.id && setEditing(res))
    }
  }, [router.isReady, router.query, config.uri])

  /* ------------------------------ formulaire ------------------------------ */
  const schema = useMemo(
    () =>
      yup.object({
        displayName: yup.string().trim().required(t('ref.nameRequired')).max(MAX.displayName, t('form.errors.max', { max: MAX.displayName })),
        description: yup.string().trim().max(MAX.description, t('form.errors.max', { max: MAX.description })),
        phoneNumber: yup
          .string()
          .trim()
          .test('phone', t('labAgent.errors.phoneFormat'), v => !v || /^\+?[0-9 ().-]{6,30}$/.test(v)),
        isActive: yup.boolean()
      }),
    [t, lang] // eslint-disable-line react-hooks/exhaustive-deps
  )
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<any>({ resolver: yupResolver(schema), mode: 'onTouched' })

  useEffect(() => {
    if (editing !== undefined)
      reset({
        displayName: editing?.displayName ?? '',
        description: editing?.description ?? '',
        phoneNumber: editing?.phoneNumber ?? '',
        isActive: editing?.isActive ?? true
      })
  }, [editing, reset])

  const closeModal = () => {
    setEditing(undefined)
    if (router.query.new || router.query.edit) router.replace({ pathname: router.pathname }, undefined, { shallow: true })
  }

  const onSubmit = async (v: any) => {
    const dto: any = { displayName: v.displayName.trim() }
    if (has('description')) dto.description = v.description?.trim() || null
    if (has('phoneNumber')) dto.phoneNumber = v.phoneNumber?.trim() || undefined
    if (has('isActive')) dto.isActive = !!v.isActive
    setBusy(true)
    const res: any = editing?.id ? await crudUpdate(config.uri, editing.id, dto) : await crudCreate(config.uri, dto)
    setBusy(false)
    if (isApiError(res)) return toast.error(extractApiError(res, t('common.unexpectedError')))
    toast.success(t('ref.saved'))
    closeModal()
    load()
  }

  const confirmDelete = async () => {
    setBusy(true)
    const res: any = await crudDelete(config.uri, toDelete.id)
    setBusy(false)
    setToDelete(null)
    if (isApiError(res)) return toast.error(extractApiError(res, t('common.unexpectedError')))
    toast.success(t('ref.deleted'))
    load()
  }

  const description = watch('description') ?? ''
  const cols = 2 + (has('phoneNumber') ? 1 : 0) + (has('isActive') ? 1 : 0) + 1 + (can(UserAction.Edit) || can(UserAction.Delete) ? 1 : 0)

  return (
    <div className='w-full font-sans'>
      <PageHeader
        icon={config.icon}
        title={t(`ref.${config.key}.title`)}
        subtitle={`${t(`ref.${config.key}.subtitle`)} · ${t('ref.count', { count: total })}`}
        actions={
          can(UserAction.Create) && (
            <Button icon='mdi:plus' onClick={() => setEditing(null)}>
              {t('ref.add')}
            </Button>
          )
        }
      />

      <div className='hd-card mb-4 p-4'>
        <div className='relative'>
          <Icon icon='mdi:magnify' fontSize={18} className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
          <input type='search' className='hd-input pl-10' placeholder={t('ref.searchPlaceholder')} value={q} onChange={e => setQ(e.target.value)} />
        </div>
      </div>

      <div className='hd-card overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-left text-sm'>
            <thead>
              <tr className='bg-brand-600 text-xs uppercase tracking-wide text-white'>
                <th className='px-4 py-3'>{t('ref.name')}</th>
                <th className='px-4 py-3'>{t('ref.description')}</th>
                {has('phoneNumber') && <th className='px-4 py-3'>{t('ref.phone')}</th>}
                {has('isActive') && <th className='px-4 py-3'>{t('ref.status')}</th>}
                <th className='whitespace-nowrap px-4 py-3'>{t('ref.createdAt')}</th>
                {(can(UserAction.Edit) || can(UserAction.Delete)) && <th className='px-4 py-3 text-right'>{t('list.cols.actions')}</th>}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: cols }).map((__, j) => (
                        <td key={j} className='px-4 py-3.5'>
                          <div className='h-3 animate-pulse rounded bg-gray-200' />
                        </td>
                      ))}
                    </tr>
                  ))
                : rows.map(r => (
                    <tr key={r.id} className='border-0 border-b border-solid border-gray-100 even:bg-gray-50/60 hover:bg-brand-50'>
                      <td className='px-4 py-3 font-semibold text-gray-900'>{r.displayName}</td>
                      <td className='max-w-md truncate px-4 py-3 text-gray-600' title={r.description ?? ''}>
                        {r.description || '—'}
                      </td>
                      {has('phoneNumber') && <td className='whitespace-nowrap px-4 py-3 tabular-nums'>{r.phoneNumber || '—'}</td>}
                      {has('isActive') && (
                        <td className='px-4 py-3'>
                          <span
                            className={cn(
                              'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
                              r.isActive !== false ? 'bg-leaf-50 text-leaf-700 ring-leaf-100' : 'bg-gray-100 text-gray-500 ring-gray-200'
                            )}
                          >
                            {r.isActive !== false ? t('common.active') : t('common.inactive')}
                          </span>
                        </td>
                      )}
                      <td className='whitespace-nowrap px-4 py-3 tabular-nums text-gray-500'>{formatDate(r.createdAt, false)}</td>
                      {(can(UserAction.Edit) || can(UserAction.Delete)) && (
                        <td className='whitespace-nowrap px-4 py-3 text-right'>
                          {can(UserAction.Edit) && (
                            <button type='button' title={t('common.edit')} onClick={() => setEditing(r)} className='cursor-pointer rounded-md border-0 bg-transparent p-1.5 text-gray-500 hover:bg-white hover:text-brand-700'>
                              <Icon icon='mdi:pencil-outline' fontSize={18} />
                            </button>
                          )}
                          {can(UserAction.Delete) && (
                            <button type='button' title={t('common.delete')} onClick={() => setToDelete(r)} className='cursor-pointer rounded-md border-0 bg-transparent p-1.5 text-gray-500 hover:bg-white hover:text-red-600'>
                              <Icon icon='mdi:trash-can-outline' fontSize={18} />
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        {!loading && rows.length === 0 && (
          <EmptyState
            icon={config.icon}
            title={t('common.noResult')}
            action={
              can(UserAction.Create) && !debounced ? (
                <Button variant='secondary' icon='mdi:plus' onClick={() => setEditing(null)}>
                  {t('ref.add')}
                </Button>
              ) : undefined
            }
          />
        )}
        {total > 0 && (
          <Pagination
            page={page}
            perPage={perPage}
            total={total}
            onPage={setPage}
            onPerPage={n => {
              setPerPage(n)
              setPage(1)
            }}
          />
        )}
      </div>

      <Modal
        open={editing !== undefined}
        onClose={closeModal}
        title={editing?.id ? t('ref.editTitle', { entity }) : t('ref.newTitle', { entity })}
        footer={
          <>
            <Button variant='secondary' onClick={closeModal}>
              {t('common.cancel')}
            </Button>
            <Button icon='mdi:content-save-outline' loading={busy} onClick={handleSubmit(onSubmit)}>
              {t('common.save')}
            </Button>
          </>
        }
      >
        <form noValidate onSubmit={handleSubmit(onSubmit)} className='grid gap-x-4 gap-y-1 sm:grid-cols-2'>
          <Field id='ref-name' label={t('ref.name')} required error={errors.displayName?.message as string} className={has('phoneNumber') ? '' : 'sm:col-span-2'}>
            <input id='ref-name' autoFocus className={cn('hd-input', errors.displayName && 'hd-input-error')} {...register('displayName')} />
          </Field>
          {has('phoneNumber') && (
            <Field id='ref-phone' label={t('ref.phone')} error={errors.phoneNumber?.message as string}>
              <input id='ref-phone' type='tel' className={cn('hd-input', errors.phoneNumber && 'hd-input-error')} {...register('phoneNumber')} />
            </Field>
          )}
          {has('description') && (
            <Field
              id='ref-desc'
              label={t('ref.description')}
              error={errors.description?.message as string}
              counter={`${description.length} / ${MAX.description}`}
              className='sm:col-span-2'
            >
              <textarea id='ref-desc' rows={3} maxLength={MAX.description} className={cn('hd-input resize-y', errors.description && 'hd-input-error')} {...register('description')} />
            </Field>
          )}
          {has('isActive') && (
            <label className='flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-700 sm:col-span-2'>
              <input type='checkbox' className='h-4 w-4 accent-brand-600' {...register('isActive')} />
              {t('common.active')}
            </label>
          )}
          <button type='submit' className='hidden' />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        danger
        loading={busy}
        title={t('common.delete')}
        message={t('ref.confirmDelete', { name: toDelete?.displayName ?? '' })}
        confirmLabel={t('common.delete')}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default ReferenceManager
