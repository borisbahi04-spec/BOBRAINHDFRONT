/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Types

// ** Third Party Components

// ** Demo Components Imports
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/redux/store'
import AddCard from '../add/AddCard'

import Link from 'next/link'



const RequesterEdit = (props:any) => {
const {data,requesttypes,stations}=props
  // ** State
  const [error] = useState<boolean>(false)

  const dispatch = useDispatch<AppDispatch>()

    if (data) {
      return (
          <Grid container spacing={2} direction="column" width='45%'>
            <Grid item xl={12} md={12} xs={12}>
              <AddCard data={data} requesttypes={requesttypes} stations={stations} />
              </Grid>
          </Grid>
      )
    } else if (error) {
      return (
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Alert severity='error'>
              Consult with the  does not exist. Please check the list of consults:{' '}
              <Link href='/requester/list'>Demande List</Link>
            </Alert>
          </Grid>
        </Grid>
      )
    } else {
      return null
    }
  }



export default RequesterEdit
