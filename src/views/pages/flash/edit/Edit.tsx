/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Types

// ** Third Party Components

// ** Demo Components Imports
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/redux/store'
import AddCard from '../add/AddCard'




const FlashEdit = (props:any) => {
const {data}=props
  // ** State
  const [error] = useState<boolean>(false)

  const dispatch = useDispatch<AppDispatch>()
  const [addFlashOpen, setAddFlashOpen] = useState<boolean>(false)

  const toggleAddFlashDrawer = () => setAddFlashOpen(!addFlashOpen)

  if (data) {
    return (
      <>
        <Grid container spacing={2} direction="column" width='35%'>
          <Grid item xl={12} md={12} xs={12}>
              <AddCard data={data} />
            </Grid>
        </Grid>


      </>
    )
  } else if (error) {
    return (
      <>
      </>
    )
  } else {
    return null
  }
}

export default FlashEdit
