// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Custom Components Imports
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import CrmTransactions from 'src/views/stats/CrmTransactions'

// ** Custom Components Imports
import { AppDispatch } from 'src/redux/store'
import { useState } from 'react'
import { useDispatch } from 'react-redux'



export type StockProduit = {
  id:string
  name: string
  availableStock: number
}

const interventionStats = [
  {
    title: 'TotalRequest',
    stats: '128'
  },
  {
    title: 'PendingRequest',
    stats: '24'
  },
  {
    title: 'InProgress',
    stats: '18'
  },
  {
    title: 'Closed',
    stats: '86'
  }
]

const t = (key: string) => {
  const translations = {
    TotalRequest: 'Demandes totales',
    PendingRequest: 'En attente',
    InProgress: 'En cours',
    Closed: 'Clôturées'
  }

  return translations[key] ?? key
}



const yearList = [
  { label: '2024', value: '2024' },
  { label: '2025', value: '2025' },
  { label: '2026', value: '2026' }
]

const DashboardComponent = (props: { t:any,targetBranchId: string }) => {
const {t}=props;
const getColor = (title: string): ThemeColor => {
  switch (title) {
    case 'TotalRequest':
      return 'info'
    case 'PendingRequest':
      return 'warning'
    case 'InProgress':
      return 'primary'
    case 'Closed':
      return 'success'
    default:
      return 'secondary'
  }
}

const getIcon = (title: string): string => {
  switch (title) {
    case 'TotalRequest':
      return 'mdi:clipboard-list-outline'
    case 'PendingRequest':
      return 'mdi:clock-outline'
    case 'InProgress':
      return 'mdi:progress-wrench'
    case 'Closed':
      return 'mdi:check-circle-outline'
    default:
      return 'mdi:help-circle-outline'
  }
}

  const dispatch = useDispatch<AppDispatch>()
  const [stock,setStock]=useState([]);
  const [yearlist,setYearlist]=useState([])
  const [totalCount,setTotalCount]=useState([])
  const [saleTotalYearAmount,setSaleTotalYearAmount]=useState([])
  const [saletotalMonthAmount,setSaleTotalMonthAmount]=useState([])
  const [saleTotalSaleByProductType,setSaleTotalSaleByProductType]=useState([])
  const [saleTotalSaleBranch,setSaleTotalSaleBranch]=useState([])
  const [saleTotalSaleByInsurance,setSaleTotalSaleByInsurance]=useState([])

   const onSuccessTotalCount = (res: any) => {
    setTotalCount(res)
  }

  const StatTotalCountAction = (filterDate='',targetBranchId='') => {
      dispatch(RST_StatsTotalCountAction(filterDate,targetBranchId??'',onSuccessTotalCount))
  }

const onFilterDate = (year: string) => {
  console.log('Filtre appliqué sur l’année :', year)

  // ici tu peux :
  // - appeler ton API
  // - rafraîchir les stats
}

  const handleTransactionFilterDate = (val: string) => {
      StatTotalCountAction(val=='Tous'?'':val,props?.targetBranchId??'')
  }


/*

    const returnAllStock=(listProducts:Array<any>=[])=>{
        const  stock:Array<StockProduit>=[]
      for(const st of listProducts ){
        const prd:StockProduit={id:'',name:'',type:'',availableStock:0};
        const availableStock= st.branchToProducts?st.branchToProducts.reduce((total: any, branchToProduct: { availableStock: any }) => total + branchToProduct.availableStock, 0):0;
        prd.id=st.id
        prd.availableStock=availableStock
        prd.name=st.displayName
        prd.type=st.type
        stock.push(prd)
    }

return stock??[]
  }
  const returnAllStockTargetBranchId=(listProducts:Array<any>)=>{
    const  stock:Array<StockProduit>=[]
    for(const st of listProducts){
      const prd:StockProduit={id:'',name:'',type:'',availableStock:0};
      const availableStock=st?.branchToProducts ? st.branchToProducts.filter(item => item?.branchId === props.targetBranchId).reduce((total: any, branchToProduct: { availableStock: any }) => total + branchToProduct.availableStock, 0):0;
      prd.id=st.id
      prd.availableStock=availableStock
      prd.name=st.displayName
      prd.type=st.type

      stock.push(prd && prd)
    }

return stock??[]
}


  const handleFilter = (val: any) => {
    dispatch(RST_getSearchProductsAction({value:val},onAllBranchSuccess))
  }

  const handleTransactionFilterDate = (val: string) => {
      StatTotalCountAction(val=='Tous'?'':val,props?.targetBranchId??'')
  }

  const handleTotalBySeriesMonthlyFilterDate = (val: string) => {
    StatsTotalMonthAmountAction(val,props?.targetBranchId??'')
 }


const handleTotalSaleByInsuranceFilterDate = (val: string) => {
  StatsTotalSaleByInsuranceAction(val,props?.targetBranchId??'')
}

const handleTotalSaleByBranchFilterDate = (val: string) => {
  StatsTotalSaleByBranchAction(val,props?.targetBranchId??'')
}



  const onSuccessYearAmount = (res: any) => {
    setSaleTotalYearAmount(res)
  }
  const onSuccessMonthAmount = (res: any) => {
    setSaleTotalMonthAmount(res)
 }
 const onSuccessSaleByProductType = (res: any) => {
  console.log("res222222222")
  console.log(res)

  setSaleTotalSaleByProductType(res)
}

const onSuccessSaleByBranch = (res: any) => {
  setSaleTotalSaleBranch(res)
}

const onSuccessSaleByInsurance = (res: any) => {
  setSaleTotalSaleByInsurance(res)
}




  const StatTotalCountAction = (filterDate='',targetBranchId='') => {
      dispatch(RST_StatsTotalCountAction(filterDate,targetBranchId??'',onSuccessTotalCount))
  }


  const StatsTotalYearAmountAction = (filterDate='',targetBranchId='') => {
    const time='yearly'
      dispatch(RST_StatsTotalYearAmountAction(time,filterDate,targetBranchId??'',onSuccessYearAmount))
  }

  const StatsTotalMonthAmountAction = (filterDate='',targetBranchId='') => {
    const time='monthly'
      dispatch(RST_StatsTotalMonthAmountAction(time,filterDate,targetBranchId??'',onSuccessMonthAmount))
  }


  const StatsTotalSaleByProductTypeAction = (filterDate,targetBranchId='') => {
      dispatch(RST_StatsTotalSaleByProductTypeAction(filterDate,targetBranchId??'',onSuccessSaleByProductType))
  }


  const StatsTotalSaleByBranchAction = (filterDate,targetBranchId='') => {
    dispatch(RST_StatsTotalSaleByBranchAction(filterDate,targetBranchId??'',onSuccessSaleByBranch))
}

const StatsTotalSaleByInsuranceAction = (filterDate,targetBranchId='') => {
  dispatch(RST_StatsTotalSaleByInsuranceAction(filterDate,targetBranchId??'',onSuccessSaleByInsurance))
}





    const onAllBranchSuccess=(res)=>{
      if(props.targetBranchId){
        res.data && setStock(returnAllStockTargetBranchId(res.data))
      }else{
        setStock(returnAllStock(res.data))
      }
    }

    useEffect(()=>{
      setYearlist(getYearsList())
      dispatch(RST_ProductsAction(onAllBranchSuccess))
      StatTotalCountAction('',props?.targetBranchId)
      StatsTotalYearAmountAction('',props?.targetBranchId)
      StatsTotalMonthAmountAction(currentYear,props?.targetBranchId)
      StatsTotalSaleByProductTypeAction(YearEnum.currentYear,props?.targetBranchId)
      StatsTotalSaleByBranchAction(YearEnum.currentYear,props?.targetBranchId)
      StatsTotalSaleByInsuranceAction(YearEnum.currentYear,props?.targetBranchId)

    },[ props?.targetBranchId])*/


  return (
    <ApexChartWrapper>




      <Grid container spacing={6}>

            <Grid item xs={12} md={12}>
                  <CrmTransactions
                      t={t}
                      data={interventionStats}
                      yearList={[
                        { label: 'Aujourd’hui', value: 'today' },
                        { label: 'Cette semaine', value: 'week' },
                        { label: 'Ce mois', value: 'month' }
                      ]}
                      onFilterDate={(filter) => {
                        console.log('Filtre intervention :', filter)
                        // appel API ici
                      }}
                    />
            </Grid>

      {/*
        {!props?.targetBranchId?
        <Grid item xs={12} md={12} lg={12}>
          <CrmSalesOverview   slabel='Vente totales'  t={t}  data={saleTotalSaleBranch} onFilterDate={handleTotalSaleByBranchFilterDate} title={'Aperçu des ventes par surccusales'} yearList={filterDateList}/>
        </Grid>
        :''}
        <Grid item xs={12} sm={6} md={6}>
          <CrmTotalBySeries title={"Opérations/Mois"} onFilterDate={handleTotalBySeriesMonthlyFilterDate} data={saletotalMonthAmount} yearList={yearlist} />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <CrmTotalBySeries title={"Opérations/An"} data={saleTotalYearAmount} yearList={[]}/>
        </Grid>

            <Grid item xs={12} md={6} lg={6} >
                <TableStock t={t} stock={stock} handleFilter={handleFilter}/>
            </Grid>
          <Grid item xs={12} md={12} lg={6}>
            <CrmSalesOverview slabel='Vente totales'  t={t}  data={saleTotalSaleByProductType}  onFilterDate={handleTotalSaleByProductTypeFilterDate} title={'Aperçu des ventes par type de produits'} yearList={filterDateList}/>
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <CrmSalesByAssuranceTreepmapOverview t={t}  data={saleTotalSaleByInsurance}  onFilterDate={handleTotalSaleByInsuranceFilterDate} title={'Aperçu des ventes par Assurances'} yearList={filterDateList}/>
          </Grid>
          */}
      </Grid>
    </ApexChartWrapper>
  )
}

export default DashboardComponent;
