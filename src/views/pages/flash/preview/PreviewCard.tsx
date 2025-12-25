// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MessageIcon from '@mui/icons-material/Message';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import the ArrowBack icon
import MenuIcon from '@mui/icons-material/Menu';
// ** Configs

// ** Types
import { useTheme } from '@emotion/react'
import Box from '@mui/material/Box'
import { AppBar, Toolbar, Button, Container, Avatar, IconButton, Menu, MenuItem } from '@mui/material'
import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { RST_DeleteFlashAction } from 'src/redux/actions/flash/flash-actions';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/redux/store';
import { AbilityContext } from 'src/layouts/components/acl/Can';
import { EntityAbility, UserAction } from 'src/configs/Action';

interface Props {
  data: SingleInvoiceType
}






const PreviewCard = (props: Props) => {
  const theme = useTheme()
  const router = useRouter()
  const {data}=props
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch<AppDispatch>()
  const ability = useContext(AbilityContext)

  const [open, setOpen] = useState<boolean>(false)

  const handleGoBack = () => {
    router.push('/flash/list')
  };

  const handleOpenToggle =()=>{
    if(!open){
      setOpen(true)
    }else{
      setOpen(false)
    }
    setAnchorEl(null);
  }



 const handleDelete = () => {
  const onSuccess = (res) => {
    //dispatch(RST_FlashsAction())
    router.push(`/flash/list`)
    toast.success(`Suppression '${data.firstName}' effectué avec succès`,{position:'top-center'})
  }
  const onError = (res:any) => {
    toast.error(`${res.message}`,{position:'top-center'})
  }
  dispatch(RST_DeleteFlashAction(data.id,onSuccess,onError))
  setAnchorEl(null);
}
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (data) {
    return (
      <>
          <Card >
                <AppBar position="static">
                  <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="back" onClick={handleGoBack}>
                      <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    </Typography>
                     <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    </Typography>
                    {
                    ability.can(UserAction.Edit, EntityAbility.ORDER) && (
                      <Button color="inherit" onClick={()=>router.push(`/flash/edit/${data.id}`)}>Editer le flash </Button>
                    )}
                    <IconButton color="inherit" onClick={handleMenuOpen}>
                {/* Three dots icon for menu */}
                    <MenuIcon />
                    </IconButton>
                      {/* Menu List */}
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      { ability.can(UserAction.Delete, EntityAbility.ORDER) && (
                        <MenuItem onClick={handleDelete}>Suprimer le flash</MenuItem>
                      )}
                    </Menu>
                  </Toolbar>
                </AppBar>
                <Container sx={{ mt: 2 }}>
                  <Typography variant="h5" gutterBottom align="center" sx={{mb:5}}>
                    {` ${data.sentWeight} kg`}
                  </Typography>




                </Container>
          </Card>

      </>

    )
  } else {
    return null
  }
  }



export default PreviewCard
