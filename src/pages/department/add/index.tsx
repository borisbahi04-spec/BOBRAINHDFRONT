
// ** React Imports
import { useEffect } from 'react'


// ** Next Imports

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Third Party Components

// ** Types

// ** Demo Components Imports

// ** Styled Component
import AddCard from 'src/views/pages/department/add/AddCard'
import { getSession } from 'next-auth/react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/redux/store'



import { EntityAbility, UserAction } from 'src/configs/Action'
import { useSettings } from 'src/@core/hooks/useSettings'



const Add = (props:any) => {

  const { settings, saveSettings } = useSettings()

  const accessstore = useSelector((state: RootState) => state?.access?.data);


  const dispatch=useDispatch()


  useEffect(()=>{
    saveSettings({ ...settings,
      iconPage:``,
      titlePage:`Création Departement`
     })
  },[])





return (
      <Grid container spacing={2} direction="column" width='35%'>
        <Grid item xl={12} md={12} xs={12}>
          <AddCard data=''/>
        </Grid>
      </Grid>
  )
}




Add.acl = {
  action:UserAction.Create,
  subject:EntityAbility.ROLE
}

Add.authGuard = true

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
export default Add
