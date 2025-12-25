// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import React, { useState } from 'react'
import { BasicMenu } from 'src/myCustomComponent'

interface DataType {
  icon: string
  stats: string
  title: string
  color: ThemeColor
}

const salesData: DataType[] = [
  {
    stats: '245k',
    title: 'Ventes',
    color: 'primary',
    icon: 'mdi:trending-up'
  },
  {
    stats: '245k',
    title: 'Consultation',
    color: 'success',
    icon: 'mdi:account-outline'
  },
  {
    stats: '1.54k',
    color: 'warning',
    title: 'Commande en attente',
    icon: 'mdi:cellphone-link'
  },/*
  {
    stats: '12.5k',
    color: 'success',
    title: 'Clients',
    icon: 'mdi:account-outline'
  },
  {
    stats: '1.54k',
    color: 'warning',
    title: 'Produits',
    icon: 'mdi:cellphone-link'
  },*/

]



const getColor=(title:string)=>{
  let rcolor:string;
  if(title=='Sale') rcolor='primary';
  if(title=='Consult') rcolor='success';
  if(title=='PendingOrder') rcolor='warning';

return rcolor;
}

const getIcon=(title:string)=>{
  let rIcon:string;
  if(title=='Sale') rIcon='mdi:cart-percent';
  if(title=='Consult') rIcon='mdi:hospital-building';
  if(title=='PendingOrder') rIcon='mdi-border-all';

return rIcon;
}

const renderStats = (data,translation) => {


  return data && data?.map((item: DataType, index: number) => (
    <Grid item xs={12} sm={4} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar variant='rounded' color={getColor(item.title)} sx={{ mr: 3, boxShadow: 3, width: 44, height: 44 }}>
          <Icon icon={getIcon(item.title)} fontSize='1.75rem' />
        </CustomAvatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption'>{translation(item.title)}</Typography>
          <Typography variant='h6'>{item.stats}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}


const CrmTransactions = ({t,data,onFilterDate,yearList}) => {
 const [myFilterValue,setMyFilterValue]=useState('')

  return (
    <Card>
      <CardHeader
        title={`Transactions ${myFilterValue??''}`}
        action={
          <BasicMenu filter={yearList} onFilterDate={onFilterDate} filterValue={setMyFilterValue}/>
        }

        /*subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
              Total 48.5% growth
            </Box>{' '}
            😎 this month
          </Typography>
        }*/
        titleTypographyProps={{
          sx: {
            mb: 2.25,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}

      />
      <CardContent sx={{ pt: theme => `${theme.spacing(0.75)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {data.length>=0 ? renderStats(data,t):''}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CrmTransactions
