
// ** React Imports
import { useEffect } from 'react'


// ** Next Imports

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Third Party Components

// ** Types

// ** Demo Components Imports

// ** Styled Component
import AddCard from 'src/views/pages/role/add/AddCard'
import { getSession } from 'next-auth/react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/redux/store'



import { EntityAbility, UserAction } from 'src/configs/Action'
import { useSettings } from 'src/@core/hooks/useSettings'
import { getaccess } from 'src/redux/reducers/Access/AccessReducer'



const RoleAdd = (props:any) => {

  const { settings, saveSettings } = useSettings()
  const {accessData}=props;

  const accessstore = useSelector((state: RootState) => state?.access?.data);


  const dispatch=useDispatch()


  useEffect(()=>{
    saveSettings({ ...settings,
      iconPage:``,
      titlePage:`Création Rôle`
     })
  },[])


  useEffect(()=>{
    dispatch(getaccess(accessData));
  },[dispatch])



return (
      <Grid container spacing={2} direction="column" width='35%'>
        <Grid item xl={12} md={12} xs={12}>
          <AddCard access={accessstore} data=''/>
        </Grid>
      </Grid>
  )
}




RoleAdd.acl = {
  action:UserAction.Create,
  subject:EntityAbility.ROLE
}

RoleAdd.authGuard = true

export async function getServerSideProps(context: {req?: any; }) {
  const { req} = context;


 const session = await getSession({ req });
  try{

  const {token}=session?.user;

  const accessResp = await fetch(`${process.env.PUBLIC_URL}/${process.env.ENTITYACCESS}`,{
    headers: {
      'x-user-claims': `${token}`,
    },
  });




  const accessResponse:any = await accessResp.json();

  if(!accessResponse || accessResponse.errors){
        return {redirect: {
          destination: '/login',
          permanent: false,
      }
    }
  }


return {
    props: {
      accessData:accessResponse,
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
export default RoleAdd
