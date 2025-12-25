// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Custom Components Imports
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import CrmSalesOverview from 'src/views/stats/CrmSalesOverview'
import CrmTransactions from 'src/views/stats/CrmTransactions'

// ** Custom Components Imports
import { CardStatsCharacterProps } from 'src/@core/components/card-statistics/types'
import { AppDispatch, RootState } from 'src/redux/store'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RST_ProductsAction, RST_getSearchProductsAction } from 'src/redux/actions/product/productActions'
import TableStock from 'src/views/stats/TableStock'
import { YearEnum, currentYear, filterDateList, getYearsList } from 'src/myCustomFunctions'
import CrmTotalBySeries from 'src/views/stats/CrmTotalBySeries'
import { RST_StatsTotalCountAction, RST_StatsTotalMonthAmountAction, RST_StatsTotalSaleByBranchAction, RST_StatsTotalSaleByInsuranceAction, RST_StatsTotalSaleByProductTypeAction, RST_StatsTotalYearAmountAction } from 'src/redux/actions/Stats/StatsActions'
import CrmSalesByAssuranceTreepmapOverview from 'src/views/stats/CrmSalesByAssuranceTreepmapOverview'
import Clock from './Clock'
import { Box } from '@mui/material'



export type StockProduit = {
  id:string
  name: string
  availableStock: number
}


const DashboardComponent = (props: { t:any,targetBranchId: string }) => {
const {t}=props;
  const dispatch = useDispatch<AppDispatch>()
  const [stock,setStock]=useState([]);
  const [yearlist,setYearlist]=useState([])
  const [totalCount,setTotalCount]=useState([])
  const [saleTotalYearAmount,setSaleTotalYearAmount]=useState([])
  const [saletotalMonthAmount,setSaleTotalMonthAmount]=useState([])
  const [saleTotalSaleByProductType,setSaleTotalSaleByProductType]=useState([])
  const [saleTotalSaleBranch,setSaleTotalSaleBranch]=useState([])
  const [saleTotalSaleByInsurance,setSaleTotalSaleByInsurance]=useState([])






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

  const onSuccessTotalCount = (res: any) => {
    setTotalCount(res)
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

    },[ props?.targetBranchId])


  return (
    <ApexChartWrapper>




      <Grid container spacing={6}>

            <Grid item xs={12} md={12}>
            <CrmTransactions t={t} data={totalCount} onFilterDate={handleTransactionFilterDate} yearList={yearlist} />
            </Grid>


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
          {/*<Grid item xs={12} md={12} lg={6}>
            <CrmSalesOverview slabel='Vente totales'  t={t}  data={saleTotalSaleByProductType}  onFilterDate={handleTotalSaleByProductTypeFilterDate} title={'Aperçu des ventes par type de produits'} yearList={filterDateList}/>
          </Grid>*/}

          <Grid item xs={12} md={12} lg={12}>
            <CrmSalesByAssuranceTreepmapOverview t={t}  data={saleTotalSaleByInsurance}  onFilterDate={handleTotalSaleByInsuranceFilterDate} title={'Aperçu des ventes par Assurances'} yearList={filterDateList}/>
          </Grid>

      </Grid>
    </ApexChartWrapper>
  )
}

export default DashboardComponent;
