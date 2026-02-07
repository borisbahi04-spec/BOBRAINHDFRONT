import React, { useMemo } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Icon from 'src/@core/components/icon'

// --------------------
// Mock DATA (API simulée)
// --------------------
const interventions = [
  { id: 1, emitter: 'Comptabilité', type: 'NETWORK', priority: 'HIGH' },
  { id: 2, emitter: 'Comptabilité', type: 'NETWORK', priority: 'MEDIUM' },
  { id: 3, emitter: 'Comptabilité', type: 'IT', priority: 'LOW' },
  { id: 4, emitter: 'RH', type: 'IT', priority: 'LOW' },
  { id: 5, emitter: 'RH', type: 'IT', priority: 'MEDIUM' },
  { id: 6, emitter: 'Production', type: 'ELECTRICITY', priority: 'HIGH' },
  { id: 7, emitter: 'Production', type: 'ELECTRICITY', priority: 'HIGH' },
  { id: 8, emitter: 'Production', type: 'IT', priority: 'MEDIUM' },
  { id: 9, emitter: 'Logistique', type: 'NETWORK', priority: 'LOW' }
]

// --------------------
// Utils
// --------------------
const getColorByType = (type) => {
  switch (type) {
    case 'NETWORK': return 'primary'
    case 'IT': return 'success'
    case 'ELECTRICITY': return 'warning'
    default: return 'secondary'
  }
}

const getIconByType = (type) => {
  switch (type) {
    case 'NETWORK': return 'mdi:lan'
    case 'IT': return 'mdi:laptop'
    case 'ELECTRICITY': return 'mdi:flash'
    default: return 'mdi:help-circle'
  }
}

// --------------------
// Calcul métier
// --------------------
const useEmitterStats = (data) => {
  return useMemo(() => {
    const map = {}

    data.forEach(i => {
      if (!map[i.emitter]) {
        map[i.emitter] = { total: 0, breakdown: {} }
      }

      map[i.emitter].total += 1
      map[i.emitter].breakdown[i.type] = (map[i.emitter].breakdown[i.type] || 0) + 1
    })

    return Object.entries(map).map(([emitter, info]) => {
      const mostFrequentType = Object.entries(info.breakdown)
        .sort((a, b) => b[1] - a[1])[0][0]

      return {
        emitter,
        total: info.total,
        mostFrequentType,
        breakdown: info.breakdown
      }
    })
  }, [data])
}

// --------------------
// Components
// --------------------
const GlobalStats = ({ data }) => (
  <Card>
    <CardHeader title='Vue globale des demandes' />
    <CardContent>
      <Grid container spacing={4}>
        <Grid item xs={6} md={3}>
          <Typography variant='h6'>{data.length}</Typography>
          <Typography variant='caption'>Demandes totales</Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <Typography variant='h6'>{data.filter(i => i.priority === 'HIGH').length}</Typography>
          <Typography variant='caption'>Priorité haute</Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <Typography variant='h6'>{new Set(data.map(i => i.emitter)).size}</Typography>
          <Typography variant='caption'>Émetteurs</Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <Typography variant='h6'>{new Set(data.map(i => i.type)).size}</Typography>
          <Typography variant='caption'>Types de demande</Typography>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
)

const EmitterCard = ({ emitter, total, mostFrequentType, breakdown }) => (
  <Card>
    <CardContent>
      <Box display='flex' alignItems='center' mb={2}>
        <CustomAvatar color={getColorByType(mostFrequentType)} variant='rounded' sx={{ mr: 3 }}>
          <Icon icon={getIconByType(mostFrequentType)} />
        </CustomAvatar>
        <Box>
          <Typography variant='h6'>{emitter}</Typography>
          <Typography variant='caption'>Type dominant : {mostFrequentType}</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {Object.entries(breakdown).map(([type, count]) => (
        <Box key={type} display='flex' justifyContent='space-between' mb={1}>
          <Chip label={type} color={getColorByType(type)} size='small' />
          <Typography variant='body2'>{count}</Typography>
        </Box>
      ))}

      <Typography variant='caption' sx={{ mt: 2, display: 'block' }}>
        Total : {total} demandes
      </Typography>
    </CardContent>
  </Card>
)

// --------------------
// DASHBOARD PRINCIPAL
// --------------------
const InterventionDashboard = () => {
  const emitterStats = useEmitterStats(interventions)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <GlobalStats data={interventions} />
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h5'>Analyse par émetteur</Typography>
      </Grid>

      {emitterStats.map(e => (
        <Grid item xs={12} md={4} key={e.emitter}>
          <EmitterCard {...e} />
        </Grid>
      ))}
    </Grid>
  )
}

export default InterventionDashboard
