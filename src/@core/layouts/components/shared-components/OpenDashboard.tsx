// ** MUI Imports
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types Import
import { Settings } from 'src/@core/context/settingsContext'
import { useState } from 'react';
import DashBoardDialog from 'src/modals/DashBoard';

interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
}

const OpenDashboard = (props: Props) => {
  // ** Props
  const [open, setOpen] = useState<boolean>(false)


  const handleOpenToggle = () => {
    if(!open){
      setOpen(true)
    }else{
      setOpen(false)
    }
  }

  return (
   <>
    <IconButton color='inherit' aria-haspopup='true' onClick={handleOpenToggle}>
      <Icon icon='mdi:checkerboard'/>
    </IconButton>
    <DashBoardDialog open={open} handleOpenToggle={handleOpenToggle}/>
    </>
  )
}

export default OpenDashboard
