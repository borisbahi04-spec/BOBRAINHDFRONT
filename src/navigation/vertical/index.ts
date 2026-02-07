// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { EntityAbility, UserAction } from 'src/configs/Action'
import { PAGE_SETTINGS } from 'src/definitions/constantes'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Acceuil',
      path:'/home',
      icon: 'mdi:home-outline',
      action: UserAction.Read,
      subject:EntityAbility.BRANCH,
    },

     {
      title:PAGE_SETTINGS.requester.title,
      path:'/requester/list',
      icon: PAGE_SETTINGS.requester.icon,
      action: UserAction.Read,
      subject:EntityAbility.REQUESTER,
    },
    {
      title: PAGE_SETTINGS.user.title,
      icon: PAGE_SETTINGS.user.icon,
      action: UserAction.Read,
      subject:EntityAbility.USER,
      children: [
        {
          title: PAGE_SETTINGS.user.title,
          icon: PAGE_SETTINGS.user.icon,
          path: '/user/list',
          action: UserAction.Read,
          subject:EntityAbility.USER,
        },
        {
          title: PAGE_SETTINGS.roles.title,
          path: '/role/list',
          icon: PAGE_SETTINGS.roles.icon,
          action: UserAction.Read,
          subject:EntityAbility.ROLE,
        },
        {
          title: PAGE_SETTINGS.departments.title,
          path:'/department/list',
          icon: PAGE_SETTINGS.departments.icon,
          action: UserAction.Read,
          subject:EntityAbility.DEPARTMENT,
        },
        {
          title: PAGE_SETTINGS.stations.title,
          path:'/station/list',
          icon: PAGE_SETTINGS.stations.icon,
          action: UserAction.Read,
          subject:EntityAbility.STATION,
        },
        {
          title: PAGE_SETTINGS.requestTypes.title,
          path:'/requesttype/list',
          icon: PAGE_SETTINGS.requestTypes.icon,
          action: UserAction.Read,
          subject:EntityAbility.BRANCH,
        },
      ]
    },
  ]
}

export default navigation
