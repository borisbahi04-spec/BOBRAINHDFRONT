// ** React Imports
import { Fragment } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Typography from '@mui/material/Typography'



const DialogConfirmation = (props:any) => {
  const {open,setOpen,row,submitAction,action}=props;

 // const handleClickOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  return (
    <Fragment>
      {/*<Button variant='outlined' onClick={handleClickOpen}>
        Open dialog
      </Button>*/}
      <Dialog
        open={open}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            setOpen(false)
          }
        }}
      >
        <DialogTitle id='alert-dialog-title'>{`Change le status de :: ${row?.code}`} ?</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
          <Typography  variant='h6' sx={{ color: 'red', fontWeight: 600 }}>
                  {`Etes vous sure de vouloir passer du status (${row?.status}) à ${action}.`}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button sx={{ color: 'green', fontWeight: 600 }}  onClick={()=>submitAction(row)}>Oui je confirme</Button>
          <Button sx={{ color: 'red', fontWeight: 600 }} onClick={handleClose}>Non pas encore prêt </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default DialogConfirmation
