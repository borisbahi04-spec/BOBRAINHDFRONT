
// ** React Imports
import { useEffect } from 'react'


// ** Next Imports

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Third Party Components

// ** Types

// ** Demo Components Imports

// ** Styled Component
import AddCard from 'src/views/pages/branch/add/AddCard'
import { getSession } from 'next-auth/react'
import { useDispatch, useSelector } from 'react-redux'



import { EntityAbility, UserAction } from 'src/configs/Action'
import { useSettings } from 'src/@core/hooks/useSettings'




const BranchAdd = (props:any) => {
  const { settings, saveSettings } = useSettings()
  const dispatch=useDispatch()


  useEffect(()=>{
    saveSettings({ ...settings,
      iconPage:``,
      titlePage:`CREATION SURCCUSALE`
     })
  },[])



return (
      <Grid container spacing={2} direction="column" width='40%'>
        <Grid item xl={12} md={12} xs={12}>
          <AddCard
          data=''
          />
        </Grid>
      </Grid>
  )
}




BranchAdd.acl = {
  action:UserAction.Create,
  subject:EntityAbility.BRANCH
}

BranchAdd.authGuard = true

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
export default BranchAdd
