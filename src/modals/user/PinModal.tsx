// ** React Imports
import { Ref, forwardRef, ReactElement, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import * as yup from 'yup'
import LockIcon from '@mui/icons-material/Lock';

// ** Third Party Imports
import { TextField, InputAdornment } from '@mui/material';
import HttpsIcon from '@mui/icons-material/Https';

// ** Util Import

// ** Styled Component Imports

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CreateUserDto } from 'src/dto/user/user.dto'
import { RST_UpdateUserAction, RST_UsersAction } from 'src/redux/actions/Users/UserActions'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/redux/store'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const PinModal = (props:any) => {
  // ** States

  const {open,handleOpenToggle}=props;
  const session = useSession();
  const authuser=session?.data?.user?.session;
  const handlePinCodeChange = (e) => {
    const sanitizedValue = e.target.value.replace(/[^\d]/g, ''); // Allow only numbers
    // Limit to 4 characters
    const truncatedValue = sanitizedValue.slice(0, 4);

    // Set the truncated value to the input
    e.target.value = truncatedValue;
    setValue('pin.code',e.target.value,{shouldValidate:true})
  };

  const handleClose = () => {
    handleOpenToggle()
  }
  const dispatch = useDispatch<AppDispatch>()


 const schema = yup.object().shape({
    id:yup.string(),
    hasPinCode:yup.boolean(),
    pin: yup.object().shape({
    code: yup.string().min(4,'4 chiffres minimum')
    }).required('Le code pin est obligatoire'),
})


const  edit=(data:CreateUserDto)=> {
  const onSuccess=()=>{
     dispatch(RST_UsersAction())
     reset()
     handleClose()
   }

   const onError=(res:any)=>{
    const {errors}=res;
      toast.error(`${res.description}`,{position:'top-center'})
      reset()
     handleClose()

   }

  dispatch(RST_UpdateUserAction(data.id,data,onSuccess,onError))
 }


const onSubmit = (dt:CreateUserDto,e:any) =>{
  e.preventDefault();
 console.log('R20',dt)
return edit(dt);
}





  const defaultValues = {
      id:'',
      pin:'',
      hasPinCode:true
 }


  const {
    handleSubmit,
      reset,
     register,
     setValue,
     formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })


  useEffect(()=>{
    setValue('id',authuser?.userId)
  },[])


  return (
    <Card>
      <Dialog
        fullWidth
        open={open}
        maxWidth='sm'
        scroll='body'
        onClose={handleClose}
        onBackdropClick={handleClose}
        TransitionComponent={Transition}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
            <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
              <Icon icon='mdi:close' />
            </IconButton>

            <Grid container spacing={6}>
              <Grid item xs={12}>
              <Box sx={{textAlign: 'center' }}>
                <LockIcon style={{ fontSize: 70 }}/>
              </Box>
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                  <Typography variant='h5' sx={{ mb: 3 }}>
                    Définir le code PIN
                  </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                <Box sx={{textAlign: 'center' }}>
                  <TextField
                      label="Enter PIN Code"
                      type="number"
                      variant="outlined"
                      {...register('pin.code')}
                      inputProps={{ maxLength: 4 }} // Limit the input to 4 characters
                      onChange={handlePinCodeChange}
                      error={errors?.pin?.code?true :false}
                      helperText={errors?.pin?.code?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HttpsIcon />
                          </InputAdornment>
                        ),
                        inputProps: { min: 0 }
                      }}
                      sx={{ width: '150px' }}
                    />
                </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mb: 4, textAlign: 'center' }}>
                      <Typography variant='body2'>
                      Lors de l'ajout de nouveaux employés, l'authentification par code PIN est activé.
                      Définissez votre propre code PIN pour accéder à POSGPT.
                      </Typography>
                  </Box>
                </Grid>
              </Grid>

            </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Annuler
            </Button>
            <Button variant='contained' sx={{ mr: 1 }} type="submit">
              Confirmer
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  )
}

export default PinModal
