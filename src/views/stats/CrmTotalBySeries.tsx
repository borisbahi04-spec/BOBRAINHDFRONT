// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { useState } from 'react'
import { BasicMenu } from 'src/myCustomComponent'
import { currentYear } from 'src/myCustomFunctions'

const CrmTotalBySeries = (props) => {
  let {title,yearList,data,onFilterDate}=props;
  // ** Hook
  const theme = useTheme()
  const [myFilterValue,setMyFilterValue]=useState(yearList.length>0?currentYear:'')




  const options : ApexOptions= {

    series: [{
      name: 'Ventes',
      data: data?.Sale??[]
    }, {
      name: 'Consultations',
      data: data?.Consult??[]
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: data?.Categories??[],
        axisTicks: { show: false },
      axisBorder: { show: false },
        labels: {
          style: {
            fontSize: '0.875rem',
            colors: theme.palette.text.disabled
          }
        }
      },
      yaxis: {
        title: {
          text: 'FCFA'
        }
      },
        fill: {
          type: 'gradient',
          gradient: {
            opacityTo: 0.2,
            opacityFrom: 1,
            shadeIntensity: 0,
            type: 'horizontal',
            stops: [0, 100, 100]
          }
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return  val + " FCFA"
          }
        }
      }
    },


  };




  const tyearList=yearList.filter(item => item !== 'Tous');

  return (
    <Card>
      <CardHeader

        title={`${title} ${myFilterValue}`}
        //subheader='$21,845'
        subheaderTypographyProps={{
          sx: { mt: 1, fontWeight: 500, lineHeight: '2rem', color: 'text.primary', fontSize: '1.25rem !important' }
        }}
        action={
          yearList.length>0 && (
              <BasicMenu filter={tyearList} onFilterDate={onFilterDate} filterValue={setMyFilterValue}/>
          )
        }
        titleTypographyProps={{
          sx: {
            fontSize: '1rem !important',
            fontWeight: '600 !important',
            lineHeight: '1.5rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent>
      <ReactApexcharts options={options.options} series={options.series} type="bar" height={300} />
      </CardContent>
    </Card>
  )
}

export default CrmTotalBySeries
