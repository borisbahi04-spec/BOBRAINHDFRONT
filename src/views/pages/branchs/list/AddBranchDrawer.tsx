/* eslint-disable newline-before-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
// ** React Imports
import { ChangeEvent, ElementType, useEffect, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch,useSelector } from 'react-redux'

// ** Actions Imports
//import { addBranch } from 'src/store/apps/branch'

// ** Types Imports
import toast from 'react-hot-toast'
import { ButtonProps, CardContent } from '@mui/material'
import { usePrevious } from 'src/myCustomFunctions'
import { RST_BranchsAction, RST_CreateBranchAction, RST_UpdateBranchAction } from 'src/redux/actions/branch/branchActions'
import { State } from '@popperjs/core'
import { AppDispatch, RootState } from 'src/redux/store'
import { emailRegExp, phoneRegExp, regexpasswords } from 'src/helpers'

interface SidebarAddBranchType {
  open: boolean
  toggle: () => void
  isEditMode:boolean
  setIsEditMode:(res:boolean)=>void
  row:BranchData
  setBranch:(res:any)=>void
}

interface BranchData {
  id: string
  displayName: string
  phoneNumber: string
  email: string
  city: string
  address:string
  description:string

}

export const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} est obligatoire    `
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} doit être au moins ${min} caractère(s)`
  } else {
    return ''
  }
}






const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))


const defaultValues = {
  id: '',
  displayName: '',
  phoneNumber: '',
  email: '',
  city: '',
  address:'',
  description:'',
}


const userErrMess=(errors)=>{
  let errmess='';
  if(errors?.lastName) errmess+=errors?.lastName+' '
  if(errors?.firstName) errmess+=errors?.firstName+' '
  if(errors?.email) errmess+=errors?.email+' '
  if(errors?.phoneNumber) errmess+=errors?.phoneNumber+' '
  if(errors?.city) errmess+=errors?.city+' '
  if(errors?.address) errmess+=errors?.address+' '
  if(errors?.id) errmess+=errors?.id

  return errmess
}

const SidebarAddBranch = (props: SidebarAddBranchType) => {



  // ** Props
  const { open, toggle ,isEditMode,setIsEditMode,row,setBranch} = props


  // ** yup
  const schema = yup.object().shape({
    id:yup.string(),
    displayName: yup
    .string()
    .min(3, obj => showErrors('Nom  ', obj.value.length, obj.min))
    .required(),
    phoneNumber:yup.string().min(10, 'Le numéro de téléphone doit être court de 10 chiffres  ')
    .max(10, 'Le numéro de téléphone doit être long de 10 chiffres  ')
    .matches(phoneRegExp, `${"Le numéro de téléphone n'est pas valid"}`).required("Téléphone est obligatoire"),
    email:yup.string(),
    city: yup.string(),
    address: yup.string(),
    description: yup.string(),

  })

  // ** State
  const [title, setTitle] = useState<string>('')
  const prevBranch:any =usePrevious(row);
  const branchstore = useSelector((state: RootState) => state.branch)
  const authstore = useSelector((state: RootState) => state.auth)



  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const {
    reset,
    control,
    setValue,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })


  const createBranch = (data: BranchData) => {
    const _onSuccess=(res:any)=>{
      resetAll()
      dispatch(RST_BranchsAction())
      toast.success(`${data.displayName} avec succès`,{position:'top-center'})

    }
    const _onError=(res:any)=>{
      const {errors}=res;
      toast.error(`${userErrMess(errors)}`,{position:'top-center'})
    }
    dispatch(RST_CreateBranchAction(data,_onSuccess,_onError))
  }

  const resetAll=() =>{
    reset();
    setBranch('')
    setIsEditMode(false)
    toggle();
  }

const  EditBranch=(data:BranchData)=> {
  const onUpdateBranchSuccess=(res:any)=>{
     toast.success(`${data.displayName}  modifié avec succès!`,{position:'top-center'});
     dispatch(RST_BranchsAction())
     resetAll()
   }

   const onUpdateBranchError=(res:any)=>{
    const {errors}=res;

    toast.error(`${userErrMess(errors)}`,{position:'top-center'})
    }

   if(prevBranch.displayName!=data.displayName || prevBranch.phoneNumber!=data.phoneNumber|| prevBranch.email!=data.email || prevBranch.city!=data.city || prevBranch.address!=data.address || prevBranch.description!=data.description){
      dispatch(RST_UpdateBranchAction(data.id,data,onUpdateBranchSuccess,onUpdateBranchError))
   }else{
    resetAll()
   }
 }



  const onSubmit = (data:BranchData,e:any) =>{
    e.preventDefault();
    if(!data.email)data.email=null
    if(!data.city)data.city=null

    return isEditMode ? EditBranch(data):createBranch(data)
}


  const handleClose = () => {
    setIsEditMode(false)
    toggle()
    reset()
  }

  useEffect(()=>{
    if (isEditMode) {
      setValue('id', row.id)
      setValue('displayName', row.displayName)
      setValue('phoneNumber', row.phoneNumber)
      setValue('email', row.email?row.email:'')
      setValue('city', row.city?row.city:'')

      setValue('address', row.address)
      setValue('description', row.description)

      setTitle(`Modifier ${row.displayName}`)
     }else{
       setTitle(`Ajouter une surccusale`)
     }
  },[isEditMode])

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>{title}</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>

        <form onSubmit={handleSubmit(onSubmit)}>
         <FormControl fullWidth sx={{ mb: 6 }}>
           <Controller
             name='displayName'
             control={control}
             rules={{ required: true }}
             render={({ field: { value, onChange } }) => (
               <TextField
                 value={value}
                 label='Nom*'
                 onChange={onChange}
                 placeholder=''
                 error={Boolean(errors.displayName)}
               />
             )}
           />
           {errors.displayName && <FormHelperText sx={{ color: 'error.main' }}>{errors.displayName.message}</FormHelperText>}
         </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='phoneNumber'
              control={control}
              rules={{ required: true }}
              render={({ field: {value,onChange, onBlur } }) => (
                <TextField
                  type='number'
                  value={value}
                  placeholder='202 555 0111'
                  autoFocus
                  label='Téléphone *'
                  onChange={onChange}
                  error={Boolean(errors.phoneNumber)}
                  InputProps={{inputProps: { min: 0 } , startAdornment: <InputAdornment position='start'>CI (+225)</InputAdornment> }}
                />
              )}
            />
            {errors.phoneNumber && <FormHelperText sx={{ color: 'error.main' }}>{errors.phoneNumber.message}</FormHelperText>}
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
                  error={Boolean(errors.email)}
                />
              )}
            />
            {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='city'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Ville'
                  onChange={onChange}
                  placeholder=''
                  error={Boolean(errors.city)}
                />
              )}
            />
            {errors.city && <FormHelperText sx={{ color: 'error.main' }}>{errors.city.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='address'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Adresse'
                  onChange={onChange}
                  placeholder=''
                  error={Boolean(errors.address)}
                />
              )}
            />
            {errors.address && <FormHelperText sx={{ color: 'error.main' }}>{errors.address.message}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='description'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Description'
                  onChange={onChange}
                  placeholder=''
                  multiline={true}
                  rows={2}
                  error={Boolean(errors.description)}
                />
              )}
            />
            {errors.description && <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>}
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
               Soumettre
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              Annuler
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddBranch
