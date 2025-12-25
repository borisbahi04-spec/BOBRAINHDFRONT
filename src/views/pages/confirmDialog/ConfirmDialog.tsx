// ** React Imports
import { Fragment } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { Props } from 'react-apexcharts'
import Typography from '@mui/material/Typography'
import { IconButton } from '@mui/material'
import MoveUpIcon from '@mui/icons-material/MoveUp';
import DoNotTouchIcon from '@mui/icons-material/DoNotTouch';
import DeleteIcon from '@mui/icons-material/Delete';
import { ACTIONDELETE, ACTIONDELIVERY, ACTIONDISABLE,ACTIONRECEIVE } from 'src/definitions/enum'

interface Props {
  setOpen:any,
  open:boolean,
  submitAction:any,
  action:string,
  message:string
  row:any,
}

const ConfirmDialog = (props:Props) => {
  const {open,setOpen,row,submitAction,action,entityLabel ,message}=props;
  // ** State
  const handleClose = () => setOpen(false)

  const returnIcon=(action)=>{

    switch (action) {
        case ACTIONDISABLE:
        return <DoNotTouchIcon/>;
        case ACTIONDELETE:
          return <DeleteIcon/>;
        case ACTIONRECEIVE:
          return <MoveUpIcon/>;
        case ACTIONDELIVERY:
            return <MoveUpIcon/>;
      default:
        return null;
    }
  }

  const returnTitle=(action,entitylabel)=>{
    switch (action) {
      case ACTIONDISABLE:
        return `Désactiver ${entitylabel}`;
        case ACTIONDELETE:
          return `Supprimer ${entitylabel}`;
        case ACTIONRECEIVE:
          return `Reception ${entitylabel}`;
        case ACTIONDELIVERY:
          return `Sortie ${entitylabel}`;
      default:
        return null;
    }
  }
  const returnConfirmMessage=(action,entitylabel)=>{
    switch (action) {
      case ACTIONDISABLE:
        return `Etes-vous sûr de vouloir désactiver ${entitylabel}?`;
        case ACTIONDELETE:
          return `Etes-vous sûr de vouloir supprimer ${entitylabel}?`;
        case ACTIONRECEIVE:
          return `Etes-vous sûr de la reception ${entitylabel}?`;
        case ACTIONDELIVERY:
            return `Etes-vous sûr de la sortie ${entitylabel}?`;
          default:
        return null;
    }
  }

  const returnMessage=(action,entitylabel)=>{
    switch (action) {
      case ACTIONDISABLE:
        return message;
        case ACTIONDELETE:
          return message;
        case ACTIONRECEIVE:
          return message;
        case ACTIONDELIVERY:
            return message;
          default:
        return null;
    }
  }

  return (
    <Fragment>
       <Dialog
      open={open}
      disableEscapeKeyDown
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      maxWidth='xs'
      fullWidth
      sx={{ '@media (max-width: 400px)': { '& .MuiDialogTitle-root': { textAlign: 'center' } } }}
    >
      <DialogTitle id='alert-dialog-title' sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', display: 'flex', alignItems: 'center' }}>
        <IconButton color='inherit' onClick={handleClose} sx={{ mr: 1 }}>
          {returnIcon(action)}
        </IconButton>
        <Typography variant='h6' sx={{ flexGrow: 1 }}>{returnTitle(action,entityLabel)}</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {entityLabel && <Typography variant='body1' sx={{ color: 'text.secondary', mb: 3 }}>
            {returnConfirmMessage(action,entityLabel)}
          </Typography>}
          <Typography variant='body1' sx={{ color: 'text.secondary', mb: 1 }}>
            {returnMessage(action,entityLabel)}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>

      </DialogActions>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button sx={{ color: 'green', fontWeight: 600 }} onClick={()=>submitAction(row)}>
          Oui je confirme
        </Button>
        <Button sx={{ color: 'red', fontWeight: 600 }} onClick={handleClose}>
          Non pas encore prêt
        </Button>
      </DialogActions>
       </Dialog>
    </Fragment>
  )
}

export default ConfirmDialog
