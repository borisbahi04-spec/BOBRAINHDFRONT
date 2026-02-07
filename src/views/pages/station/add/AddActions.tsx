// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports



interface Props {
  toggleSubmitAddCustomer: () => void
 }
const AddActions = (props:Props) => {
  const {toggleSubmitAddCustomer}=props

return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            {/*<Button fullWidth sx={{ mb: 3.5 }} variant='contained' startIcon={<Icon icon='mdi:send-outline' />}>
              Send Invoice
            </Button>*/}
            <Button fullWidth component={Link} sx={{ mb: 3.5 }} variant='outlined' href='/apps/invoice/preview/4987'>
               Prévisualisation
            </Button>
            <Button fullWidth variant='contained' sx={{ mb: 3.5 }} onClick={toggleSubmitAddCustomer}>
              Soumettre
            </Button>
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  )
}

export default AddActions
