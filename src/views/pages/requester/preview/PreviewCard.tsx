// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'

// ** Icons
import Icon from 'src/@core/components/icon'

// ** Utils
import moment from 'moment'
import { translate } from 'react-translate'
import { ImgStyled } from 'src/myCustomFunctions'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux/store'
import { enumStatus } from 'src/definitions/enum'

interface Props {
  data: any
  printref?: any
  t?: any
}

const statusColor: Record<string, 'warning' | 'info' | 'success' | 'error' | 'default'> = {
  [enumStatus.Open]: 'warning',
  [enumStatus.Approved]: 'info',
  [enumStatus.Treated]: 'info',
  [enumStatus.Closed]: 'success',
  [enumStatus.Rejected]: 'error',
  [enumStatus.Cancelled]: 'default'
}

const InfoItem = ({ icon, label, value }: { icon: string; label: string; value: any }) => (
  <Stack direction="row" spacing={1.5} alignItems="flex-start">
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: 1.5,
        backgroundColor: 'action.selected',
        color: 'text.secondary',
        flexShrink: 0
      }}
    >
      <Icon icon={icon} fontSize={18} />
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.4 }}>
        {label}
      </Typography>
      <Typography fontWeight={600}>{value || '—'}</Typography>
    </Box>
  </Stack>
)

const PreviewCard = ({ printref, t }: Props) => {
  const data = useSelector((state: RootState) => state.requester.previewdata)

  if (!data) return null

  const historyEvents = [
    data.approvedBy && {
      label: 'Approuvé par',
      firstName: data.approvedBy.userData.firstName,
      lastName: data.approvedBy.userData.lastName,
      date: data.approvedAt,
      icon: 'mdi:check-circle-outline',
      color: 'success.main'
    },
    data.treatedBy && {
      label: 'Traité par',
      firstName: data.treatedBy.userData.firstName,
      lastName: data.treatedBy.userData.lastName,
      date: data.treatedAt,
      icon: 'mdi:wrench-outline',
      color: 'info.main'
    },
    data.rejectedBy && {
      label: 'Rejeté par',
      firstName: data.rejectedBy.userData.firstName,
      lastName: data.rejectedBy.userData.lastName,
      date: data.rejectedAt,
      icon: 'mdi:close-circle-outline',
      color: 'error.main'
    },
    data.closedBy && {
      label: 'Clôturé par',
      firstName: data.closedBy.userData.firstName,
      lastName: data.closedBy.userData.lastName,
      date: data.closedAt,
      icon: 'mdi:lock-check-outline',
      color: 'text.secondary'
    },
    data.cancelledBy && {
      label: 'Annulé par',
      firstName: data.cancelledBy.userData.firstName,
      lastName: data.cancelledBy.userData.lastName,
      date: data.cancelledAt,
      icon: 'mdi:cancel',
      color: 'warning.main'
    }
  ].filter(Boolean) as Array<{
    label: string
    firstName: string
    lastName: string
    date: string
    icon: string
    color: string
  }>

  return (
    <Card ref={printref} sx={{ borderRadius: 2 }}>
      {/* ================= HEADER ================= */}
      <CardContent sx={{ py: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Stack spacing={0.5}>
              <ImgStyled src="/images/monlogo.png" />
              <Typography variant="h6" fontWeight={700}>
                Helpdesk
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}>
              <Chip
                label={t ? t(data.status) : data.status}
                color={statusColor[data.status] ?? 'default'}
                size="small"
                sx={{ fontWeight: 600 }}
              />
              <Chip label={t ? t(data.priority) : data.priority} color="error" variant="outlined" size="small" />
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              Créé le {moment(data.createdAt).format('DD/MM/YYYY à HH:mm')}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      {/* ================= META ================= */}
      <CardContent sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <InfoItem icon="mdi:pound-box-outline" label="Référence" value={data.reference} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoItem icon="mdi:ticket-confirmation-outline" label="Ticket" value={data.ticket} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoItem icon="mdi:tag-outline" label="Type" value={data?.requesttype?.displayName} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoItem icon="mdi:map-marker-outline" label="Station" value={data?.station?.displayName} />
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      {/* ================= DEMANDEUR / HISTORIQUE ================= */}
      <CardContent sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={historyEvents.length ? 6 : 12}>
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.6 }}>
              Demandeur
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                <Icon icon="mdi:account-outline" fontSize={20} />
              </Avatar>
              <Box>
                <Typography fontWeight={600}>{data?.createdBy?.userData?.username}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {data?.createdBy?.userData?.email ?? ''}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {historyEvents.length > 0 && (
            <Grid item xs={12} sm={6}>
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.6 }}>
                Historique
              </Typography>
              <Stack spacing={2} sx={{ mt: 1 }}>
                {historyEvents.map(event => (
                  <Stack direction="row" spacing={1.5} alignItems="center" key={event.label}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: event.color }}>
                      <Icon icon={event.icon} fontSize={18} />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {event.label} {event.firstName} {event.lastName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {moment(event.date).format('DD/MM/YYYY à HH:mm')}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Grid>
          )}
        </Grid>
      </CardContent>

      <Divider />

      {/* ================= TITRE ================= */}
      <CardContent sx={{ py: 4 }}>
        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.6 }}>
          Titre
        </Typography>
        <Typography variant="h6" sx={{ mt: 0.5 }}>
          {data.title}
        </Typography>
      </CardContent>

      <Divider />

      {/* ================= DESCRIPTION ================= */}
      <CardContent sx={{ py: 4 }}>
        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.6 }}>
          Description
        </Typography>
        <Typography sx={{ whiteSpace: 'pre-line', mt: 0.5 }}>{data.description}</Typography>
      </CardContent>
    </Card>
  )
}

export default translate('Requester')(PreviewCard)
