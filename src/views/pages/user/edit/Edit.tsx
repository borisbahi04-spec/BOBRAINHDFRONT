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
import { UserEditDto } from 'src/dto/user/user-dto-view'




const UserEdit = (props:UserEditDto) => {
const {data,roles,branchs}=props
  // ** State
  const [error] = useState<boolean>(false)

  const dispatch = useDispatch<AppDispatch>()
  const [addSupplierOpen, setAddSupplierOpen] = useState<boolean>(false)

  const toggleAddSupplierDrawer = () => setAddSupplierOpen(!addSupplierOpen)

  if (data) {
    return (
      <>
        <Grid container spacing={2} direction="column" width='35%'>
          <Grid item xl={12} md={12} xs={12}>
              <AddCard data={data} roles={roles} branchs={branchs} />
            </Grid>
        </Grid>

       {/*<AddSupplierDrawer open={addSupplierOpen} toggle={toggleAddSupplierDrawer} isEditMode={false}  row=''/>*/}

      </>
    )
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            Consult with the  does not exist. Please check the list of consults:{' '}
            <Link href='/user/list'> Liste utilisateur</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default UserEdit
