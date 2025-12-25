// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Types
import { PricingPlanType } from 'src/@core/components/plan-details/types'
import BillingAddressCard from './billing/BillingAddressCard'
import BillingHistoryTable from './billing/BillingHistoryTable'
import CurrentPlanCard from './billing/CurrentPlanCard'
import PaymentMethodCard from './billing/PaymentMethodCard'

// ** Demo Components
const TabBilling = ({ apiPricingPlanData }: { apiPricingPlanData: PricingPlanType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CurrentPlanCard data={apiPricingPlanData} />
      </Grid>

      <Grid item xs={12}>
        <PaymentMethodCard />
      </Grid>

      <Grid item xs={12}>
        <BillingAddressCard />
      </Grid>

      <Grid item xs={12}>
        <BillingHistoryTable />
      </Grid>
    </Grid>
  )
}

export default TabBilling
