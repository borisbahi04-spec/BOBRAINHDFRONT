/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect, useContext } from 'react'

// ** MUI Imports
import TextField from '@mui/material/TextField'


// ** Icon Imports

// ** Third Party Imports

// ** Configs

// ** Custom Component Imports
import { AppDispatch, RootState } from 'src/redux/store'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller} from 'react-hook-form'

import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import toast from 'react-hot-toast'

import { useDispatch, useSelector } from 'react-redux'
import { usePrevious } from 'src/myCustomFunctions'
import { emailRegExp, phoneRegExp, regexpasswords, showErrors } from 'src/helpers'
import { RST_UsersAction, RST_CreateUserAction, RST_UpdateUserAction, RST_DeleteUserAction } from 'src/redux/actions/Users/UserActions'
import { CreateUserDto } from 'src/dto/user/user.dto'
import { useRouter } from 'next/router'
import { UserCreateDto } from 'src/dto/user/user-dto-view'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { Box, Button, Card, CardContent, Divider, Grid, Icon, IconButton, InputAdornment, MenuItem } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import PeopleIcon from '@mui/icons-material/People'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import { State } from '@popperjs/core'
import { UserAction, EntityAbility } from 'src/configs/Action'
import { RoleTypeEnum } from 'src/definitions/enum'


interface PinData {
  id: string
  code: string
}
interface branchToUsers {
  branchId: string
}

interface UserData {
  id: string
  username: string
  phoneNumber: string
  email:string
  roleId:string
  departmentId:string
  branchId:boolean
}



const AddCard = (props:UserCreateDto) => {
  const router = useRouter()
  const {data,roles,branchs,departments}=props;
  const ability = useContext(AbilityContext)

const defaultValues = {
  id: '',
  username: '',
  phoneNumber: '',
  email: '',
  roleId:'',
  departmentId:'',
  branchId:'',
  newPassword:'',
}

 const [values, setValues] = useState<State>({
    newPassword: false,
  })
  const [accordionDftExp, setaccordionDftExp] = useState<boolean>(false)


  const prevUser:any =usePrevious(data);


  const authstore = useSelector((state: RootState) => state.auth)



  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const schema = yup.object().shape({
    id:yup.string(),
    username: yup
    .string()
    .min(3, obj => showErrors('Nom utilsateur ', obj.value.length, obj.min))
    .required(),
    phoneNumber:yup.string().nullable()
    .transform((v, o) => (o === '' ? null : v))
    .matches(phoneRegExp, `${"Le numéro de téléphone n'est pas valid"}`).required("Téléphone est obligatoire"),
    email:yup.string()
    .transform((value, originalValue) => (originalValue === '' ? null : value)) // Transform empty string to null
    .matches(emailRegExp, `${"L'email' n'est pas valid"}`)
   .nullable()
    ,
    roleId: yup.string().required(` Rôle est obligatoire`),
    departmentId: yup.string().required(` Département est obligatoire`),
    branchId: yup.string().required(` Surccusale est obligatoire`),

    newPassword: yup.string().transform(x => x === '' ? undefined : x)
    .concat( data ? yup.string():yup.string())
    .matches(regexpasswords,
      'Doit contenir 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial'
    )
  })
  const {
    reset,
    control,
    setValue,
    getValues,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })


  const create = (data: CreateUserDto) => {
    const _onSuccess=()=>{
      resetAll()
    }
    const _onError=(res:any)=>{
      //const {errors}=res;
      toast.error(`${userErrMess(res.errors)}`,{position:'top-center'})
     }
     if(!data.email){
      data.email=null;
     }
    dispatch(RST_CreateUserAction(data,_onSuccess,_onError))
  }

  const resetAll=() =>{
    reset();
    router.push('/user/list')
  }

  const userErrMess=(errors)=>{
    let errmess='';

    if(errors?.email) errmess+=errors?.email+' '
    if(errors?.phoneNumber) errmess+=errors?.phoneNumber+' '
    if(errors?.username) errmess+=errors?.username+' '
    if(errors?.id) errmess+=errors?.id
    if(errors?.newPassword) errmess+=errors?.newPassword+' '

    return errmess
  }


const  edit=(data:UserData)=> {
  const onUpdateUserSuccess=()=>{
     dispatch(RST_UsersAction())
     resetAll()
   }

   const onUpdateUserError=(res:any)=>{
    const {errors}=res;
      toast.error(`${userErrMess(errors)}`,{position:'top-center'})
   }



     if(prevUser.username!=data.username || prevUser.phoneNumber!=data.phoneNumber ||prevUser.branchId!=data.branchId ||
     prevUser.email!=data.email  || prevUser.roleId!=data.roleId  || prevUser.newPassword!=data.newPassword
     || prevUser.departmentId!=data.departmentId ){
      dispatch(RST_UpdateUserAction(data.id,data,onUpdateUserSuccess,onUpdateUserError))
   }else{
    resetAll()
   }

 }

 const handleDelete = (row:any) => {
  const onSuccess = (res:any) => {
    dispatch(RST_UsersAction())
    toast.success(`Suppression '${row.username}' effectuée avec succès`,{position:'top-center'})
    resetAll();
  }
  const onError = (res:any) => {
    toast.error(`${res.message}`,{position:'top-center'})
  }
  dispatch(RST_DeleteUserAction(row.id,onSuccess,onError))
}


const handleClickShowNewPassword = () => {
  setValues({ ...values, newPassword: !values.newPassword })
}
const handleMouseDownNewPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault()
}


  const onSubmit = (dt:CreateUserDto,e:any) =>{
    e.preventDefault();
console.log('dt45445',dt)
return data? edit(dt):create(dt);
}




useEffect(()=>{
  if (data) {
    setValue('id', data.id)
    setValue('username', data.username)
    setValue('phoneNumber', data.phoneNumber)
    setValue('email', data.email?data.email:'')
    setValue('departmentId', data.departmentId)
    setValue('roleId', data.roleId)
    setValue('newPassword', '')
    setValue("branchId",data?.branchId)
  }
},[])








  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
            <Grid container  spacing={2}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name='username'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      autoFocus
                      label='Nom*'
                      disabled={data?true:false}
                      onChange={onChange}
                      placeholder=''
                      variant="standard"
                      inputProps={{
                        style: {
                          fontSize: 30,
                          height: 60,
                          width: 272,
                          padding: '0 14px',
                          fontWeight: 'bold'
                        },
                    }}
                      error={Boolean(errors.username)}
                    />
                  )}
                />
                {errors.username && <FormHelperText sx={{ color: 'error.main' }}>{errors.username.message}</FormHelperText>}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Email'
                      onChange={onChange}
                      placeholder=''
                      variant="standard"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon />
                          </InputAdornment>
                        ),
                      }}
                      error={Boolean(errors.email)}
                    />
                  )}
                />
                {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name='phoneNumber'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: {value,onChange} }) => (
                    <TextField
                      type='number'
                      value={value}

                      label='Numero Téléphone Professionnel'
                      onChange={onChange}
                      variant="standard"
                      error={Boolean(errors.phoneNumber)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                {errors.phoneNumber && <FormHelperText sx={{ color: 'error.main' }}>{errors.phoneNumber.message}</FormHelperText>}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                    name='roleId'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      select
                      value={value}
                      id='select-role'
                      label='Rôle'
                      inputProps={{ placeholder: 'Sélectionner un rôle' }}
                      onChange={onChange}
                      variant="standard"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PeopleIcon />
                          </InputAdornment>
                        ),
                      }}
                    >

                    {
                        roles && roles?.data?.map((data:any,index:any) =>{
                          if(data?.name!=RoleTypeEnum.owner){
                            return <MenuItem value={data.id}  key={index}>{data.name}</MenuItem>
                          }
                    })
                        }
                  </TextField>
                  )}
                />
                {errors.roleId && <FormHelperText sx={{ color: 'error.main' }}>{errors.roleId.message}</FormHelperText>}
              </FormControl>
               <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                    name='departmentId'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      select
                      value={value}
                      id='select-department'
                      label='Département'
                      inputProps={{ placeholder: 'Sélectionner un département' }}
                      onChange={onChange}
                      variant="standard"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PeopleIcon />
                          </InputAdornment>
                        ),
                      }}
                    >

                    {
                    departments && departments?.data?.map((data:any,index:any) =>{
                            return <MenuItem value={data.id}  key={index}>{data.displayName}</MenuItem>

                    })
                        }
                  </TextField>
                  )}
                />
                {errors.departmentId && <FormHelperText sx={{ color: 'error.main' }}>{errors.departmentId.message}</FormHelperText>}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                  name='branchId'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    select
                    value={value}
                    id='select-branch'
                    label='Surccusale'
                    inputProps={{ placeholder: 'Sélectionner une surcusale' }}
                    onChange={onChange}
                    variant="standard"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WarehouseIcon />
                        </InputAdornment>
                      ),
                    }}
                  >

                  {
                      branchs && branchs?.data?.map((data:any,index:any) =>{
                          return <MenuItem value={data.id}  key={index}>{data.displayName}</MenuItem>
                  })
                  }
                </TextField>
                )}
              />
              {errors.branchId && <FormHelperText sx={{ color: 'error.main' }}>{errors.branchId.message}</FormHelperText>}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                    name="newPassword"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        variant="standard"
                        label="Mot de passe"
                        value={value}
                        onChange={onChange}
                        error={Boolean(errors.newPassword)}
                        type={values.newPassword ? "text" : "password"}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                onClick={handleClickShowNewPassword}
                                onMouseDown={handleMouseDownNewPassword}
                              >
                                <Icon icon={values.newPassword ? "mdi:eye-outline" : "mdi:eye-off-outline"} />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />

                {errors.newPassword && <FormHelperText sx={{ color: 'error.main' }}>{errors.newPassword.message}</FormHelperText>}

          </FormControl>
          </Grid>
          </CardContent>
            <Divider/>
          <CardContent >
            <Grid container spacing={6}>
                <Grid item xs={12} md={4}>
                  {data?
                     ability.can(UserAction.Delete, EntityAbility.USER) && (
                  <Button size='medium'  variant='outlined' color='error' onClick={()=>handleDelete(data)}>
                    Suprimer
                  </Button>
                     )
                  :''}
                 </Grid>
                 <Grid item xs={12}  md={8}  >
                   <Box alignItems='flex-end'>
                  <Button size='medium' variant='outlined' color='secondary' sx={{ mr: 2 }} onClick={()=>resetAll()} >
                      Annuler
                  </Button>
                  <Button size='medium' type='submit' variant='outlined' >
                    Enregistrer
                  </Button>
                  </Box>
                  </Grid>


            </Grid>
          </CardContent>

          </Card>
        </form>
  </>
  )
}

export default AddCard
