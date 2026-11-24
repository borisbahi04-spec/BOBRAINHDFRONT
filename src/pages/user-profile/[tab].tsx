import { useEffect } from 'react'
import { useSettings } from 'src/@core/hooks/useSettings'
// ** Next Import
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'
import { EntityAbility, UserAction } from 'src/configs/Action'

// ** Third Party Imports

// ** Types

// ** Demo Components Imports
import AccountSettings from 'src/views/pages/user-profile/AccountSettings'

const AccountSettingsTab = ({ tab }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { settings, saveSettings } = useSettings()

  useEffect(() => {
    saveSettings({ ...settings, iconPage: 'mdi:account-cog-outline', titlePage: 'MON COMPTE' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <AccountSettings tab={tab} />
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'account' } },
      { params: { tab: 'security' } }
    ],
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }:GetStaticPropsContext) => {
return {
    props: {
      tab: params?.tab,
    }
  }
}


AccountSettingsTab.acl = {
  action:UserAction.Read,
  subject:EntityAbility.BRANCH
}

AccountSettingsTab.authGuard = true

export default AccountSettingsTab
