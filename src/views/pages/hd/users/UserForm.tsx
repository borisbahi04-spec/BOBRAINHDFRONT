// Formulaire utilisateur (création / modification) — Tailwind, charte DKL, FR/EN
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'

import Icon from 'src/@core/components/icon'
import { useHd } from 'src/i18n/helpdesk'
import { extractApiError, isApiError } from 'src/helpers/apiError'
import { crudCreate, crudGet, crudUpdate } from 'src/myservices/hd/crud'
import { Button, Field, FormSection, Option, PageHeader, SearchSelect, Toggle, cn } from 'src/components/hd'
import { loadBranches, loadDepartments, loadRoles, toNamedOption, toRoleOption } from './options'

const PASSWORD_MIN = 8

interface Values {
  username: string
  lastName: string
  firstName: string
  email: string
  phoneNumber: string
  role: Option | null
  department: Option | null
  branch: Option | null
  newPassword: string
  confirm: string
  isActive: boolean
}

const UserForm = ({ id }: { id?: string }) => {
  const router = useRouter()
  const { t, lang } = useHd()
  const isEdit = !!id
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const schema = useMemo(
    () =>
      yup.object({
        username: yup
          .string()
          .trim()
          .required(t('users.errors.usernameRequired'))
          .min(3, t('form.errors.min', { min: 3 }))
          .max(60, t('form.errors.max', { max: 60 }))
          .matches(/^[A-Za-z0-9._@-]+$/, t('users.errors.usernameFormat')),
        lastName: yup.string().trim().max(80, t('form.errors.max', { max: 80 })),
        firstName: yup.string().trim().max(120, t('form.errors.max', { max: 120 })),
        email: yup.string().trim().email(t('users.errors.emailFormat')).max(150),
        phoneNumber: yup
          .string()
          .trim()
          .test('phone', t('users.errors.phoneFormat'), v => !v || /^\+?[0-9 ().-]{6,30}$/.test(v)),
        role: yup.object().nullable().required(t('users.errors.roleRequired')),
        department: yup.object().nullable().required(t('users.errors.departmentRequired')),
        branch: yup.object().nullable().required(t('users.errors.branchRequired')),
        newPassword: isEdit
          ? yup.string().test('min', t('users.errors.passwordMin', { min: PASSWORD_MIN }), v => !v || v.length >= PASSWORD_MIN)
          : yup.string().required(t('users.errors.passwordRequired')).min(PASSWORD_MIN, t('users.errors.passwordMin', { min: PASSWORD_MIN })),
        confirm: yup.string().test('match', t('users.errors.passwordMatch'), function (v) {
          return (this.parent.newPassword || '') === (v || '')
        }),
        isActive: yup.boolean()
      }),
    [t, lang, isEdit] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Values>({
    mode: 'onTouched',
    resolver: yupResolver(schema) as any,
    defaultValues: {
      username: '',
      lastName: '',
      firstName: '',
      email: '',
      phoneNumber: '',
      role: null,
      department: null,
      branch: null,
      newPassword: '',
      confirm: '',
      isActive: true
    }
  })

  // chargement de l'utilisateur à modifier
  useEffect(() => {
    if (!id) return
    setLoading(true)
    crudGet('user', id, 'role,branch,department').then((u: any) => {
      setLoading(false)
      if (isApiError(u) || !u?.id) return toast.error(extractApiError(u, t('common.unexpectedError')))
      reset({
        username: u.username ?? '',
        lastName: u.lastName ?? '',
        firstName: u.firstName ?? '',
        email: u.email ?? '',
        phoneNumber: u.phoneNumber ?? '',
        role: toRoleOption(u.role),
        department: toNamedOption(u.department),
        branch: toNamedOption(u.branch),
        newPassword: '',
        confirm: '',
        isActive: u.isActive !== false
      })
    })
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (v: Values) => {
    const dto: any = {
      username: v.username.trim(),
      lastName: v.lastName?.trim() || undefined,
      firstName: v.firstName?.trim() || undefined,
      email: v.email?.trim() || undefined,
      phoneNumber: v.phoneNumber?.trim() || undefined,
      roleId: v.role?.id,
      departmentId: v.department?.id,
      branchId: v.branch?.id,
      isActive: !!v.isActive
    }
    if (v.newPassword) dto.newPassword = v.newPassword
    setSaving(true)
    const res: any = isEdit ? await crudUpdate('user', id!, dto) : await crudCreate('user', dto)
    setSaving(false)
    if (isApiError(res)) return toast.error(extractApiError(res, t('common.unexpectedError')))
    toast.success(t('users.saved'))
    router.push('/user/list')
  }

  const err = (k: keyof Values) => (errors[k] as any)?.message as string | undefined

  return (
    <div className='mx-auto w-full max-w-5xl font-sans'>
      <PageHeader
        icon={isEdit ? 'mdi:account-edit-outline' : 'mdi:account-plus-outline'}
        title={isEdit ? t('users.editTitle') : t('users.newTitle')}
        actions={
          <Button variant='secondary' icon='mdi:arrow-left' onClick={() => router.push('/user/list')}>
            {t('common.back')}
          </Button>
        }
      />

      <form noValidate onSubmit={handleSubmit(onSubmit)} className='hd-card overflow-visible'>
        <fieldset disabled={loading || saving} className={cn('m-0 min-w-0 border-0 p-0', loading && 'animate-pulse')}>
          <FormSection icon='mdi:card-account-details-outline' title={t('users.sectionIdentity')} help={t('users.sectionIdentityHelp')}>
            <Field id='username' label={t('users.username')} required error={err('username')} className='md:col-span-2'>
              <input id='username' autoComplete='off' className={cn('hd-input font-mono', errors.username && 'hd-input-error')} {...register('username')} />
            </Field>
            <Field id='lastName' label={t('users.lastName')} error={err('lastName')}>
              <input id='lastName' className={cn('hd-input uppercase placeholder:normal-case', errors.lastName && 'hd-input-error')} {...register('lastName')} />
            </Field>
            <Field id='firstName' label={t('users.firstName')} error={err('firstName')}>
              <input id='firstName' className={cn('hd-input', errors.firstName && 'hd-input-error')} {...register('firstName')} />
            </Field>
          </FormSection>

          <FormSection icon='mdi:email-outline' title={t('users.sectionContact')} help={t('users.sectionContactHelp')}>
            <Field id='email' label={t('users.email')} error={err('email')}>
              <input id='email' type='email' className={cn('hd-input', errors.email && 'hd-input-error')} {...register('email')} />
            </Field>
            <Field id='phone' label={t('users.phone')} error={err('phoneNumber')}>
              <input id='phone' type='tel' className={cn('hd-input', errors.phoneNumber && 'hd-input-error')} {...register('phoneNumber')} />
            </Field>
          </FormSection>

          <FormSection icon='mdi:shield-account-outline' title={t('users.sectionAssign')} help={t('users.sectionAssignHelp')}>
            <Field id='role' label={t('users.role')} required error={err('role')}>
              <Controller name='role' control={control} render={({ field }) => <SearchSelect id='role' icon='mdi:shield-account-outline' value={field.value} onChange={field.onChange} onBlur={field.onBlur} loadOptions={loadRoles} invalid={!!errors.role} />} />
            </Field>
            <Field id='department' label={t('users.department')} required error={err('department')}>
              <Controller name='department' control={control} render={({ field }) => <SearchSelect id='department' icon='mdi:domain' value={field.value} onChange={field.onChange} onBlur={field.onBlur} loadOptions={loadDepartments} invalid={!!errors.department} />} />
            </Field>
            <Field id='branch' label={t('users.branch')} required error={err('branch')}>
              <Controller name='branch' control={control} render={({ field }) => <SearchSelect id='branch' icon='mdi:office-building-outline' value={field.value} onChange={field.onChange} onBlur={field.onBlur} loadOptions={loadBranches} invalid={!!errors.branch} />} />
            </Field>
            <div className='flex items-end pb-6'>
              <Toggle id='isActive' label={t('users.active')} {...register('isActive')} />
            </div>
          </FormSection>

          <FormSection icon='mdi:lock-outline' title={t('users.sectionSecurity')} help={isEdit ? t('users.sectionSecurityHelpEdit') : t('users.sectionSecurityHelpNew')}>
            <Field id='newPassword' label={t('users.password')} required={!isEdit} error={err('newPassword')} help={t('users.errors.passwordMin', { min: PASSWORD_MIN })}>
              <div className='relative'>
                <input id='newPassword' type={showPwd ? 'text' : 'password'} autoComplete='new-password' className={cn('hd-input pr-11', errors.newPassword && 'hd-input-error')} {...register('newPassword')} />
                <button type='button' onClick={() => setShowPwd(s => !s)} className='absolute inset-y-0 right-1.5 my-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-gray-400 hover:text-gray-700'>
                  <Icon icon={showPwd ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={18} />
                </button>
              </div>
            </Field>
            <Field id='confirm' label={t('users.passwordConfirm')} required={!isEdit} error={err('confirm')}>
              <input id='confirm' type={showPwd ? 'text' : 'password'} autoComplete='new-password' className={cn('hd-input', errors.confirm && 'hd-input-error')} {...register('confirm')} />
            </Field>
          </FormSection>
        </fieldset>

        <div className='sticky bottom-0 z-10 flex justify-end gap-2 rounded-b-xl border-0 border-t border-solid border-gray-200 bg-gray-50/95 px-6 py-4 backdrop-blur'>
          <Button variant='secondary' onClick={() => router.push('/user/list')}>
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

export default UserForm
