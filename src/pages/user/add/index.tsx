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
import AddCard from 'src/views/pages/user/add/AddCard'
import { getSession } from 'next-auth/react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/redux/store'



import { getbranchs } from 'src/redux/reducers/Branch/BranchReducer'
import { EntityAbility, UserAction } from 'src/configs/Action'
import { useSettings } from 'src/@core/hooks/useSettings'
import { getroles } from 'src/redux/reducers/Role/RoleReducer'



const UserAdd = (props:any) => {

  const { settings, saveSettings } = useSettings()
  const {roleData,branchData}=props;

  const rolestore = useSelector((state: RootState) => state.role.data);
  const branchstore = useSelector((state: RootState) => state.branch.data);


  const dispatch=useDispatch()


  useEffect(()=>{
    saveSettings({ ...settings,
      iconPage:``,
      titlePage:`Création Utilisateur`
     })
  },[])


  useEffect(()=>{
    dispatch(getroles(roleData));
    dispatch(getbranchs(branchData));

  },[dispatch])


return (
      <Grid container spacing={2} direction="column" width='35%'>
        <Grid item xl={12} md={12} xs={12}>
          <AddCard roles={rolestore} branchs={branchstore} data=''/>
        </Grid>
      </Grid>
  )
}




UserAdd.acl = {
  action:UserAction.Create,
  subject:EntityAbility.USER
}

UserAdd.authGuard = true

export async function getServerSideProps(context: {req?: any; }) {
  const { req} = context;


 const session = await getSession({ req });
  try{

  const {token}=session?.user;

  //const targetBranchId=session?.user.session.targetBranchId;
  //const isParentCompany=session?.user.session.targetBranch.isParentCompany;

  const roleResp = await fetch(`${process.env.PUBLIC_URL}/role`,{
    headers: {
      'x-user-claims': `${token}`,
    },
  });

  const branchResp = await fetch(`${process.env.PUBLIC_URL}/branch`,{
    headers: {
      'x-user-claims': `${token}`,
    },
  });



  const roleResponse:any = await roleResp.json();
  const branchResponse:any = await branchResp.json();

  if(!roleResponse || roleResponse.errors){
        return {redirect: {
          destination: '/login',
          permanent: false,
      }
    }
  }
  if(!branchResponse || branchResponse.errors){
    return {redirect: {
      destination: '/login',
      permanent: false,
  }
}
}




return {
    props: {
      roleData:roleResponse,
      branchData:branchResponse
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
export default UserAdd
