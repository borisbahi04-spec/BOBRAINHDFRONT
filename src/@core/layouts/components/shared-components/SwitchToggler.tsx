// ** MUI Imports
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types Import
import { Mode } from 'src/@core/layouts/types'
import { Settings } from 'src/@core/context/settingsContext'
import { useState } from 'react';
import SwitchBranModal from './SwitchBranchModal';

interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
}

const SwitchToggler = (props: Props) => {
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
      <Icon icon='mdi:home-switch'/>
    </IconButton>
    <SwitchBranModal open={open} handleOpenToggle={handleOpenToggle}/>
    </>
  )
}

export default SwitchToggler
