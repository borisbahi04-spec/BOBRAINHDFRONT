// ** Next Import
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'
import { EntityAbility, UserAction } from 'src/configs/Action'

// ** Third Party Imports

// ** Types

// ** Demo Components Imports
import AccountSettings from 'src/views/pages/user-profile/AccountSettings'

const AccountSettingsTab = ({ tab }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <AccountSettings tab={tab}  />
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'account' } },
      { params: { tab: 'security' } },
      { params: { tab: 'billing' } },
      { params: { tab: 'notifications' } },
      { params: { tab: 'connections' } }
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
