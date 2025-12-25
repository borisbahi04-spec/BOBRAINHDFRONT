/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useEffect } from 'react'


// ** Next Imports

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Third Party Components

// ** Types

// ** Demo Components Imports

// ** Styled Component
import { getSession } from 'next-auth/react'
import { useDispatch } from 'react-redux'



import { EntityAbility, UserAction } from 'src/configs/Action'
import { useSettings } from 'src/@core/hooks/useSettings'
import AddCard from 'src/views/pages/flash/add/AddCard'



const FlashAdd = (props:any) => {

  const { settings, saveSettings } = useSettings()
  const {roleData,branchData}=props;

  const dispatch=useDispatch()


  useEffect(()=>{
    saveSettings({ ...settings,
      iconPage:``,
      titlePage:`Flash - Ajouter un nouveau`
     })
  },[])





return (
      <Grid container spacing={2} direction="column" width='45%'>
        <Grid item xl={12} md={12} xs={12}>
          <AddCard  data=''/>
        </Grid>
      </Grid>
  )
}




FlashAdd.acl = {
  action:UserAction.Create,
  subject:EntityAbility.ORDER
}

FlashAdd.authGuard = true

export async function getServerSideProps(context: {req?: any; }) {
  const { req} = context;


 const session = await getSession({ req });
  try{

  const {token}=session?.user;

return {
    props: {
    },
  }
} catch (e) {
  return {
      redirect: {
          destination: '/login',
          permanent: false,
      }
  };
}
}
export default FlashAdd
