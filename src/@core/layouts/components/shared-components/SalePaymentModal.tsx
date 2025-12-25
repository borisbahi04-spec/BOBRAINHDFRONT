// ** React Imports
import { Ref, useState, forwardRef, ReactElement, useEffect, useRef } from 'react'

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
import { CardContent, Grid, DialogTitle, CardContentProps, GridProps, SelectChangeEvent, TextField, Table, TableBody, TableCell, TableHead, TableRow, Link, Tooltip, CircularProgress } from '@mui/material'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, useFieldArray} from 'react-hook-form'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/redux/store'
import { RST_PrintSaleBySaleIdPaymentIdAction, RST_SaleByIdAction, RST_SalesAction } from 'src/redux/actions/Sales/SaleActions'
import moment from 'moment'
import { RST_CreatePaymentAction, RST_DeletePaymentAction, RST_PaymentsAction, RST_PrintPaymentAction } from 'src/redux/actions/Sales/PaymentActions'
import toast from 'react-hot-toast'
import { MyDivider } from 'src/myCustomComponent'
import PreviewCard from 'src/views/pages/sale/preview/PreviewCard'
import { useReactToPrint } from 'react-to-print'
import ConfirmDialog from 'src/views/pages/confirmDialog/ConfirmDialog'


const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})





const SalePaymentModal = (props) => {
  const {open,handleOpenToggle,saleId
  }=props;

  const salestore = useSelector((state: RootState) => state.sale)
 const detailpayments=salestore?.detailpayments
 const salerow=salestore?.details

  // ** States
  const dispatch = useDispatch<AppDispatch>()
  const printref = useRef();
  const [openconfirm,setOpenconfirm]=useState<boolean>(false)
  const [row,setRow]=useState<any>()
  const [paymentLine,setPaymentLine]=useState<any>()



  // ** Hook
  const { settings } = useSettings()

  // ** Var
  const { direction } = settings

  const handleClose = () => {
    handleOpenToggle(0)
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
  reference: yup.string(),
  date: yup.date().required('Ce champ est obligatoire'),
  amount: yup.number()
  .transform((value) => Number.isNaN(value) ? null : value )
  .min(50,'le montant minimum est 50 Fcfa')
})








  const defaultValues = {
      reference:'',
      date:moment(new Date()).format("YYYY-MM-DDTHH:mm"),
      amount:0,
 }


  const {
      handleSubmit,
      reset,
      setValue,
     register,
     formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })














  const onSubmit = (dt:any,e:any) =>{
    e.preventDefault()

    const _onSuccess=(res)=>{
      dispatch(RST_PaymentsAction(saleId))
      dispatch(RST_SaleByIdAction(saleId))
      dispatch(RST_SalesAction())
      toast.success(` crée avec succès`,{position:'top-center'})
      reset({amount:0,date:moment(new Date()).format("YYYY-MM-DDTHH:mm")})
    }

    const _onError=(res:any)=>{
      toast.error(`${res.message}`,{position:'top-center'})
    }
     dt.date=moment(dt.date).format("YYYY-MM-DD")

     if(dt.amount>remainAmountToPay(salerow.amount,salerow.paidAmount)){
      toast.error(`Le montant à payer  ${salerow.amount} FCFA est supérieur au montant restant ${remainAmountToPay(salerow.amount,salerow.paidAmount)} FCFA`,{position:'top-center'})

return false
     }

     dispatch(RST_CreatePaymentAction(salerow?.id,dt,_onSuccess,_onError))

     //handleClose()
   }




   const _deletePayment = (saleId:string,paymentId:string) =>{
    const _onSuccess=()=>{
      dispatch(RST_PaymentsAction(saleId))
      dispatch(RST_SaleByIdAction(saleId))
      dispatch(RST_SalesAction())

      //toast.success(`${res.reference} supprimée avec succès`,{position:'top-center'})
    }
    const _onError=(res:any)=>{
      toast.error(`${res.message}`,{position:'top-center'})
    }
     dispatch(RST_DeletePaymentAction(saleId,paymentId,_onSuccess,_onError))

   }

   const remainAmountToPay = (amount=0,paidAmount=0) => {
    return amount-paidAmount
   }

   const _startPrint=(detailPayment:any)=>{
    const _onSuccess=(res:any)=>{
      handlePrint()
     dispatch(RST_PaymentsAction(saleId))
     setOpenconfirm(false)
    }
    const _onError=(res:any)=>{
      toast.error(`${res.message}`,{position:'top-center'})
    }
    dispatch(RST_PrintPaymentAction(detailPayment.saleId,detailPayment.id,_onSuccess,_onError))
  }


   const beforePrint=(item:any)=>{
    const _onSuccess=(res:any)=>{
        /*const _ongetPrintSucess=()=>{
        }*/
        setPaymentLine(res)

        //dispatch(RST_PrintSaleBySaleIdPaymentIdAction(item.saleId,item.id,_ongetPrintSucess))
    }
    dispatch(RST_PrintSaleBySaleIdPaymentIdAction(item.saleId,item.id,_onSuccess))

    if(!item.printingActorId){
      _openConfirmModal(item)
       return false
     }
     _startPrint(item)
  }

  const handlePrint= useReactToPrint({
    content:()=>printref.current,
    documentTitle:`Paiement`,
  })

  const _openConfirmModal=(detailPayment:any)=>{
    setOpenconfirm(true)
    setRow(detailPayment)
  }



 useEffect(()=>{
    if(saleId){
      dispatch(RST_SaleByIdAction(saleId))
    }
  },[dispatch, saleId])


  return (
    <Card>

      <Dialog
        fullWidth
        open={open}
        sx={{overflowY: 'scroll'}} disableScrollLock={false}
        maxWidth='md'
        onClose={handleClose}
        onBackdropClick={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle>
         <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
            <Icon icon='mdi:close' />
          </IconButton>

            <Typography variant='h6' sx={{ mb: 3 }}>
              <IconButton size='medium'>
               <Icon icon='mdi:cash' fontSize={40} />
               </IconButton>
                  Nouveau paiement sur la vente N° <strong>{salerow?.reference}</strong>
            </Typography>
            <Typography sx={{ ml: 11 }} variant='body1'>Montant restant à payer : <strong>{remainAmountToPay(salerow.amount,salerow.paidAmount)} FCFA</strong> </Typography>
        </DialogTitle>
      <DialogContent sx={{ px: { xs: 8, sm: 15 }, py: { xs: 8, sm: 12.5 }, position: 'relative' }}>
             {remainAmountToPay(salerow.amount,salerow.paidAmount)!=0?
            <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item lg={4} xs={4} md={4} sm={12} sx={{ mb: 3}}>
                    <TextField
                      fullWidth
                      label='Reference'
                      {...register('reference')}
                      InputProps={{ inputProps: { min: 0 } }}
                      error={errors?.reference?true :false}
                      helperText={errors?.reference?.message}
                      sx={{ m: 2, }}
                      />
                </Grid>
                <Grid item lg={4} xs={4} md={4} sm={12} sx={{ mb: 3}}>
                    <TextField
                      fullWidth
                      label='Date'
                      type='datetime-local'
                      {...register('date')}
                      InputProps={{ inputProps: { min: 0 } }}
                      error={errors?.date?true :false}
                      helperText={errors?.date?.message}
                      sx={{ m: 2, }}
                      inputProps={{
                        clearable:false
                        }}
                      />
                </Grid>
                <Grid item lg={4} xs={4} md={4} sm={12} sx={{ mb: 3}}>
                    <TextField
                      fullWidth
                      label='Saisir le montant'
                      {...register('amount')}
                      type='number'
                      InputProps={{ inputProps: { min: 0 } }}
                      error={errors?.amount?true :false}
                      helperText={errors?.amount?.message}
                      sx={{ m: 2, }}
                      />
                </Grid>
                <Grid item lg={8} xs={8} md={8} sm={12} sx={{ mb: 3}}>
                 <Button fullWidth variant='contained' type='submit' >
                    Valider
                  </Button>
                  </Grid>
                <Grid item lg={4} xs={4} md={4} sm={12} sx={{ mb: 3}}>
                  <Button fullWidth variant='contained' color='error' onClick={()=>handleClose()} sx={{ m:1 }} >
                    Annuler
                  </Button>
               </Grid>

            </Grid>
            </form>: null
            }
            <MyDivider sectionTitle="List des versements"/>
              <Grid item lg={12} xs={12} md={12} sm={12} sx={{ mb: 3}}>

              { detailpayments.length>0?
                <Table>
                <TableHead>
                <TableRow>
                  <TableCell>Reference</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Montant (FCFA)</TableCell>
                  <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {
                detailpayments?.map((item,index)=>{
                  return(
                    <TableRow key={index}>
                      <TableCell>{item?.reference}</TableCell>
                      <TableCell>{item.date?moment(item.date).format("DD/MM/YYYY"):'-'}</TableCell>
                      <TableCell>{item?.amount}</TableCell>
                      <TableCell>
                      {!item?.printingActorId?
                        <Tooltip  title={`Voir détails ${item.reference}`}>
                          <IconButton size='medium'  onClick={()=>_deletePayment(item.saleId,item.id)}>
                            <Icon icon='mdi:delete-outline'  color="red" fontSize={20} />
                          </IconButton>
                        </Tooltip>
                       :''}

                      <Tooltip title={`Imprimer ${item.reference}`}  onClick={()=>beforePrint(item)}>
                        <IconButton size='medium'>
                          <Icon icon='mdi:printer-outline' fontSize={20} />
                        </IconButton>
                      </Tooltip>


                      </TableCell>
                    </TableRow>
                  )})

                }
                </TableBody>
                </Table>
                :
                  <Box sx={{ display: 'flex',justifyContent:"center"}}  >
                      <Typography variant='body1' sx={{ mb: 3}}> Aucun paiement effectué </Typography>
                  </Box>
                }
              </Grid>
        </DialogContent>
      </Dialog>
      <div style={{ display: "none" }}>
         <PreviewCard data={paymentLine} printref={printref}/>
      </div>
      <ConfirmDialog open={openconfirm} setOpen={setOpenconfirm} submitAction={_startPrint} row={row} titleAction="IMPRESSION DU PAIEMENT "/>

    </Card>
  )
}



export default SalePaymentModal

