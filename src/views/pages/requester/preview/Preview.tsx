// ** React Imports
import { useState, useRef } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/redux/store'

// ** Custom Components
import PreviewCard from './PreviewCard'
import PreviewActions from './PreviewActions'
import ConfirmDialog from '../../confirmDialog/ConfirmDialog'

// ** Utils
import { useReactToPrint } from 'react-to-print'
import { enumStatus } from 'src/definitions/enum'
import { getByIdrequestersAction, postStatusrequesterAction } from 'src/redux/actions/requester/requester-actions'

type Request = {
  id: string
  reference: string
  ticket: string
  status: string
  createdById?: string
}

const RequesterPreview = (props:any) => {
  const printref = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch<AppDispatch>()
  const [error] = useState(false)
  const [openconfirm, setOpenconfirm] = useState(false)
  const [row, setRow] = useState<Request | null>(null)
  const data = useSelector((state: RootState) => state.requester.previewdata)

  const handlePrint = useReactToPrint({
    content: () => printref.current,
    documentTitle: data ? `REQUEST-${data.reference}` : 'REQUEST'
  })

  const _startPrint = () => {
    const _onSuccess = () => {
      setOpenconfirm(false)
      handlePrint()
    }


    _onSuccess()
  }

  const beforePrint = (requester: Request) => {
    // Exemple de règle : confirmation si pas encore imprimé
    if (!requester.createdById) {
      _openConfirmModal(requester)
      return
    }
    _startPrint(requester)
  }

  const approved = (requester: Request, setLoading: (loading: boolean) => void) => {
  setLoading(true) // démarrer le loader
  dispatch(
    postStatusrequesterAction(
      requester.id,
      enumStatus.Approved,
      (res: any) => {
        dispatch(getByIdrequestersAction(requester.id))
        setLoading(false) // fin du loader
      },
      (err: any) => {
        console.error('Error approving request:', err)
        setLoading(false) // fin du loader
      }
    )
  )
}

const onClosed = (requester: Request, setLoading?: (loading: boolean) => void) => {
      setLoading?.(true) // fin du loader
      dispatch(postStatusrequesterAction(requester.id, enumStatus.Closed,
        (res:any) => {
          // Success
          console.log('Request closed successfully')
          dispatch(getByIdrequestersAction(requester.id));
          setLoading?.(false) // fin du loader
        },
        (err:any) => {
          // Error
          console.error('Error closing request:', err)
          setLoading(false) // fin du loader
        }
      ))
   }
const onTreated = (requester: Request, setLoading?: (loading: boolean) => void) => {
      setLoading(true) // fin du loader
      dispatch(postStatusrequesterAction(requester.id, enumStatus.Treated,
        (res:any) => {
          // Success
          console.log('Request treated successfully')
          dispatch(getByIdrequestersAction(requester.id));
          setLoading(false) // fin du loader
        },
        (err:any) => {
          // Error
          console.error('Error treating request:', err)
          setLoading(false) // fin du loader
        }
      ))
   }

const onRejected = (requester: Request, setLoading?: (loading: boolean) => void) => {
      setLoading(true) // fin du loader
      dispatch(postStatusrequesterAction(requester.id, enumStatus.Rejected,
        (res:any) => {
          // Success
          console.log('Request rejected successfully')
          dispatch(getByIdrequestersAction(requester.id));
          setLoading(false) // fin du loader
        },
        (err:any) => {
          // Error
          console.error('Error rejecting request:', err)
          setLoading(false) // fin du loader
        }
      ))
   }


const onCancelled = (requester: Request, setLoading?: (loading: boolean) => void) => {
      setLoading(true) // fin du loader
      dispatch(postStatusrequesterAction(requester.id, enumStatus.Cancelled,
        (res:any) => {
          // Success
          console.log('Request annullé successfully')
          dispatch(getByIdrequestersAction(requester.id));
          setLoading(false) // fin du loader
        },
        (err:any) => {
          // Error
          console.error('Error treating request:', err)
          setLoading(false) // fin du loader
        }
      ))
   }




  const _openConfirmModal = (requester: Request) => {
    setRow(requester)
    setOpenconfirm(true)
  }

  if (data) {
    return (
      <>
        <Grid container spacing={6}>
          <Grid item xl={9} md={8} xs={12}>
            <PreviewCard data={data} printref={printref} />
          </Grid>

          <Grid item xl={3} md={4} xs={12}>
            <PreviewActions
              onApprove={(setLoading) => approved(data,setLoading)}
              onClose={(setLoading) => onClosed(data,setLoading)}
              onTreated={(setLoading) => onTreated(data,setLoading)}
              onCancel={(setLoading) => onCancelled(data,setLoading)}
              onReject={(setLoading) => onRejected(data,setLoading)}
              handlePrint={() => beforePrint(data)}

            />
          </Grid>
        </Grid>

        <ConfirmDialog
          open={openconfirm}
          setOpen={setOpenconfirm}
          submitAction={_startPrint}
          row={row}
          titleAction="IMPRESSION DE LA DEMANDE"
        />
      </>
    )
  }

  if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity="error">
            La fiche de réception demandée n’existe pas.
          </Alert>
        </Grid>
      </Grid>
    )
  }

  return null
}

export default RequesterPreview
