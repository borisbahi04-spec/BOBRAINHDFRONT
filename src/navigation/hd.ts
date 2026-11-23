// Navigation du nouveau layout (style « chatbot »)
import { EntityAbility, UserAction } from 'src/configs/Action'

export interface HdNavItem {
  key: string // clé i18n : nav.<key>
  path?: string
  icon: string
  action: string
  subject: string
  children?: HdNavItem[]
}

export const HD_NAV: HdNavItem[] = [
  { key: 'home', path: '/home', icon: 'mdi:home-outline', action: UserAction.Read, subject: EntityAbility.BRANCH },
  { key: 'requests', path: '/requester/list', icon: 'mdi:clipboard-list-outline', action: UserAction.Read, subject: EntityAbility.REQUESTER },
  {
    key: 'admin',
    icon: 'mdi:cog-outline',
    action: UserAction.Read,
    subject: EntityAbility.USER,
    children: [
      { key: 'users', path: '/user/list', icon: 'mdi:account-group-outline', action: UserAction.Read, subject: EntityAbility.USER },
      { key: 'roles', path: '/role/list', icon: 'mdi:shield-account-outline', action: UserAction.Read, subject: EntityAbility.ROLE },
      { key: 'departments', path: '/department/list', icon: 'mdi:domain', action: UserAction.Read, subject: EntityAbility.DEPARTMENT },
      { key: 'stations', path: '/station/list', icon: 'mdi:factory', action: UserAction.Read, subject: EntityAbility.STATION },
      { key: 'labAgents', path: '/labagent/list', icon: 'mdi:flask-outline', action: UserAction.Read, subject: EntityAbility.STATION },
      { key: 'requestTypes', path: '/requesttype/list', icon: 'mdi:shape-outline', action: UserAction.Read, subject: EntityAbility.BRANCH }
    ]
  }
]
