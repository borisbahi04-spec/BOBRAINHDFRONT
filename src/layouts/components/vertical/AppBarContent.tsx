/* eslint-disable @typescript-eslint/no-unused-vars */
// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { useSelector } from 'react-redux'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import OpenDashboard from 'src/@core/layouts/components/shared-components/OpenDashboard'
import SwitchToggler from 'src/@core/layouts/components/shared-components/SwitchToggler'
import TitlePage from 'src/@core/layouts/components/shared-components/TitlePage'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import { RootState } from 'src/redux/store'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props
  const authuser = useSelector((state: RootState) => state.auth.getuserprofile)
  const auth=authuser?.session;


  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon icon='mdi:menu' />
          </IconButton>
        ) : null}
        <TitlePage settings={settings} saveSettings={saveSettings} />
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        {/*auth?.role && auth.role.adminPermission && (
        <OpenDashboard settings={settings} saveSettings={saveSettings}/>
        )*/}
        {/*<SwitchToggler settings={settings} saveSettings={saveSettings}/>*/}
        <UserDropdown settings={settings}/>
      </Box>
    </Box>
  )
}

export default AppBarContent
