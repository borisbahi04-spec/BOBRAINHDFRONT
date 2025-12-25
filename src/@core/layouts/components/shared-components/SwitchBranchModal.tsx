// ** React Imports
import { Ref, useState, forwardRef, ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TabContext from '@mui/lab/TabContext'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hook Imports
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Tab Content Imports
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/redux/store'
import DialogBranchTabDetails from './DialogBranchTabDetails'
import { RST_SwitchBranchAction } from 'src/redux/actions/Auth/AuthActions'
import toast from 'react-hot-toast'

interface TabLabelProps {
  title: string
  active: boolean
  subtitle: string
  icon: ReactElement
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const TabLabel = (props: TabLabelProps) => {
  const { icon, title, subtitle, active } = props

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          sx={{
            mr: 3,
            ...(active
              ? { color: 'common.white', backgroundColor: 'primary.main' }
              : { backgroundColor: 'action.selected' })
          }}
        >
          {icon}
        </Avatar>
        <Box sx={{ textAlign: 'left' }}>
          <Typography>{title}</Typography>
          <Typography variant='caption' sx={{ textTransform: 'none' }}>
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </div>
  )
}


const SwitchBranchModal = ({open,handleOpenToggle}) => {
  // ** States
  const [activeTab, setActiveTab] = useState<string>('submitTab')
  const [branchId, setBranchId] = useState<string>()
  const [desableSubmit, setdesableSubmit] = useState<boolean>(true)


  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.branch.data)

  // ** Hook
  const { settings } = useSettings()

  // ** Var
  const { direction } = settings

  const handleClose = () => {
    handleOpenToggle()
    setActiveTab('submitTab')
    setBranchId('')
    setdesableSubmit(true)

  }


  const submitSwitchBranch = (branchId:string) => {
    const _onSuccess=(res:any)=>{
      setdesableSubmit(true)
      handleClose()
      //toast.success(` Changement de surccusale effectue avec succès`,{position:'top-center'})
      window.location.reload()
    }
    const _onError=(res:any)=>{
      const {errors}=res;
      toast.error(`Error ${errors}`,{position:'top-center'})
    }
    dispatch(RST_SwitchBranchAction(branchId,_onSuccess,_onError))

  }


  const renderTabFooter = (props:any) => {
    return (
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant='contained'
          color='error'
          disabled={activeTab === 'detailsTab'}
          onClick={handleClose}
          endIcon={<Icon icon='mdi:cancel-outline' />}
        >
          Annuler
        </Button>
        <Button
          variant='contained'
          color={activeTab === 'submitTab' ? 'success' : 'primary'}
          endIcon={<Icon icon='mdi:check' />}
          disabled={desableSubmit}
          onClick={()=>props.submitSwitchBranch(branchId)}
        >
          {activeTab === 'submitTab' ? 'Valider' : 'Valider'}
        </Button>
      </Box>
    )
  }


  return (
    <Card>

      <Dialog
        fullWidth
        open={open}
        scroll='body'
        maxWidth='md'
        onClose={handleClose}
        onBackdropClick={handleClose}
        TransitionComponent={Transition}
      >
        <DialogContent
          sx={{
            pt: { xs: 8, sm: 12.5 },
            pr: { xs: 5, sm: 12 },
            pb: { xs: 5, sm: 9.5 },
            pl: { xs: 4, sm: 11 },
            position: 'relative'
          }}
        >
          <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
            <Icon icon='mdi:close' />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3 }}>
              Migrer vers une autre Surccusale
            </Typography>
            <Typography variant='body2'>Selectionner puis valider la Surccusale sur laquelle vous voulez migrer .</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
            <TabContext value={activeTab}>
              <TabList
                orientation='vertical'
                //onChange={(e, newValue: string) => setActiveTab(submitTab)}
                sx={{
                  border: 0,
                  minWidth: 200,
                  '& .MuiTabs-indicator': { display: 'none' },
                  '& .MuiTabs-flexContainer': {
                    alignItems: 'flex-start',
                    '& .MuiTab-root': {
                      width: '100%',
                      alignItems: 'flex-start'
                    }
                  }
                }}
              >

                <Tab
                  disableRipple
                  value='submitTab'
                  label={
                    <TabLabel
                      title='Surccusale'
                      subtitle='faire le choix'
                      icon={<Icon icon='mdi:check' />}
                      active={activeTab === 'submitTab'}
                    />
                  }
                />
              </TabList>

              <TabPanel value='submitTab' sx={{ flexGrow: 1 }}>
               <DialogBranchTabDetails branchs={store?.data} setBranchId={setBranchId} setdesableSubmit={setdesableSubmit} />
                {renderTabFooter({submitSwitchBranch:submitSwitchBranch})}
              </TabPanel>
            </TabContext>
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default SwitchBranchModal
