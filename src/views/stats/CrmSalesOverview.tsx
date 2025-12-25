// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import {BasicYearMenu } from 'src/myCustomComponent'
import { useState } from 'react'

const CrmSalesOverview = (props) => {
  let {t,slabel,title,data,yearList,onFilterDate}=props
  // ** Hook
  const theme = useTheme()
  const [myFilterValue,setMyFilterValue]=useState('currentYear')
  const [mydata,setMydata]=useState([])


  if(data.length>0){
    const _mydata =data.filter(item => item.label!==null);
    setMydata(_mydata)
  }

 const series =mydata.map(item => item.nbsale);
const labels = mydata.map(item => item.label);



  const data2 = {
    label: labels,
    series:series
  };

  const totalAmount =  data.length>0?data.reduce((total,dt) => total + dt.amount, 0):0;

  const getColor=(label:string)=>{
      let returnval:any;
      if(label=='Monture') returnval='primary.main';
      if(label=='Verre') returnval=hexToRGBA(theme.palette.secondary.main, 0.5);
      if(!label) returnval=hexToRGBA(theme.palette.primary.main, 0.2);

      //////////

      if(label=='Maison mère') returnval='primary.main';
      if(label=='netvision_man') returnval=hexToRGBA(theme.palette.secondary.main, 0.5);
      if(label=='Netvision-daloa') returnval=hexToRGBA(theme.palette.primary.main, 0.4);
      if(label=='Netvision-abidjan') returnval=theme.palette.customColors.trackBg
      ;

      return returnval;
  }

  const options: ApexOptions= (label:string)=> {

    return {
    chart: {
      sparkline: { enabled: true }
    },
    colors: [
      theme.palette.primary.main,
      hexToRGBA(theme.palette.primary.main, 0.4),
      hexToRGBA(theme.palette.secondary.main, 0.7),
      theme.palette.customColors.trackBg
    ],
    stroke: { width: 0 },
    legend: { show: false },
    dataLabels: { enabled: false },
    labels: data2?.label,
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    plotOptions: {
      pie: {
        customScale: 0.9,
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              offsetY: 25,
              fontSize: '0.875rem',
              color: theme.palette.text.secondary
            },
            value: {
              offsetY: -15,
              fontWeight: 500,
              formatter: value => `${value}`,
              color: theme.palette.text.primary
            },
            total: {
              show: true,
              fontSize: '0.875rem',
              label: label,
              color: theme.palette.text.secondary,
              formatter: value => `${value.globals.seriesTotals.reduce((total: number, num: number) => total + num)} `
            }
          }
        }
      }
    }
    }
  }



  return (
    <Card>
      <CardHeader
        title={title}
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
        action={
          <BasicYearMenu filter={yearList} onFilterDate={onFilterDate} filterValue={setMyFilterValue}/>
        }
      />
      <CardContent>
        <Grid container sx={{ my: [0, 4, 1.625] }}>
          <Grid item xs={12} sm={6} sx={{ mb: [3, 0] }}>
            <ReactApexcharts type='donut' height={220} series={data2.series} options={options(t(myFilterValue))} />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ my: 'auto' }}>
            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' variant='rounded' sx={{ mr: 3, '& svg': { color: 'primary.main' } }}>
                <Icon icon='mdi:currency-usd' />
              </CustomAvatar>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='body2'>{slabel}</Typography>
                <Typography variant='h6'>{`${totalAmount} FCFA`}</Typography>
              </Box>
            </Box>
            <Divider sx={{ my: theme => `${theme.spacing(4)} !important` }} />
            <Grid container>
              {
                data.length>0 && data.map((dt:any)=>{
                  if(dt.label){
                     return (
                    <Grid item xs={6} sx={{ mb: 4 }}>
                      <Box
                        sx={{
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          '& svg': { mr: 1.5, fontSize: '0.75rem', color: getColor(dt.label) }
                        }}
                      >
                        <Icon icon='mdi:circle' />
                        <Typography variant='body2'>{`${dt.label??'Autres'}`}</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 600 }}>{`${dt.amount} FCFA`}</Typography>
                    </Grid>
                  )
                  }

                })
              }
              {
                /*
                <Grid item xs={6} sx={{ mb: 4 }}>
                <Box
                  sx={{
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': { mr: 1.5, fontSize: '0.75rem', color: 'primary.main' }
                  }}
                >
                  <Icon icon='mdi:circle' />
                  <Typography variant='body2'>Apparel</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600 }}>$12,150</Typography>
              </Grid>
              <Grid item xs={6} sx={{ mb: 4 }}>
                <Box
                  sx={{
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': { mr: 1.5, fontSize: '0.75rem', color: hexToRGBA(theme.palette.primary.main, 0.7) }
                  }}
                >
                  <Icon icon='mdi:circle' />
                  <Typography variant='body2'>Electronic</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600 }}>$24,900</Typography>
              </Grid>
              <Grid item xs={6}>
                <Box
                  sx={{
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': { mr: 1.5, fontSize: '0.75rem', color: hexToRGBA(theme.palette.primary.main, 0.5) }
                  }}
                >
                  <Icon icon='mdi:circle' />
                  <Typography variant='body2'>FMCG</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600 }}>$12,750</Typography>
              </Grid>
              <Grid item xs={6}>
                <Box
                  sx={{
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': { mr: 1.5, fontSize: '0.75rem', color: 'customColors.trackBg' }
                  }}
                >
                  <Icon icon='mdi:circle' />
                  <Typography variant='body2'>Other Sales</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600 }}>$50,200</Typography>
              </Grid>*/}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CrmSalesOverview
