// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import {BasicYearMenu } from 'src/myCustomComponent'
import { useState } from 'react'
import { getRandomColor } from 'src/myCustomFunctions'

const CrmSalesByAssuranceTreepmapOverview = (props) => {
  let {t,title,data,yearList,onFilterDate}=props
  // ** Hook
  const theme = useTheme()
  const [myFilterValue,setMyFilterValue]=useState('currentYear')
  const zdata:Array<any>=[]


    if(data.lenght>0 ){
     for(let t of data){
        let dt:object={x:'',y:'',z:''}
        dt.z=getRandomColor()
        dt.x=t.label
        dt.y=t.amount
        zdata.push(dt)
     }
  }

  //const colors = test.map(() => getRandomColor());

/*const dataWithColors = test.map((item, index) => ({
  ...item,
  z: colors[index]
}));*/

const colorsArray = zdata.map(item => item.z);


  const options :any = {
    series: [
    {
      data:zdata
    }
  ],
    legend: {
    show: false
  },
  chart: {
    height: 350,
    type: 'treemap'
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: '16px',
    },
    formatter: function(text, op) {
      return [text, `${op.value??0} FCFA`]
    },
    offsetY: -4
  },
  title: {
    text:'',
    align: 'center'
  },
  colorScale: {
    ranges: [
      {
        from: -6,
        to: 0,
        color: '#CD363b'
      },
      {
        from: 0.001,
        to: 6,
        color: '#52B12d'
      }
    ]
  },
  plotOptions: {
    treemap: {
      distributed: true,
      enableShades: false
    }
  }
  };

  return (
    <Card>
      <CardHeader
        title={`${title} - ${t(myFilterValue)}`}
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
        action={
          <BasicYearMenu filter={yearList} onFilterDate={onFilterDate} filterValue={setMyFilterValue}/>
        }
      />
      <CardContent>
        <Grid container sx={{ my: [0, 4, 1.625] }}>
          <Grid item xs={12} sm={12} sx={{ mb: [3, 0] }}>
            <ReactApexcharts  type='treemap' height={360} series={options.series}  options={options} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CrmSalesByAssuranceTreepmapOverview
