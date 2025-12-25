/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports

// ** Next Import

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Types

// ** Third Party Components

// ** Demo Components Imports
import AddCard from '../add/AddCard'




const BrancheEdit = (props:any) => {
const {data,branches,featureByPseudoName,dinings,categorys}=props
  // ** State

  if (data) {
    return (
        <Grid container spacing={2} direction="column" width='45%'>
          <Grid item xl={12} md={12} xs={12}>
              <AddCard data={data} branches={branches} featureByPseudoName={featureByPseudoName} dinings={dinings} categorys={categorys}/>
            </Grid>
        </Grid>
    )
  } else {
    return null
  }
}

export default BrancheEdit
