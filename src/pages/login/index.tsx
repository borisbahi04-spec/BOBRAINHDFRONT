// ** React Imports
import { useState, ReactNode } from 'react'

// ** Next Imports

// ** MUI Components
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import CryptoJS from "crypto-js";

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import { Alert, Card, CardContent } from '@mui/material'
import FooterIllustrationsV1 from './FooterIllustrationsV1'
import { getProviders, getSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ImgStyled } from 'src/myCustomFunctions'

// ** Styled Components







const schema = yup.object().shape({
  username: yup.string().required('Nom utilisateur est obligatoire'),
  password: yup.string().min(5).required('Mot de passe est obligatoire')
})

const defaultValues = {
  password: '',
  username: ''
}

interface FormData {
  username: string
  password: string
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const router = useRouter();
  const [showAlert, setShowAlert] = useState('');

  // ** Vars

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  /*const onSubmit = (data: FormData) => {
    const { username, password } = data
    auth.login({ username, password}, () => {
      setError('username', {
        type: 'manual',
        message: `${"le nom d'utilisateur ou le mot de passe est invalide"}`
      })

    })
  }*/
  const onSubmit = async (data: FormData) => {
   const SECRET_KEY:any = process.env.NEXT_PUBLIC_CRYPTO_KEY ;

   const { username, password } = data
   // chiffrement AES
  const encryptedUsername = CryptoJS.AES.encrypt(username, SECRET_KEY).toString();
  const encryptedPassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
  const res:any =await signIn("credentials", {
    username: encryptedUsername,
    password: encryptedPassword,
    redirect: false,
    callbackUrl: `/`,
  })

    // 🔹 Vérifie l'erreur
    if (res?.error) {
      let err;
      try {
        err = JSON.parse(res.error); // si authorize() a throw JSON
      } catch {
        err = { message: res.error };
      }

      setShowAlert(err.message || "Nomm d'utilisateur ou mot de passe incorrect");
    } else {
      setShowAlert(''); // login OK
    }
        if (res.url) router.push(res.url);

      };

  return (
    <Box className='content-center'>
    <Card sx={{ zIndex: 1, width: '100%', maxWidth: 450 }}>
      <CardContent
        sx={theme => ({
          p: `${theme.spacing(7, 4, 6)} !important`,
          [theme.breakpoints.up('sm')]: {
            p: `${theme.spacing(12, 9, 7)} !important`
          }
        })}
      >
        <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Box sx={{  display: 'flex', alignItems: 'left', marginLeft:-5}}>
                  <ImgStyled src='/images/monlogo.png' />
                </Box>

        </Box>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

          <Typography
            variant='h6'
            sx={{
              ml: 3,
              lineHeight: 1,
              fontWeight: 600,
              textTransform: 'uppercase',
              fontSize: '1.5rem !important'
            }}
          >
          </Typography>
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant='h5' sx={{ fontWeight: 600, mb: 1.5 }}>
            Bienvenue à {themeConfig.templateName}! 👋🏻
          </Typography>
          <Typography variant='body2'>Veuillez vous connecter à votre compte et commencer l'aventure</Typography>
        </Box>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='username'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label='Nom Utilisateur'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.username)}
                    />
                  )}
                />
                {errors.username && <FormHelperText sx={{ color:'error.main'}}>{errors.username.message}</FormHelperText>}
              </FormControl>          <FormControl fullWidth>
                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                  Mot de passe
                </InputLabel>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label='Password'
                      onChange={onChange}
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} fontSize={20} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}/>
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }} id=''>
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>
          <Box  sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }} >
          </Box>
          <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
            Se connecter
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {showAlert?<Alert severity="error">{showAlert}</Alert>:"" }
              </Box>
        </form>
      </CardContent>
    </Card>
    <FooterIllustrationsV1 />

  </Box>
  )
}

export const getServerSideProps = async (context: any) => {
  const { req } = context;

  const session = await getSession({ req });

  // Only redirect an already-authenticated user away from /login.
  // (No dispatch to the redux `store` here: that store is a single
  // instance shared by the whole Node server process, so writing a
  // per-request session into it would leak between concurrent users.)
  if (session?.user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      providers: (await getProviders()) ?? [],
    },
  };
}
LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
