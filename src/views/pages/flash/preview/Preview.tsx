// ** React Imports
import { useState } from 'react'

// ** Next Import

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'


// ** Types

// ** Demo Components Imports
import PreviewCard from './PreviewCard'

const FlashPreview = (props) => {
  let {data}=props

  // ** State
  const [error] = useState<boolean>(false)







  if (data) {
    return (
      <>
        <Grid container spacing={6} width='40%'>
          <Grid item xl={12} md={12} xs={12}>
            <PreviewCard data={data}/>
          </Grid>

        </Grid>

      </>
    )
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
              n'existe pas.s:{' '}
          </Alert>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default FlashPreview
