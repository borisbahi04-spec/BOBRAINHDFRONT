/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect, useContext } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

// ** Icon Imports

// ** Third Party Imports

// ** Configs

// ** Custom Component Imports
import { AppDispatch } from 'src/redux/store'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller} from 'react-hook-form'

import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import toast from 'react-hot-toast'

import { useDispatch } from 'react-redux'
import { usePrevious } from 'src/myCustomFunctions'
import { Card, Divider, InputAdornment, Typography } from '@mui/material'
import { emailRegExp, phoneRegExp, showErrors } from 'src/helpers'
import {RST_CreateFlashAction, RST_UpdateFlashAction, RST_DeleteFlashAction, RST_FlashsAction } from 'src/redux/actions/flash/flash-actions'
import { useRouter } from 'next/router'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { EntityAbility, UserAction } from 'src/configs/Action'
import { initSocket } from 'src/myservices/socket/socket-service'
import { useSession } from 'next-auth/react'




interface FlashData {
  id: string
  firstName: string
  phoneNumber: number
  email:string
  address:string

}



const AddCard = (props:any) => {
  const router = useRouter()
  const {data,roles}=props;
  const ability = useContext(AbilityContext)

const defaultValues = {
  id: '',
  sentWeight: '',
}

const session = useSession();
const [_socket, setSocket] = useState();




  const prevFlash:any =usePrevious(data);





  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const schema = yup.object().shape({
    id:yup.string(),
    sentWeight:yup.number()
  })
  const {
    reset,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })


  const create = (data: any) => {
    const _onSuccess=(res)=>{
      router.push(`/flash/preview/${res.id}`)
    }
    const _onError=(res:any)=>{
      const {errors}=res;
      toast.error(`${flashErrMess(errors)}`,{position:'top-center'})
     }

    dispatch(RST_CreateFlashAction(data,_onSuccess,_onError))
  }

  const resetAll=() =>{
    reset();
    router.back()
  }

  const flashErrMess=(errors)=>{
    let errmess='';

    if(errors?.firstName) errmess+=errors?.firstName+' '
    if(errors?.email) errmess+=errors?.email+' '
    if(errors?.phoneNumber) errmess+=errors?.phoneNumber+' '
    if(errors?.code) errmess+=errors?.code+' '

    return errmess
  }


const  edit=(data:FlashData)=> {
  const onUpdateFlashSuccess=(res)=>{
     router.push(`/flash/preview/${res.id}`)
   }

   const onUpdateFlashError=(res:any)=>{
    const {errors}=res;
      toast.error(`${flashErrMess(errors)}`,{position:'top-center'})
   }

   if(prevFlash.firstName!=data.firstName || prevFlash.phoneNumber!=data.phoneNumber ||
     prevFlash.email!=data.email  || prevFlash.code!=data.code  || prevFlash.address!=data.address|| prevFlash.description!=data.description ){
      dispatch(RST_UpdateFlashAction(data.id,data,onUpdateFlashSuccess,onUpdateFlashError))
   }else{
    resetAll()
   }
 }









 const handleDelete = (row:any) => {
  const onSuccess = () => {
    dispatch(RST_FlashsAction())
    toast.success(`Suppression '${row.firstName}' effectué avec succès`,{position:'top-center'})
    resetAll();
  }
  const onError = (res:any) => {
    toast.error(`${res.message}`,{position:'top-center'})
  }
  dispatch(RST_DeleteFlashAction(row.id,onSuccess,onError))
}



  const onSubmit = (dt:any,e:any) =>{

return data? edit(dt):create(dt);
}




useEffect(()=>{
  if (data) {
    setValue('id', data.id)
    setValue('sentWeight', Math.round(data.sentWeight).toString())
  }
},[])


  useEffect(() => {
      const socket:any = initSocket(session?.data?.user?.token);
      setSocket(socket)

      setSocket(socket)
      socket.on('connect', () => {
        console.log('Socket connecté', socket.id);
        socket.emit('message', { text: 'Bonjour depuis Next.js' });
      });

      socket.on('new_flash', (dt) => {
        console.log('Nouveau flash reçu via socket:', dt);
        console.log('rrrrrrrr:', dt.data.sentWeight);
        setValue('sentWeight', dt.data.sentWeight)
      });

return () => {
        socket.off('new_flash');
        //socket.disconnect();
            };
    }, [dispatch, session?.data?.user?.token]);

const handleChangeDescription = (event) => {
  // Limit the description to 250 characters
  setValue('description',event.target.value.slice(0, 250),{shouldValidate:true});
};



  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
            <Grid container  spacing={2}>

            <Grid item xs={12} sm={12}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name='sentWeight'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: {value,onChange} }) => (
                    <TextField
                      type='number'
                      value={value}
                      disabled
                      label='Poids denvoi'
                      onChange={onChange}
                      variant="standard"
                      error={Boolean(errors.sentWeight)}
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
                {errors.sentWeight && <FormHelperText sx={{ color: 'error.main' }}>{errors.sentWeight.message}</FormHelperText>}
              </FormControl>
            </Grid>

            </Grid>
          </CardContent>
          <Divider/>
          <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              {data && (
                ability.can(UserAction.Delete, EntityAbility.ORDER) && (
                <Button size="medium" variant="outlined" color="error" onClick={() => handleDelete(data)}>
                  Supprimer
                </Button>)
              )}
            </Grid>
            <Grid item xs={12} md={8}>
              <Box display="flex" justifyContent="flex-end">
                <Button size="medium" variant="outlined" color="secondary" sx={{ mr: 2 }} onClick={resetAll}>
                  Annuler
                </Button>
               {
               ability.can(UserAction.Delete, EntityAbility.ORDER) && (
                <Button size="medium" type="submit" variant="outlined">
                  Enregistrer
                </Button>
              )}
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
