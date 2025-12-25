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
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material'
interface Props {
  setOpen:any,
  open:boolean,
  submitAction:any,
  action:string,
  row:any,
}

const DialogDelete = (props:Props) => {
  const {open,setOpen,row,submitAction}=props;

  // ** State


  const handleClose = () => setOpen(false)

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
      sx={{ '@media (max-width: 600px)': { '& .MuiDialogTitle-root': { textAlign: 'center' } } }}
    >
      <DialogTitle id='alert-dialog-title' sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', display: 'flex', alignItems: 'center' }}>
        <IconButton color='inherit' onClick={handleClose} sx={{ mr: 1 }}>
          <DeleteIcon />
        </IconButton>
        <Typography variant='h6' sx={{ flexGrow: 1 }}>{`Suppression de :: ${row.displayName}`}</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          <Typography variant='body1' sx={{ color: 'text.secondary', mb: 1 }}>
            {`Confirmez-vous la suppression de (${row.displayName})?`}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>

      </DialogActions>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button sx={{ color: 'green', fontWeight: 600 }} onClick={() => submitAction(row)}>
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

export default DialogDelete
