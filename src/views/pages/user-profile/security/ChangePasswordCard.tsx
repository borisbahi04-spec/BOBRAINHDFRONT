/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { MouseEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from 'src/hooks/useAuth'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/redux/store'
import { RST_ChangeMyPasswordAction } from 'src/redux/actions/Auth/AuthActions'
import { regexpasswords } from 'src/helpers'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

interface State {
  showNewPassword: boolean
  showCurrentPassword: boolean
  showconfirmPassword: boolean
}
interface Data {
  id?: string
  currentPassword: string
  password: string
  confirmPassword?:string
}
const defaultValues:Data = {
  password: '',
  currentPassword: '',
  confirmPassword: ''
}

const schema = yup.object().shape({
  currentPassword: yup.string().min(4,`Mot de passe doit être d'au moins 4 caractères`).required(),
  password: yup.string().min(4,`Mot de passe doit être d'au moins 4 caractères`)
    .matches(regexpasswords,
      'Doit contenir 4 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial'
    )
    .required(),
  confirmPassword: yup
    .string()
    .required(`confirmation mot de passe est un champ obligatoire`)
    .oneOf([yup.ref('password')], `Les mots de passe doivent correspondre`)
})

const ChangePasswordCard = () => {
  // ** States
  const [values, setValues] = useState<State>({
    showNewPassword: false,
    showCurrentPassword: false,
    showconfirmPassword: false
  })
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues, resolver: yupResolver(schema) })

  const handleClickShowCurrentPassword = () => {
    setValues({ ...values, showCurrentPassword: !values.showCurrentPassword })
  }
  const handleMouseDownCurrentPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }
  const handleMouseDownNewPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleClickShowconfirmPassword = () => {
    setValues({ ...values, showconfirmPassword: !values.showconfirmPassword })
  }
  const handleMouseDownconfirmPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const onPasswordFormSubmit = (data:Data) => {
    //data.id=authuser.id;
    const onError=(res:any)=>{
      console.log("error5555555")
      console.log(res)
      const {errors}=res;
      toast.error(errors?.password[0],{position:'top-center'})
   }
   const onSuccess=(res:any)=>{
    const loginUrl='/login'
     toast.success('Le mot de passe a été changé avec succès',{position:'top-center'})
      reset(defaultValues)
      signOut({ redirect: false, callbackUrl:loginUrl })
      router.push(loginUrl)
   }

    dispatch(RST_ChangeMyPasswordAction(data,onSuccess,onError))

  }

  return (
    <Card>
      <CardHeader title='Changer le mot de passe'/>
      <CardContent>
        <form onSubmit={handleSubmit(onPasswordFormSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor='input-current-password' error={Boolean(errors.currentPassword)}>
                  Mot de passe actuel
                </InputLabel>
                <Controller
                  name='currentPassword'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <OutlinedInput
                      value={value}
                      label='Current Password'
                      onChange={onChange}
                      id='input-current-password'
                      error={Boolean(errors.currentPassword)}
                      type={values.showCurrentPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowCurrentPassword}
                            onMouseDown={handleMouseDownCurrentPassword}
                          >
                            <Icon icon={values.showCurrentPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.currentPassword && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.currentPassword.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={5} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor='input-new-password' error={Boolean(errors.password)}>
                   Nouveau Mot de passe
                </InputLabel>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <OutlinedInput
                      value={value}
                      label='New Password'
                      onChange={onChange}
                      id='input-new-password'
                      error={Boolean(errors.password)}
                      type={values.showNewPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowNewPassword}
                            onMouseDown={handleMouseDownNewPassword}
                          >
                            <Icon icon={values.showNewPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor='input-confirm-new-password' error={Boolean(errors.confirmPassword)}>
                  Confirmer le nouveau mot de passe
                </InputLabel>
                <Controller
                  name='confirmPassword'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <OutlinedInput
                      value={value}
                      label='Confirm New Password'
                      onChange={onChange}
                      id='input-confirm-new-password'
                      error={Boolean(errors.confirmPassword)}
                      type={values.showconfirmPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowconfirmPassword}
                            onMouseDown={handleMouseDownconfirmPassword}
                          >
                            <Icon icon={values.showconfirmPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.confirmPassword.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ mt: 1, color: 'text.secondary' }}> Exigences relatives au mot de passe:</Typography>
              <Box
                component='ul'
                sx={{ pl: 4, mb: 0, '& li': { mb: 4, color: 'text.secondary', '&::marker': { fontSize: '1.25rem' } } }}
              >
                <li>Minimum 8 caractères - plus il y en a, mieux c'est</li>
                <li>Au moins un caractère minuscule et un caractère majuscule</li>
                <li>Au moins un chiffre, un symbole ou un caractère d'espacement</li>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button variant='contained' type='submit' sx={{ mr: 3 }}>
              Sauvegarder les modifications
              </Button>
              <Button type='reset' variant='outlined' color='secondary' onClick={() => reset()}>
                Réinitialiser
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default ChangePasswordCard
