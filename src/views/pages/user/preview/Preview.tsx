// ** React Imports
import { useState, useEffect, useRef } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'


// ** Types

// ** Demo Components Imports
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/redux/store'
import PreviewCard from './PreviewCard'
import PreviewActions from './PreviewActions'
import { useReactToPrint } from 'react-to-print'
import toast from 'react-hot-toast'
import ConfirmDialog from '../../confirmDialog/ConfirmDialog'

const OrderPreview = (props) => {
  let {data}=props
  const printref = useRef();

  // ** State
  const [error] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()
  const [openconfirm, setOpenconfirm] = useState<boolean>(false)
  const [row, setRow] = useState<boolean>(false)

  const handlePrint= useReactToPrint({
    content:()=>printref.current,
    documentTitle:`Vente`,
  })



const _startPrint=(order:any)=>{
  const _onSuccess=(res:any)=>{
    setOpenconfirm(false)
    handlePrint()

  }
  const _onError=(res:any)=>{
    toast.error(`${res.message}`,{position:'top-center'})
  }

 //dispatch(RST_PrintOrdersAction(order.id,_onSuccess,_onError))
}

const beforePrint=(order:any)=>{
  if(!order.printingActorId){
    _openConfirmModal(order)
     return false
   }
   _startPrint(order)
}
//berforePrint

const _openConfirmModal=(order:any)=>{
  setOpenconfirm(true)
  setRow(order)
}


  if (data) {
    console.log("data25555")
    console.log(data)

    return (
      <>
        <Grid container spacing={6}>
          <Grid item xl={9} md={8} xs={12}>
            <PreviewCard data={data} printref={printref}/>
          </Grid>
          <Grid item xl={3} md={4} xs={12}>
            <PreviewActions  data={data} handlePrint={()=>beforePrint(data)}/>
          </Grid>
        </Grid>
        {/*<SendInvoiceDrawer open={sendInvoiceOpen} toggle={toggleSendInvoiceDrawer} />
        <AddPaymentDrawer open={addPaymentOpen} toggle={toggleAddPaymentDrawer} />*/}
      <ConfirmDialog open={openconfirm} setOpen={setOpenconfirm} submitAction={_startPrint} row={row} titleAction="IMPRESSION DE LA FACTURE "/>

      </>
    )
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            le fiche de reception avec le code :  n'existe pas. Veuillez vérifier la liste des bon de commandes:{' '}

          </Alert>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default OrderPreview
