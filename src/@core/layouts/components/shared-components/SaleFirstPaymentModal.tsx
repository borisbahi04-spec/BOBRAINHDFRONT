// ** React Imports
import { Ref, useState, forwardRef, ReactElement, useEffect } from 'react'

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hook Imports
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Tab Content Imports
import { CardContent, Grid, DialogTitle, CardContentProps, GridProps, SelectChangeEvent, TextField, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, useFieldArray} from 'react-hook-form'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/redux/store'
import { RST_SaleByIdAction, RST_SalesAction } from 'src/redux/actions/Sales/SaleActions'
import moment from 'moment'
import { RST_CreatePaymentAction } from 'src/redux/actions/Sales/PaymentActions'
import toast from 'react-hot-toast'


const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})





const SaleFirstPaymentModal = (props) => {
  const {open,handleOpenToggle,salerow,createSaleAndPayment
  }=props;

  // ** States
  const dispatch = useDispatch<AppDispatch>()

  const [amountToPay, setAmountToPay] = useState<number>(0)


  // ** Hook
  const { settings } = useSettings()

  // ** Var
  const { direction } = settings

  const handleClose = () => {
    handleOpenToggle()
    reset()
  }
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




 const schema = yup.object().shape({
  amount: yup.number().required('Ce champ est obligatoire').typeError('vous devez specifier un nombre'),
})








  const defaultValues = {
      //date:new Date().toISOString,
      amount:'',
 }


  const {
      handleSubmit,
      reset,
     register,
     control,
     setValue,
     formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })














/*const filteredproductAttributeIds:any = products && products.filter(obj => obj.id === getValues('productId')).reduce(function(acc, curr) {
  return acc.concat(curr.attributes);
}, []).map(obj => obj.id);*/


  const onSubmit = (dt:any,e:any) =>{
    e.preventDefault()
        salerow.payments[0].amount=dt.amount;
       // salerow.payments[0].date=moment(new Date().toISOString);
        if(dt.amount<0 ||dt.amount>amountToPay){
          toast.error(`Le montant à payer doit superieur à 0 | Inférieur ou égale au montant total`,{position:'top-center'})
          handleOpenToggle()
          return false;
        }
          createSaleAndPayment(salerow)

  }

    const totalAmountToPay=()=>{
      const totalToPayement = salerow.saleToProducts.reduce(
        (acc, current) => acc + (current.price || 0) * (current.quantity || 0),
        0 );
        const ttotal=Number(totalToPayement)-Number(salerow.insuranceAmount);
        setAmountToPay(ttotal)
    }



  useEffect(()=>{
    if(salerow){
      totalAmountToPay()
     }
   },[salerow])

  return (
    <Card>

      <Dialog
        fullWidth
        open={open}
        sx={{overflowY: 'scroll'}} disableScrollLock={false}
        maxWidth='xs'
        onClose={handleClose}
        onBackdropClick={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle>
         <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
            <Icon icon='mdi:close' />
          </IconButton>
            <Typography variant='h5' sx={{ mb: 3 }}>
              Premier versement
            </Typography>
            <Typography variant='body1'>Montant total à payer <strong>{amountToPay} FCFA</strong></Typography>
        </DialogTitle>
      <DialogContent sx={{ px: { xs: 8, sm: 15 }, py: { xs: 8, sm: 12.5 }, position: 'relative' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item lg={12} xs={12} md={12} sm={12} sx={{ mb: 3}}>
                    <TextField
                      fullWidth
                      label='Saisir le montant'
                      {...register('amount')}
                      InputProps={{ inputProps: { min: 0 } }}
                      error={errors?.amount?true :false}
                      helperText={errors?.amount?.message}
                      sx={{ m: 2, }}
                      type='number'
                      />
                </Grid>

            <Grid item xs={6} >
                  <Button fullWidth variant='contained' type='submit' sx={{ m:1 }} >
                    Valider
                  </Button>
           </Grid>
           <Grid item xs={6}>
                  <Button fullWidth variant='contained' color='error' onClick={()=>handleClose()} sx={{ m:1 }} >
                    Annuler
                  </Button>
           </Grid>

            </Grid>
            </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}



export default SaleFirstPaymentModal

