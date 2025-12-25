// ** React Imports
import { useState, ElementType, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import Button, { ButtonProps } from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import toast from 'react-hot-toast'

// ** Third Party Imports
import { useForm,Controller } from 'react-hook-form'

// ** Icon Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { emailRegExp, phoneRegExp } from 'src/helpers'
import { AppDispatch, RootState } from 'src/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { RST_UpdateUserAction } from 'src/redux/actions/Users/UserActions'
import { RST_UserProfileAction } from 'src/redux/actions/Auth/AuthActions'
import { usePrevious } from 'src/myCustomFunctions'


interface Data {
  id: string
  username: string
  phoneNumber: string
  lastName: string
  firstName: string
  email:string
}


const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: 4,
  marginRight: theme.spacing(5)
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const TabAccount = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')

  const authuser = useSelector((state: RootState) => state.auth.getuserprofile)
  const auth=authuser?.session;

  const schema = yup.object().shape({
    lastName: yup.string().trim().min(3, 'Le Nom doit être court de 3 caractères  ').max(18, 'Le Nom doit faire 18 caractères').required("Nom est obligatoire"),
    firstName: yup.string().min(3, 'Le Prénom(s) doit être court de 3 caractères  ').max(40, 'Le Prénom(s) doit faire 40 caractères').required("Prénom(s) est obligatoire"),
    phoneNumber:yup.string().min(10, 'Le numéro de téléphone doit être court de 10 chiffres  ').max(10, 'Le numéro de téléphone doit être long de 10 chiffres  ').matches(phoneRegExp, `${"Le numéro de téléphone n'est pas valid"}`).required("Téléphone est obligatoire"),
    email:yup.string().matches(emailRegExp, `${"L'email' n'est pas valid"}`).required("Téléphone est obligatoire"),

  })
  const prevUser:any =usePrevious(auth?.user);



  // ** Hooks

    const formOptions:any = { resolver: yupResolver(schema)};
    const { register,setValue, handleSubmit,control,formState: {errors } } = useForm(formOptions);


  const onSubmit = (data:Data) => {
   const onError=(error:any)=>{
       toast.error(error.message,{position:'top-center'})
    }
    const onSuccess=()=>{
      dispatch(RST_UserProfileAction())
      toast.success('Modification effectuée avec succés',{position:'top-center'})
    }
    if(prevUser?.firstName!=data.firstName || prevUser?.lastName!=data.lastName || prevUser?.phoneNumber!=data.phoneNumber || prevUser?.email!=data.email ){
      dispatch(RST_UpdateUserAction(data.id,data,onSuccess,onError))
    }
  }




  const handleInputImageReset = () => {
    setInputValue('')
    setImgSrc('/images/avatars/1.png')
  }




  useEffect(() => {
      setValue('id', auth?.user?.id)
      setValue('username', auth?.user?.username)
      setValue('lastName', auth?.user?.lastName)
      setValue('firstName', auth?.user?.firstName)
      setValue('phoneNumber', auth?.user?.phoneNumber)
      setValue('email', auth?.user?.email)
  }, [auth, setValue])

  return (
    <Grid container spacing={6}>
      {/* Account Details Card */}
      <Grid item xs={12}>
        <Card>
          <form noValidate autoComplete='off'  onSubmit={handleSubmit(onSubmit)}>
            <CardContent sx={{ pb: theme => `${theme.spacing(10)}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ImgStyled src={imgSrc} alt='Profile Pic' />
                <div hidden>
                  <ButtonStyled component='label' variant='contained'  htmlFor='account-settings-upload-image'>
                    Upload New Photo
                    <input
                      hidden
                      type='file'
                      accept='image/png, image/jpeg'
                      id='account-settings-upload-image'
                    />
                  </ButtonStyled>
                  <ResetButtonStyled color='secondary'  variant='outlined' onClick={handleInputImageReset}>
                    Reset
                  </ResetButtonStyled>
                  <Typography variant='caption' sx={{ mt: 4, display: 'block', color: 'text.disabled' }}>
                    Allowed PNG or JPEG. Max size of 800K.
                  </Typography>
                </div>
                <div>
                   <h4> Role:</h4>
                  <Typography variant='body2' sx={{ mt: 2, display: 'block', color: 'text.disabled' }}>
                  <b> {auth?.role?.displayName}</b>
                  </Typography>
                  <h4> Surcussale :</h4>
                  <Typography variant='body2' sx={{ mt: 2, display: 'block', color: 'text.disabled' }}>
                    {auth?.targetBranch?.displayName}
                  </Typography>
                </div>

              </Box>
            </CardContent>
            <CardContent>
              <Grid container spacing={5}>
              <Grid item xs={3} sm={3}>
                  <TextField
                    fullWidth
                    placeholder='Nom utilisateur'
                    {...register("username")}
                    disabled
                  />
                </Grid>
                <Grid item xs={3} sm={3}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name='lastName'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: {onChange, onBlur } }) => (
                        <TextField
                          autoFocus
                          label='Nom'
                          onBlur={onBlur}
                          {...register("lastName")}
                          onChange={onChange}
                          error={Boolean(errors.lastName)}
                        />
                      )}
                    />
                    {errors.lastName && <FormHelperText sx={{ color: 'error.main' }}>{errors.lastName.message}</FormHelperText>}
                  </FormControl>
                 </Grid>
                 <Grid item xs={6} sm={6}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name='firstName'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: {onChange, onBlur } }) => (
                        <TextField
                        {...register("firstName")}
                          autoFocus
                          label='Prénom(s)'
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.firstName)}
                        />
                      )}
                    />
                    {errors.firstName && <FormHelperText sx={{ color: 'error.main' }}>{errors.firstName.message}</FormHelperText>}
                  </FormControl>
                 </Grid>


                 <Grid item xs={6} sm={6}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name='phoneNumber'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: {onChange, onBlur } }) => (
                        <TextField
                          type='number'
                          {...register("phoneNumber")}
                          placeholder='202 555 0111'
                          autoFocus
                          label='Téléphone'
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.phone)}
                          InputProps={{ startAdornment: <InputAdornment position='start'>CI (+225)</InputAdornment> }}

                        />
                      )}
                    />
                    {errors.phoneNumber && <FormHelperText sx={{ color: 'error.main' }}>{errors.phoneNumber.message}</FormHelperText>}
                  </FormControl>
                 </Grid>
                 <Grid item xs={6} sm={6}>
                 <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='email'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Email*'
                        onChange={onChange}
                        placeholder=''
                        error={Boolean(errors.email)}
                      />
                    )}
                  />
                  {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
                </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button variant='contained' sx={{ mr: 4 }} type='submit' >
                  Sauvegarder les modifications
                  </Button>
                  {/*<Button  variant='outlined' color='secondary' onClick={() =>_onReset}>
                  Réinitialiser
                      </Button>*/}
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>
    </Grid>
  )
}

export default TabAccount
