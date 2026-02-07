// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'

// ** Utils
import moment from 'moment'
import { translate } from 'react-translate'
import { ImgStyled } from 'src/myCustomFunctions'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux/store'

interface Props {
  data: any
  printref?: any
  t?: any
}

const PreviewCard = ({ printref, t }: Props) => {
    const data = useSelector((state: RootState) => state.requester.previewdata)

  if (!data) return null


  return (
    <Card ref={printref} sx={{ borderRadius: 2 }}>
      {/* ================= HEADER ================= */}
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Stack direction="row" spacing={2} alignItems="center">
              <ImgStyled src="/images/monlogo.jpg" />

            </Stack>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            sx={{ textAlign: { xs: 'left', sm: 'right' } }}
          >
            <Stack
              direction="row"
              spacing={1}
              justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
            >
              <Chip
                label={t ? t(data.status) : data.status}
                color={data.status === 'Open' ? 'warning' : 'success'}
                size="small"
              />
              <Chip
                label={t ? t(data.priority) : data.priority}
                color="error"
                size="small"
              />
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Créé le :
              {moment(data.createdAt).format('DD/MM/YYYY hh:mm:ss')}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      {/* ================= META ================= */}
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Référence
            </Typography>
            <Typography fontWeight={500}>{data.reference}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Ticket
            </Typography>
            <Typography fontWeight={500}>{data.ticket}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Type
            </Typography>
            <Typography fontWeight={500}>
              {data?.requesttype?.displayName}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Station
            </Typography>
            <Typography fontWeight={500}>
              {data?.station?.displayName}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      {/* ================= DEMANDEUR / RESPONSABLE ================= */}
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight={600}>
              Demandeur
            </Typography>
            <Typography>
              {data?.createdBy?.userData?.firstName}{' '}
              {data?.createdBy?.userData?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data?.createdBy?.userData?.email??''}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            {data?.approvedBy &&(
                <Typography variant="subtitle1" fontWeight={400}>
                Approuvé par : {data.approvedBy.userData.firstName}{' '}
                    {data.approvedBy.userData.lastName} {' le'} {moment(data.approvedAt).format('DD/MM/YYYY hh:mm:ss')}

                </Typography>
              )
            }
            {data?.rejectedBy &&(
                <Typography variant="subtitle1" fontWeight={400}>
                Rejeté par : {data.rejectedBy.userData.firstName}{' '}
                    {data.rejectedBy.userData.lastName} {' le'} {moment(data.rejectedAt).format('DD/MM/YYYY hh:mm:ss')}
                </Typography>
              )
            }
            {data?.treatedBy &&(
                <Typography variant="subtitle1" fontWeight={400}>
                Traité par : {data.treatedBy.userData.firstName}{' '}
                    {data.treatedBy.userData.lastName} {' le'} {moment(data.treatedAt).format('DD/MM/YYYY hh:mm:ss')}
                </Typography>
              )
            }
            {data?.closedBy &&(
                <Typography variant="subtitle1" fontWeight={400}>
                Clôturé par : {data.closedBy.userData.firstName}{' '}
                    {data.closedBy.userData.lastName} {' le '} {moment(data.closedAt).format('DD/MM/YYYY hh:mm:ss')}
                </Typography>
              )
            }
            {data?.cancelledBy &&(
                <Typography variant="subtitle1" fontWeight={400}>
                Annulé par : {data.cancelledBy.userData.firstName}{' '}
                    {data.cancelledBy.userData.lastName} {' le '} {moment(data.cancelledAt).format('DD/MM/YYYY hh:mm:ss')}
                </Typography>
              )
            }


          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      {/* ================= TITRE ================= */}
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600}>
          Titre
        </Typography>
        <Typography>{data.title}</Typography>
      </CardContent>

      <Divider />

      {/* ================= DESCRIPTION ================= */}
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600}>
          Description
        </Typography>
        <Typography sx={{ whiteSpace: 'pre-line' }}>
          {data.description}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default translate('Requester')(PreviewCard)
