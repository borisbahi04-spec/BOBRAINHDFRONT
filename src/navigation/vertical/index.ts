// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { EntityAbility, UserAction } from 'src/configs/Action'

const navigation = (): VerticalNavItemsType => {
  return [
    /*{
      title: 'Acceuil',
      path:'/home/list',
      icon: 'mdi:home-outline',
      action: UserAction.Read,
      subject:EntityAbility.BRANCH,
    },*/
     {
      title: 'Flash Info',
      path:'/flash/list',
      icon: 'mdi:home-outline',
      action: UserAction.Read,
      subject:EntityAbility.BRANCH,
    },
    {
      title: 'Utilisateur & Rôle',
      icon: 'mdi:account-group',
      action: UserAction.Read,
      subject:EntityAbility.USER,
      children: [
        {
          title: 'Liste Utilisateurs',
          icon: 'mdi:account-group',
          path: '/user/list',
          action: UserAction.Read,
          subject:EntityAbility.USER,
        },
        {
          title: 'Rôle',
          path: '/role/list',
          icon: 'mdi-google-controller',
          action: UserAction.Read,
          subject:EntityAbility.ROLE,
        },
      ]
    },
  ]
}

export default navigation
