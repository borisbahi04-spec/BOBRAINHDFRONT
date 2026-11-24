// Page « Mon compte » — Tailwind, charte DKL, FR/EN
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { signOut } from 'next-auth/react'

import Icon from 'src/@core/components/icon'
import { AppDispatch, RootState } from 'src/redux/store'
import { RST_UserProfileAction } from 'src/redux/actions/Auth/AuthActions'
import { RST_ChangeMyPasswordService } from 'src/myservices/Auth/AuthService'
import { crudUpdate } from 'src/myservices/hd/crud'
import { regexpasswords } from 'src/helpers'
import { useHd } from 'src/i18n/helpdesk'
import { extractApiError, isApiError } from 'src/helpers/apiError'
import { Button, Field, FormSection, PageHeader, cn } from 'src/components/hd'

type TabKey = 'account' | 'security'

interface ProfileValues {
  lastName: string
  firstName: string
  email: string
  phoneNumber: string
}

interface PasswordValues {
  currentPassword: string
  password: string
  confirmPassword: string
}

const initials = (first?: string, last?: string, username?: string) =>
  ([last?.[0], first?.[0]].filter(Boolean).join('') || username?.slice(0, 2) || '?').toUpperCase()

/* ----------------------------- Onglet Profil ----------------------------- */

const ProfileForm = ({ user }: { user: any }) => {
  const { t } = useHd()
  const dispatch = useDispatch<AppDispatch>()
  const [saving, setSaving] = useState(false)

  const schema = useMemo(
    () =>
      yup.object({
        lastName: yup.string().trim().required(t('profile.errors.required')).max(80, t('form.errors.max', { max: 80 })),
        firstName: yup.string().trim().required(t('profile.errors.required')).max(120, t('form.errors.max', { max: 120 })),
        email: yup.string().trim().email(t('profile.errors.emailFormat')).max(150),
        phoneNumber: yup
          .string()
          .trim()
          .test('phone', t('profile.errors.phoneFormat'), v => !v || /^\+?[0-9 ().-]{6,30}$/.test(v))
      }),
    [t]
  )

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<ProfileValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: { lastName: '', firstName: '', email: '', phoneNumber: '' }
  })

  useEffect(() => {
    reset({
      lastName: user?.lastName ?? '',
      firstName: user?.firstName ?? '',
      email: user?.email ?? '',
      phoneNumber: user?.phoneNumber ?? ''
    })
  }, [user, reset])

  const onSubmit = async (v: ProfileValues) => {
    if (!isDirty) return toast(t('profile.noChange'))
    setSaving(true)
    const res: any = await crudUpdate('auth', 'profile', {
      lastName: v.lastName.trim(),
      firstName: v.firstName.trim(),
      email: v.email?.trim() ?? '',
      phoneNumber: v.phoneNumber?.trim() ?? ''
    })
    setSaving(false)
    if (isApiError(res)) return toast.error(extractApiError(res, t('common.unexpectedError')))
    toast.success(t('profile.saved'))
    dispatch(RST_UserProfileAction())
  }

  const err = (k: keyof ProfileValues) => errors[k]?.message as string | undefined

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className='hd-card overflow-visible'>
      <FormSection icon='mdi:card-account-details-outline' title={t('profile.sectionIdentity')} help={t('profile.sectionIdentityHelp')}>
        <Field id='username' label={t('profile.username')} className='md:col-span-2'>
          <input id='username' className='hd-input cursor-not-allowed bg-gray-50 font-mono text-gray-500' value={user?.username ?? ''} disabled readOnly />
        </Field>
        <Field id='lastName' label={t('users.lastName')} required error={err('lastName')}>
          <input id='lastName' className={cn('hd-input uppercase', errors.lastName && 'hd-input-error')} {...register('lastName')} />
        </Field>
        <Field id='firstName' label={t('users.firstName')} required error={err('firstName')}>
          <input id='firstName' className={cn('hd-input', errors.firstName && 'hd-input-error')} {...register('firstName')} />
        </Field>
      </FormSection>

      <FormSection icon='mdi:email-outline' title={t('profile.sectionContact')} help={t('profile.sectionContactHelp')}>
        <Field id='email' label={t('users.email')} error={err('email')}>
          <input id='email' type='email' className={cn('hd-input', errors.email && 'hd-input-error')} {...register('email')} />
        </Field>
        <Field id='phoneNumber' label={t('users.phone')} error={err('phoneNumber')}>
          <input id='phoneNumber' type='tel' placeholder='+225 07 00 00 00 00' className={cn('hd-input', errors.phoneNumber && 'hd-input-error')} {...register('phoneNumber')} />
        </Field>
      </FormSection>

      <div className='flex justify-end gap-2 rounded-b-xl border-0 border-t border-solid border-gray-200 bg-gray-50 px-6 py-4'>
        <Button variant='secondary' disabled={!isDirty || saving} onClick={() => reset()}>
          {t('common.cancel')}
        </Button>
        <Button type='submit' icon='mdi:content-save-outline' loading={saving}>
          {saving ? t('common.saving') : t('common.save')}
        </Button>
      </div>
    </form>
  )
}

/* ---------------------------- Onglet Sécurité ---------------------------- */

const PasswordForm = () => {
  const { t } = useHd()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [show, setShow] = useState(false)

  const schema = useMemo(
    () =>
      yup.object({
        currentPassword: yup.string().required(t('profile.errors.required')),
        password: yup.string().required(t('profile.errors.required')).matches(regexpasswords, t('profile.errors.passwordFormat')),
        confirmPassword: yup
          .string()
          .required(t('profile.errors.required'))
          .oneOf([yup.ref('password')], t('profile.errors.passwordMismatch'))
      }),
    [t]
  )

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PasswordValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: { currentPassword: '', password: '', confirmPassword: '' }
  })

  const onSubmit = async (v: PasswordValues) => {
    setSaving(true)
    const res: any = await RST_ChangeMyPasswordService(v)
    setSaving(false)
    if (isApiError(res)) return toast.error(extractApiError(res, t('common.unexpectedError')))
    toast.success(t('profile.passwordChanged'))
    await signOut({ redirect: false, callbackUrl: '/login' })
    router.push('/login')
  }

  const err = (k: keyof PasswordValues) => errors[k]?.message as string | undefined
  const type = show ? 'text' : 'password'

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className='hd-card overflow-visible'>
      <FormSection icon='mdi:lock-outline' title={t('profile.sectionPassword')} help={t('profile.sectionPasswordHelp')}>
        <Field id='currentPassword' label={t('profile.currentPassword')} required error={err('currentPassword')} className='md:col-span-2'>
          <div className='relative md:max-w-[calc(50%-0.625rem)]'>
            <input id='currentPassword' type={type} autoComplete='current-password' className={cn('hd-input pr-11', errors.currentPassword && 'hd-input-error')} {...register('currentPassword')} />
            <button
              type='button'
              aria-label='Afficher / masquer'
              onClick={() => setShow(s => !s)}
              className='absolute inset-y-0 right-1.5 my-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-gray-400 hover:text-gray-700'
            >
              <Icon icon={show ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={18} />
            </button>
          </div>
        </Field>
        <Field id='password' label={t('profile.newPassword')} required error={err('password')} help={t('profile.passwordRule')}>
          <input id='password' type={type} autoComplete='new-password' className={cn('hd-input', errors.password && 'hd-input-error')} {...register('password')} />
        </Field>
        <Field id='confirmPassword' label={t('profile.confirmPassword')} required error={err('confirmPassword')}>
          <input id='confirmPassword' type={type} autoComplete='new-password' className={cn('hd-input', errors.confirmPassword && 'hd-input-error')} {...register('confirmPassword')} />
        </Field>
      </FormSection>

      <div className='flex justify-end gap-2 rounded-b-xl border-0 border-t border-solid border-gray-200 bg-gray-50 px-6 py-4'>
        <Button type='submit' icon='mdi:lock-reset' loading={saving}>
          {t('profile.changePassword')}
        </Button>
      </div>
    </form>
  )
}

/* --------------------------------- Page ---------------------------------- */

const AccountSettings = ({ tab }: { tab: string }) => {
  const { t } = useHd()
  const router = useRouter()
  const session = useSelector((state: RootState) => state.auth?.getuserprofile?.session)
  const user = session?.user ?? session?.userData ?? {}
  const active: TabKey = tab === 'security' ? 'security' : 'account'

  const tabs: { key: TabKey; icon: string; label: string }[] = [
    { key: 'account', icon: 'mdi:account-outline', label: t('profile.tabAccount') },
    { key: 'security', icon: 'mdi:lock-outline', label: t('profile.tabSecurity') }
  ]

  const fullName = [user?.lastName, user?.firstName].filter(Boolean).join(' ') || session?.username

  return (
    <div className='mx-auto w-full max-w-5xl font-sans'>
      <PageHeader icon='mdi:account-cog-outline' title={t('profile.title')} subtitle={t('profile.subtitle')} />

      {/* Carte résumé */}
      <div className='hd-card mb-5 flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center'>
        <span className='flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white'>
          {initials(user?.firstName, user?.lastName, session?.username)}
        </span>
        <div className='min-w-0 flex-1'>
          <p className='m-0 truncate text-base font-bold text-brand-700'>{fullName}</p>
          <p className='m-0 mt-0.5 truncate font-mono text-xs text-gray-500'>{session?.username}</p>
        </div>
        <div className='flex flex-wrap gap-2 text-xs'>
          <span className='inline-flex items-center gap-1.5 rounded-full bg-leaf-50 px-3 py-1 font-semibold text-brand-700'>
            <Icon icon='mdi:shield-account-outline' fontSize={14} />
            {t('profile.role')} : {session?.role?.displayName ?? '—'}
          </span>
          <span className='inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-700'>
            <Icon icon='mdi:domain' fontSize={14} />
            {t('profile.branch')} : {session?.targetBranch?.displayName ?? '—'}
          </span>
        </div>
      </div>

      {/* Onglets */}
      <div role='tablist' className='mb-4 flex gap-1 rounded-xl border border-solid border-gray-200 bg-white p-1 sm:inline-flex'>
        {tabs.map(tb => (
          <button
            key={tb.key}
            type='button'
            role='tab'
            aria-selected={active === tb.key}
            onClick={() => active !== tb.key && router.push(`/user-profile/${tb.key}`)}
            className={cn(
              'flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-0 px-4 py-2 text-sm font-semibold transition-colors sm:flex-none',
              active === tb.key ? 'bg-brand-600 text-white shadow-card' : 'bg-transparent text-gray-600 hover:bg-gray-100'
            )}
          >
            <Icon icon={tb.icon} fontSize={18} />
            {tb.label}
          </button>
        ))}
      </div>

      {active === 'account' ? <ProfileForm user={user} /> : <PasswordForm />}
    </div>
  )
}

export default AccountSettings
