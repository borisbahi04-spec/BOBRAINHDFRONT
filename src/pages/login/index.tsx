// Page de connexion — Tailwind, charte Dekel, FR / EN
import { ReactNode, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { getProviders, getSession, signIn } from 'next-auth/react'
import CryptoJS from 'crypto-js'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import Icon from 'src/@core/components/icon'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useHd } from 'src/i18n/helpdesk'
import { Button, Field, LangSwitch, cn } from 'src/components/hd'
import { safeReturnUrl } from 'src/helpers/sessionExpiry'

interface FormData {
  username: string
  password: string
}

const LoginPage = () => {
  const router = useRouter()
  const { t, lang } = useHd()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const expired = router.query.expired
  const expiredNotice = !error && (expired === 'idle' ? t('session.idleNotice') : expired ? t('session.expiredNotice') : '')

  const schema = useMemo(
    () =>
      yup.object({
        username: yup.string().trim().required(t('login.usernameRequired')),
        password: yup.string().required(t('login.passwordRequired')).min(5, t('login.passwordMin'))
      }),
    [t, lang] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({ defaultValues: { username: '', password: '' }, mode: 'onTouched', resolver: yupResolver(schema) })

  const onSubmit = async ({ username, password }: FormData) => {
    setSubmitting(true)
    setError('')
    const SECRET_KEY: any = process.env.NEXT_PUBLIC_CRYPTO_KEY
    // chiffrement AES (inchangé : attendu par le provider « credentials »)
    const res: any = await signIn('credentials', {
      username: CryptoJS.AES.encrypt(username.trim(), SECRET_KEY).toString(),
      password: CryptoJS.AES.encrypt(password, SECRET_KEY).toString(),
      redirect: false,
      callbackUrl: safeReturnUrl(router.query.returnUrl) ?? '/'
    })
    if (!res || res.error) {
      let message = t('login.invalid')
      try {
        message = JSON.parse(res?.error)?.message || message
      } catch {
        /* message par défaut */
      }
      setError(message)
      setSubmitting(false)
      return
    }
    router.push(safeReturnUrl(router.query.returnUrl) ?? '/')
  }

  return (
    <div className='flex min-h-screen w-full bg-white font-sans'>
      {/* Panneau marque */}
      <div className='relative hidden w-[46%] flex-col justify-between overflow-hidden bg-brand-600 p-12 text-white lg:flex'>
        <div className='absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-500/40' />
        <div className='absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-brand-700/60' />
        <div className='relative flex items-center gap-3'>
          <span className='flex items-center rounded-xl bg-white px-3 py-2 shadow-card'>
            <img src='/images/bobrain-logo.png' alt='BOBRAIN' className='h-9 w-auto' />
          </span>
          <span className='text-xs font-bold uppercase tracking-wider text-harvest-500'>Helpdesk</span>
        </div>
        <div className='relative max-w-md'>
          <h2 className='m-0 text-3xl font-bold leading-tight'>{t('login.heroTitle')}</h2>
          <p className='m-0 mt-4 text-base text-brand-100'>{t('login.heroText')}</p>
          <ul className='m-0 mt-8 list-none space-y-3 p-0'>
            {['heroPoint1', 'heroPoint2', 'heroPoint3'].map(k => (
              <li key={k} className='flex items-center gap-3 text-sm'>
                <span className='flex h-6 w-6 items-center justify-center rounded-full bg-harvest-500 text-white'>
                  <Icon icon='mdi:check' fontSize={14} />
                </span>
                {t(`login.${k}`)}
              </li>
            ))}
          </ul>
        </div>
        <p className='relative m-0 text-xs text-brand-200'>© {new Date().getFullYear()} Dekel Agri-Vision</p>
      </div>

      {/* Formulaire */}
      <div className='flex flex-1 flex-col'>
        <div className='flex justify-end p-5'>
          <LangSwitch />
        </div>
        <div className='flex flex-1 items-center justify-center px-6 pb-16'>
          <div className='w-full max-w-sm animate-fade-in'>
            <img src='/images/bobrain-logo.png' alt='BOBRAIN' className='mb-8 h-14 w-auto lg:hidden' />
            <h1 className='m-0 text-2xl font-bold text-gray-900'>{t('login.title')}</h1>
            <p className='m-0 mt-1.5 text-sm text-gray-500'>{t('login.subtitle')}</p>

            {expiredNotice && (
              <div role='status' className='mt-6 flex items-start gap-2 rounded-lg border border-solid border-harvest-100 bg-harvest-50 px-3.5 py-3 text-sm text-harvest-700'>
                <Icon icon='mdi:clock-alert-outline' fontSize={18} className='mt-px shrink-0' />
                {expiredNotice}
              </div>
            )}

            {error && (
              <div role='alert' className='mt-6 flex items-start gap-2 rounded-lg border border-solid border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700'>
                <Icon icon='mdi:alert-circle-outline' fontSize={18} className='mt-px shrink-0' />
                {error}
              </div>
            )}

            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='mt-6 space-y-1'>
              <Field id='username' label={t('login.username')} error={errors.username?.message}>
                <input
                  id='username'
                  autoFocus
                  autoComplete='username'
                  className={cn('hd-input', errors.username && 'hd-input-error')}
                  aria-invalid={!!errors.username}
                  {...register('username')}
                />
              </Field>
              <Field id='password' label={t('login.password')} error={errors.password?.message}>
                <div className='relative'>
                  <input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='current-password'
                    className={cn('hd-input pr-11', errors.password && 'hd-input-error')}
                    aria-invalid={!!errors.password}
                    {...register('password')}
                  />
                  <button
                    type='button'
                    aria-label={t('login.showPassword')}
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => setShowPassword(v => !v)}
                    className='absolute inset-y-0 right-1.5 my-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-gray-400 hover:text-gray-700'
                  >
                    <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={18} />
                  </button>
                </div>
              </Field>
              <Button type='submit' loading={submitting} className='!mt-4 h-11 w-full' icon='mdi:login-variant'>
                {submitting ? t('login.submitting') : t('login.submit')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async (context: any) => {
  const { req } = context
  const session = await getSession({ req })

  // Redirige un utilisateur déjà connecté (pas d'écriture dans le store redux global ici).
  if (session?.user) {
    return { redirect: { destination: '/', permanent: false } }
  }

  return { props: { providers: (await getProviders()) ?? [] } }
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
