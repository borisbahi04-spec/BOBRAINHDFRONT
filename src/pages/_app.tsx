// ** React Imports
import { ReactNode } from 'react'

// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

import { SessionProvider } from "next-auth/react"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/fr';



// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports

import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'

// ** Fake-DB Import
import 'src/@fake-db'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import AuthGuard from 'src/@core/components/auth/AuthGuard'
import GuestGuard from 'src/@core/components/auth/GuestGuard'
import WindowWrapper from 'src/@core/components/window-wrapper'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** Prismjs Styles
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import { TranslatorProvider} from "react-translate"

import common_fr from "src/translations/fr/common.json";
import common_en from "src/translations/en/common.json";
// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

import 'src/iconify-bundle/icons-bundle-react'

// ** Global css styles
import '../../styles/globals.css'
import '../../styles/clockStyle.css'

import React from 'react'
import { store } from 'src/redux/store'
import { Provider } from 'react-redux'
import AclGuard from 'src/@core/components/auth/AclGuard'
import { translations } from 'src/translations'
import i18next from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { LocalizationProvider } from '@mui/x-date-pickers'

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
  session:any
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {

  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {

    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  }
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps,session } = props

i18next.init({
    interpolation: { escapeValue: false },  // React already does escaping
    lng: 'fr',                              // language to use
    resources: {
        en: {
            common: common_en               // 'common' is our custom namespace
        },
        fr: {
            common: common_fr
        },
      }
});



  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false
  const getLayout =
    Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>)

  const setConfig = Component.setConfig ?? undefined

  const authGuard = Component.authGuard ?? true

  const guestGuard = Component.guestGuard ?? false

  const aclAbilities = Component.acl ?? defaultACLObj


/*themeConfig.templateName*/
  return (
    <Provider store={store} >

      <CacheProvider value={emotionCache}>
        <Head>
          <title>{`BoBrain-Helpdesk`}</title>
          <meta
            name='description'
          />
          <meta name='keywords' content='BoBrain-Helpdesk' />
          <meta name='viewport' content='initial-scale=1, width=device-width' />
        </Head>
        {/*<AuthProvider>*/}
          <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
            <SettingsConsumer>
            {({ settings }) => {
                return (


                  <ThemeComponent settings={settings}>
                    <WindowWrapper>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                      <TranslatorProvider translations={translations}>
                          <I18nextProvider i18n={i18next}>
                            <SessionProvider session={session}>
                              <Guard authGuard={authGuard} guestGuard={guestGuard}>
                              <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard}>
                                  {getLayout(<Component {...pageProps}/>)}
                              </AclGuard>
                            </Guard>
                            </SessionProvider>
                          </I18nextProvider>
                      </TranslatorProvider>
                      </LocalizationProvider>
                    </WindowWrapper>
                    <ReactHotToast>
                      <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                    </ReactHotToast>
                  </ThemeComponent>
                )
              }}
            </SettingsConsumer>
          </SettingsProvider>
        {/*</AuthProvider>*/}
      </CacheProvider>
      </Provider>

  )
}


export default App
