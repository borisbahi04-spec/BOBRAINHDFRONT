import { useContext, useEffect, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'


// ** Icon Imports

// ** Third Party Imports

// ** Configs

// ** Custom Component Imports
import { AppDispatch } from 'src/redux/store'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller} from 'react-hook-form'

import FormHelperText from '@mui/material/FormHelperText'
import toast from 'react-hot-toast'

import { useDispatch } from 'react-redux'
import { Card, InputAdornment } from '@mui/material'
import { emailRegExp, phoneRegExp, showErrors } from 'src/helpers'
import { useRouter } from 'next/router'
import {  FormControl } from '@mui/material';
import { RST_CreatebranchAction, RST_branchsAction, RST_UpdatebranchAction } from 'src/redux/actions/branch/branchActions'
import ConfirmDialog from '../../confirmDialog/ConfirmDialog'
import { RST_DeletebranchAction } from 'src/redux/actions/branch/branchActions'
import { ACTIONDELETE } from 'src/definitions/enum'
import { EntityAbility, UserAction } from 'src/configs/Action'
import { AbilityContext } from 'src/layouts/components/acl/Can'








yup.addMethod(yup.array, 'unique', function (field, message) {
  return this.test('unique', message, function (array:any) {
  const uniqueData = Array.from(
    new Set(array.map((row:any) => row[field]?.toLowerCase())),
  );
  const isUnique = array.length === uniqueData.length;
  if (isUnique) {
    return true;
  }
  const index = array.findIndex(
    (row:any, i:number) => row[field]?.toLowerCase() !== uniqueData[i],
  );
  if (array[index][field] === '') {
    return true;
  }

return this.createError({
    path: `${this.path}.${index}.${field}`,
    message,
  });
});
});



const AddCard = (props:any) => {
  const router = useRouter()
  const { query } = router;

const [title, setTitle] = useState<string>('')

const ability = useContext(AbilityContext)

const [open,setOpen]=useState(false)
const [actionData,setActionData]=useState('')
const [message,setMessage]=useState('')

const ENTITY='la Surccusale'
const DELETEMES=`L'application sera desactivée sur tous les appareils connecté à cette caisse`;


const {data}=props;

const defaultValues = {
  id: '',
  displayName: '',
  phoneNumber: '',
  email: '',
  city: '',
  address:'',
  description:'',
}




  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const schema = yup.object().shape({
    id:yup.string(),
    displayName: yup
    .string()
    .min(3, obj => showErrors('Nom  ', obj.value.length, obj.min))
    .required(),
    phoneNumber:yup.string().min(10, 'Le numéro de téléphone doit être court de 10 chiffres  ')
    .max(10, 'Le numéro de téléphone doit être long de 10 chiffres  ')
    .matches(phoneRegExp, `${"Le numéro de téléphone n'est pas valid"}`).required("Téléphone est obligatoire"),
    email:yup.string()
    .transform((value, originalValue) => (originalValue === '' ? null : value)) // Transform empty string to null
    .matches(emailRegExp, `${"L'email' n'est pas valid"}`).nullable(),
    city: yup.string(),
    address: yup.string(),
    description: yup.string(),

  })


  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })


  const  handleoPenDialog=(action,message)=> {
    setOpen(true)
    setActionData(action)
    setMessage(message)
  }



 const handleDelete = (row:any) => {
  const onSuccess = () => {
    dispatch(RST_branchsAction())
    toast.success(`Suppression '${row.displayName}' effectuée avec succès`,{position:'top-center'})
    resetAll();
  }
  const onError = (res:any) => {
    toast.error(`${res.message}`,{position:'top-center'})
  }
  dispatch(RST_DeletebranchAction(row.id,onSuccess,onError))
}


  const create = (data: any) => {
    const _onSuccess=()=>{
      resetAll()
    }
    const _onError=(res:any)=>{
      const {errors}=res;
      toast.error(`${branchErrMess(errors)}`,{position:'top-center'})
     }
    dispatch(RST_CreatebranchAction(data,_onSuccess,_onError))
  }

  const resetAll=() =>{
    reset();
    router.push({
      pathname: '/settings',
      query: { action: query?.action },
    });
  }


  const branchErrMess=(errors:any)=>{
    let errmess='';
    if(errors?.displayName) errmess+=errors?.displayName+' '

return errmess
  }


const  edit=(data:any)=> {
  const onUpdateBranchSuccess=()=>{
     dispatch(RST_branchsAction())
     resetAll()
   }

   const onUpdateBranchError=(res:any)=>{
    const {errors}=res;
      toast.error(`${branchErrMess(errors)}`,{position:'top-center'})
   }
    dispatch(RST_UpdatebranchAction(data.id,data,onUpdateBranchSuccess,onUpdateBranchError))
 }








  const onSubmit = (dt:any,e:any) =>{
    e.preventDefault();
    data? edit(dt):create(dt);
}



useEffect(()=>{
  if (data) {
    setValue('id', data.id)
    setValue('displayName', data.displayName)
    setValue('phoneNumber', data.phoneNumber)
    setValue('email', data.email?data.email:'')
    setValue('city', data.city?data.city:'')
    setValue('address', data.address)
    setValue('description', data.description)
    setTitle(`Modifier ${data.displayName}`)
   }else{
     setTitle(`Ajouter une surccusale`)
   }
},[data])



  return (
    <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card sx={{mb:4}}>
                  <CardContent>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='displayName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Nom*'
                    variant='standard'
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
                render={({ field: {value,onChange } }) => (
                  <TextField
                    type='number'
                    value={value}
                    placeholder='202 555 0111'
                    autoFocus
                    label='Téléphone *'
                    variant='standard'
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
                    variant='standard'
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
                    variant='standard'
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
                    variant='standard'
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
                    variant='standard'
                    placeholder=''
                    multiline={true}
                    rows={2}
                    error={Boolean(errors.description)}
                  />
                )}
              />
              {errors.description && <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>}
            </FormControl>
            {/*<Box sx={{ display: 'flex', alignItems: 'center' }}>

              <Button size='medium' variant='outlined' color='secondary' sx={{ mr: 3 }} onClick={()=>resetAll()} fullWidth>
                Annuler
              </Button>
              <Button size='medium' type='submit' variant='contained'>
                  Enrégister
              </Button>
            </Box>*/}
            <Grid container spacing={2}>
                      <Grid item xs={4} md={4} sm={12}>
                        {ability.can(UserAction.Delete, EntityAbility.BRANCH) && (
                        data &&
                        <Button size='medium'  variant='outlined' color='error' onClick={() =>handleoPenDialog(ACTIONDELETE,DELETEMES)} fullWidth>
                          Suprimer
                        </Button>
                        )}
                      </Grid>
                      <Grid item xs={4}  md={4} sm={12}  >
                        <Button size='medium' variant='outlined' color='secondary' sx={{ mr: 2 }} onClick={()=>resetAll()} fullWidth>
                            Annuler
                        </Button>

                      </Grid>
                      <Grid item xs={4}  md={4} sm={12}  >
                        <Button size='medium' type='submit' variant='outlined' fullWidth>
                          Enregistrer
                        </Button>
                        </Grid>
                  </Grid>
            </CardContent>
          </Card>
        </form>
        <ConfirmDialog
        open={open}
        setOpen={setOpen}
        entityLabel={ENTITY}
        row={data}
        message={message}
        submitAction={handleDelete}
        action={actionData}
        />
    </>
  )
}




export default AddCard
