// Formulaire rôle + matrice de permissions — Tailwind, charte DKL, FR/EN
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'

import { useHd } from 'src/i18n/helpdesk'
import { extractApiError, isApiError } from 'src/helpers/apiError'
import { crudCreate, crudGet, crudList, crudUpdate } from 'src/myservices/hd/crud'
import { Button, Field, FormSection, PageHeader, Toggle, cn } from 'src/components/hd'

type Matrix = Record<string, Record<string, boolean>>

// Valeurs de repli si l'accès « default » est introuvable
const FALLBACK_ENTITIES = ['Requester', 'User', 'Role', 'Department', 'Branch']
const FALLBACK_PERMS = ['create', 'read', 'edit', 'delete', 'approval', 'treated', 'cancel', 'close']

interface Values {
  name: string
  displayName: string
  description: string
  isForOperator: boolean
  sendRequesterEmail: boolean
  isActive: boolean
}

const RoleForm = ({ id }: { id?: string }) => {
  const router = useRouter()
  const { t, lang } = useHd()
  const isEdit = !!id
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [entities, setEntities] = useState<string[]>(FALLBACK_ENTITIES)
  const [perms, setPerms] = useState<string[]>(FALLBACK_PERMS)
  const [matrix, setMatrix] = useState<Matrix>({})
  const [isAdmin, setIsAdmin] = useState(false)

  const schema = useMemo(
    () =>
      yup.object({
        // nom technique : contrôlé à la création seulement (non modifiable ensuite)
        name: isEdit
          ? yup.string()
          : yup
              .string()
              .trim()
              .required(t('roles.nameRequired'))
              .min(3, t('form.errors.min', { min: 3 }))
              .max(50, t('form.errors.max', { max: 50 }))
              .matches(/^[a-z0-9_]+$/, t('roles.nameFormat')),
        displayName: yup.string().trim().max(80, t('form.errors.max', { max: 80 })),
        description: yup.string().trim().max(500, t('form.errors.max', { max: 500 })),
        isForOperator: yup.boolean(),
        sendRequesterEmail: yup.boolean(),
        isActive: yup.boolean()
      }),
    [t, lang, isEdit] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Values>({
    mode: 'onTouched',
    resolver: yupResolver(schema) as any,
    defaultValues: { name: '', displayName: '', description: '', isForOperator: false, sendRequesterEmail: false, isActive: true }
  })

  // structure de la matrice (accès « default ») + rôle à modifier
  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      const [access, role]: any[] = await Promise.all([crudList('access', { perPage: 50 }), id ? crudGet('role', id) : Promise.resolve(null)])
      if (!alive) return
      const def = (Array.isArray(access?.data) ? access.data : Array.isArray(access) ? access : []).find((a: any) => a.name === 'default')
      const ents = def?.entity ? Object.keys(def.entity) : FALLBACK_ENTITIES
      const prms = def?.permissions ? Object.keys(def.permissions) : FALLBACK_PERMS
      const current: any = role?.permissions ?? {}
      // ajoute les modules déjà présents dans le rôle mais absents de l'accès par défaut
      const allEnts = Array.from(new Set([...ents, ...Object.keys(current)]))
      setEntities(allEnts)
      setPerms(prms)
      const m: Matrix = {}
      allEnts.forEach(e => {
        m[e] = {}
        prms.forEach(p => (m[e][p] = current[e] === true || !!current[e]?.[p]))
      })
      setMatrix(m)
      if (role) {
        if (isApiError(role) || !role.id) toast.error(extractApiError(role, t('common.unexpectedError')))
        else {
          setIsAdmin(!!role.adminPermission)
          reset({
            name: role.name ?? '',
            displayName: role.displayName ?? '',
            description: role.description ?? '',
            isForOperator: !!role.isForOperator,
            sendRequesterEmail: !!role.sendRequesterEmail,
            isActive: role.isActive !== false
          })
        }
      }
      setLoading(false)
    })()
    return () => {
      alive = false
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (e: string, p: string) => setMatrix(m => ({ ...m, [e]: { ...m[e], [p]: !m[e]?.[p] } }))
  const rowAll = (e: string) => perms.every(p => matrix[e]?.[p])
  const colAll = (p: string) => entities.every(e => matrix[e]?.[p])
  const toggleRow = (e: string) => {
    const v = !rowAll(e)
    setMatrix(m => ({ ...m, [e]: Object.fromEntries(perms.map(p => [p, v])) }))
  }
  const toggleCol = (p: string) => {
    const v = !colAll(p)
    setMatrix(m => Object.fromEntries(entities.map(e => [e, { ...m[e], [p]: v }])))
  }

  const onSubmit = async (v: Values) => {
    const dto: any = {
      name: v.name.trim(),
      displayName: v.displayName?.trim() || v.name.trim(),
      description: v.description?.trim() || undefined,
      isForOperator: !!v.isForOperator,
      sendRequesterEmail: !!v.sendRequesterEmail,
      isActive: !!v.isActive,
      permissions: matrix
    }
    if (isEdit) delete dto.name // le nom technique n'est pas modifiable
    setSaving(true)
    const res: any = isEdit ? await crudUpdate('role', id!, dto) : await crudCreate('role', dto)
    setSaving(false)
    if (isApiError(res)) return toast.error(extractApiError(res, t('common.unexpectedError')))
    toast.success(t('roles.saved'))
    router.push('/role/list')
  }

  const cb = 'h-4 w-4 cursor-pointer accent-brand-600'

  return (
    <div className='mx-auto w-full max-w-6xl font-sans'>
      <PageHeader
        icon='mdi:shield-account-outline'
        title={isEdit ? t('roles.editTitle') : t('roles.newTitle')}
        actions={
          <Button variant='secondary' icon='mdi:arrow-left' onClick={() => router.push('/role/list')}>
            {t('common.back')}
          </Button>
        }
      />

      <form noValidate onSubmit={handleSubmit(onSubmit)} className='hd-card overflow-visible'>
        <fieldset disabled={loading || saving} className={cn('m-0 min-w-0 border-0 p-0', loading && 'animate-pulse')}>
          <FormSection icon='mdi:badge-account-outline' title={t('preview.info')}>
            <Field id='name' label={t('roles.name')} required={!isEdit} error={errors.name?.message} help={t('roles.nameHelp')}>
              <input id='name' readOnly={isEdit} className={cn('hd-input font-mono lowercase', errors.name && 'hd-input-error', isEdit && 'bg-gray-50 text-gray-500')} {...register('name')} />
            </Field>
            <Field id='displayName' label={t('roles.displayName')} error={errors.displayName?.message}>
              <input id='displayName' className={cn('hd-input', errors.displayName && 'hd-input-error')} {...register('displayName')} />
            </Field>
            <Field id='description' label={t('roles.description')} error={errors.description?.message} className='md:col-span-2'>
              <textarea id='description' rows={2} className={cn('hd-input resize-y', errors.description && 'hd-input-error')} {...register('description')} />
            </Field>
          </FormSection>

          <FormSection icon='mdi:tune-variant' title={t('roles.flags')} cols={1}>
            <Toggle id='isForOperator' label={t('roles.isForOperator')} help={t('roles.isForOperatorHelp')} {...register('isForOperator')} />
            <Toggle id='sendRequesterEmail' label={t('roles.sendRequesterEmail')} help={t('roles.sendRequesterEmailHelp')} {...register('sendRequesterEmail')} />
            <Toggle id='roleActive' label={t('common.active')} {...register('isActive')} />
          </FormSection>

          <section className='px-6 py-6'>
            <div className='mb-3 flex flex-wrap items-end justify-between gap-2'>
              <div>
                <h2 className='m-0 text-sm font-bold uppercase tracking-wide text-brand-700'>{t('roles.permissions')}</h2>
                <p className='m-0 mt-1 text-sm text-gray-500'>{t('roles.permissionsHelp')}</p>
              </div>
              {isAdmin && (
                <span className='rounded-md bg-harvest-50 px-2.5 py-1 text-xs font-semibold text-harvest-700'>
                  {t('roles.admin')} : {t('roles.all')}
                </span>
              )}
            </div>
            <div className='overflow-x-auto rounded-lg border border-solid border-gray-200'>
              <table className='w-full border-collapse text-sm'>
                <thead>
                  <tr className='bg-gray-50 text-xs text-gray-600'>
                    <th className='px-4 py-3 text-left font-semibold uppercase tracking-wide'>{t('roles.module')}</th>
                    {perms.map(p => (
                      <th key={p} className='px-2 py-2 text-center font-semibold'>
                        <div className='flex flex-col items-center gap-1'>
                          <span className='whitespace-nowrap'>{t(`roles.perms.${p}`, p)}</span>
                          <input type='checkbox' className={cb} checked={colAll(p)} onChange={() => toggleCol(p)} title={t('roles.all')} />
                        </div>
                      </th>
                    ))}
                    <th className='px-3 py-2 text-center font-semibold uppercase'>{t('roles.all')}</th>
                  </tr>
                </thead>
                <tbody>
                  {entities.map(e => (
                    <tr key={e} className='border-0 border-t border-solid border-gray-100 hover:bg-brand-50/50'>
                      <td className='px-4 py-2.5 font-semibold text-gray-800'>{t(`roles.entities.${e}`, e)}</td>
                      {perms.map(p => (
                        <td key={p} className='px-2 py-2.5 text-center'>
                          <input type='checkbox' className={cb} checked={!!matrix[e]?.[p]} onChange={() => toggle(e, p)} aria-label={`${e} ${p}`} />
                        </td>
                      ))}
                      <td className='px-3 py-2.5 text-center'>
                        <input type='checkbox' className={cb} checked={rowAll(e)} onChange={() => toggleRow(e)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </fieldset>

        <div className='sticky bottom-0 z-10 flex justify-end gap-2 rounded-b-xl border-0 border-t border-solid border-gray-200 bg-gray-50/95 px-6 py-4 backdrop-blur'>
          <Button variant='secondary' onClick={() => router.push('/role/list')}>
            {t('common.cancel')}
          </Button>
          <Button type='submit' icon='mdi:content-save-outline' loading={saving} disabled={loading}>
            {saving ? t('common.saving') : t('common.save')}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default RoleForm
