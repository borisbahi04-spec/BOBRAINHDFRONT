// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

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

  const canApprove = ability.can(UserAction.Approval, EntityAbility.REQUESTER) && data.status === enumStatus.Open
  const canTreat = ability.can(UserAction.Treated, EntityAbility.REQUESTER) && data.status === enumStatus.Approved
  const canClose =
    ability.can(UserAction.Close, EntityAbility.REQUESTER) &&
    (data.status === enumStatus.Approved || data.status === enumStatus.Rejected || data.status === enumStatus.Treated)
  const canReject = ability.can(UserAction.Approval, EntityAbility.REQUESTER) && data.status === enumStatus.Open
  const canCancel = ability.can(UserAction.Cancel, EntityAbility.REQUESTER) && data.status === enumStatus.Open

  const hasStatusActions = canApprove || canTreat || canClose || canReject || canCancel

  return (
    <Card sx={{ position: 'sticky', top: 80, borderRadius: 2 }}>
      <CardContent>
        <Stack spacing={2.5}>
          {/* ===== PRINT ===== */}
          <Button
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            startIcon={<Icon icon="mdi:printer-outline" />}
            onClick={handlePrint}
          >
            Imprimer
          </Button>

          {hasStatusActions && (
            <>
              <Divider />

              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.6 }}>
                Actions
              </Typography>

              <Stack spacing={1.5}>
                {/* ===== APPROVE ===== */}
                {canApprove && (
                  <Button
                    fullWidth
                    onClick={() => onApprove(setLoadingApprove)}
                    disabled={loadingApprove}
                    startIcon={
                      loadingApprove ? <CircularProgress size={16} color="inherit" /> : <Icon icon="mdi:check-circle-outline" />
                    }
                    variant="contained"
                    color="success"
                  >
                    {loadingApprove ? 'Approbation...' : 'Approuver'}
                  </Button>
                )}

                {/* ===== TREATED ===== */}
                {canTreat && (
                  <Button
                    fullWidth
                    onClick={() => onTreated(setLoadingTreated)}
                    disabled={loadingTreated}
                    startIcon={
                      loadingTreated ? <CircularProgress size={16} color="inherit" /> : <Icon icon="mdi:wrench-outline" />
                    }
                    variant="outlined"
                  >
                    {loadingTreated ? 'Traitement...' : 'Traiter'}
                  </Button>
                )}

                {/* ===== CLOSE ===== */}
                {canClose && (
                  <Button
                    fullWidth
                    onClick={() => onClose(setLoadingClose)}
                    disabled={loadingClose}
                    startIcon={
                      loadingClose ? <CircularProgress size={16} color="inherit" /> : <Icon icon="mdi:lock-check-outline" />
                    }
                    variant="outlined"
                  >
                    {loadingClose ? 'Clôturer...' : 'Clôturer'}
                  </Button>
                )}

                {/* ===== REJECT ===== */}
                {canReject && (
                  <Button
                    fullWidth
                    onClick={() => onReject(setLoadingReject)}
                    disabled={loadingReject}
                    startIcon={
                      loadingReject ? <CircularProgress size={16} color="inherit" /> : <Icon icon="mdi:close-circle-outline" />
                    }
                    variant="outlined"
                    color="error"
                  >
                    {loadingReject ? 'Rejet...' : 'Rejeter'}
                  </Button>
                )}

                {/* ===== CANCEL ===== */}
                {canCancel && (
                  <Button
                    fullWidth
                    onClick={() => onCancel(setLoadingCancel)}
                    disabled={loadingCancel}
                    startIcon={loadingCancel ? <CircularProgress size={16} color="inherit" /> : <Icon icon="mdi:cancel" />}
                    variant="outlined"
                    color="warning"
                  >
                    {loadingCancel ? 'Annulation...' : 'Annuler'}
                  </Button>
                )}
              </Stack>
            </>
          )}

          <Divider />

          {/* ===== BACK ===== */}
          <Button
            fullWidth
            variant="text"
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
