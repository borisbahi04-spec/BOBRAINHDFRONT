// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'

// ** Next
import { useRouter } from 'next/router'

// ** Icons
import Icon from 'src/@core/components/icon'

// ** ACL
import { useContext, useState } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux/store'
import { enumStatus } from 'src/definitions/enum'
import { EntityAbility, UserAction } from 'src/configs/Action'
import { CircularProgress } from '@mui/material'

interface Props {
  data: any
  handlePrint:any,
  onApprove:any,
  onTreated:any,
  onCancel:any,
  onReject?:any,
  onPrint: () => void
  onClose:any
}

const PreviewActions = ({
  handlePrint,
  onApprove,
  onTreated,
  onReject,
  onClose,
  onCancel
}: Props) => {
  const router = useRouter()
  const ability = useContext(AbilityContext)
  const data = useSelector((state: RootState) => state.requester.previewdata)
  const [loadingApprove, setLoadingApprove] = useState(false)
  const [loadingClose, setLoadingClose] = useState(false)
  const [loadingTreated, setLoadingTreated] = useState(false)
  const [loadingCancel, setLoadingCancel] = useState(false)
  const [loadingReject, setLoadingReject] = useState(false)


  if (!data) return null

  return (
    <Card sx={{ position: 'sticky', top: 80 }}>
      <CardContent>
        <Stack spacing={2}>
         {/* ===== PRINT ===== */}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<Icon icon="mdi:printer" />}
            onClick={handlePrint}
          >
            Imprimer
          </Button>

          <Divider />

          {/* ===== APPROVE ===== */}
          {ability.can(UserAction.Approval, EntityAbility.REQUESTER)&& (
            data.status == enumStatus.Open && (
             <Button
              onClick={() => onApprove(setLoadingApprove)}
              disabled={loadingApprove}
              startIcon={loadingApprove && <CircularProgress size={16} />}
              variant="contained"
              color="success"
            >
              {loadingApprove ? 'Approbation...' : 'Approuver'}
            </Button>
          ))}

          {/* ===== TREATED ===== */}
          {ability.can(UserAction.Treated, EntityAbility.REQUESTER)&& (
            data.status == enumStatus.Approved && (
            <Button
              onClick={() => onTreated(setLoadingTreated)}
              disabled={loadingTreated}
              startIcon={loadingTreated && <CircularProgress size={16} />}
              variant="outlined"
            >
              {loadingTreated ? 'Traitement...' : 'Traiter'}
            </Button>
          ))}

          {/* ===== CLOSE ===== */}
           {ability.can(UserAction.Close, EntityAbility.REQUESTER)&& (
            data.status == enumStatus.Approved || data.status == enumStatus.Rejected || data.status == enumStatus.Treated && (
             <Button
                onClick={() => onClose(setLoadingClose)}
                disabled={loadingClose}
                startIcon={loadingClose && <CircularProgress size={16} />}
                variant="outlined"zzz
              >
                {loadingClose ? 'Clôturer...' : 'Clôturer'}
              </Button>
            ))}



          {/* ===== REJECT ===== */}
          {ability.can(UserAction.Approval, EntityAbility.REQUESTER)&& (
            data.status == enumStatus.Open && (
              <Button
                onClick={() => onReject(setLoadingReject)}
                disabled={loadingReject}
                startIcon={loadingReject && <CircularProgress size={16} />}
                variant="outlined"
                color="error"
              >
                {loadingReject ? 'Rejet...' : 'Rejeter'}
              </Button>
            )
          )}


        {/* ===== CANCEL ===== */}
        {ability.can(UserAction.Cancel, EntityAbility.REQUESTER)&& (
            data.status == enumStatus.Open && (
            <Button
                onClick={() => onCancel(setLoadingCancel)}
                disabled={loadingCancel}
                startIcon={loadingCancel && <CircularProgress size={16} />}
                variant="outlined"
              >
                {loadingCancel ? 'Annulation...' : 'Annuler'}
              </Button>
            ))}
          <Divider />

          {/* ===== BACK ===== */}
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            startIcon={<Icon icon="mdi:arrow-left" />}
            onClick={() => router.back()}
          >
            Retour
          </Button>

        </Stack>
      </CardContent>
    </Card>
  )
}

export default PreviewActions

