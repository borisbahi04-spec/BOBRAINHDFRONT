// ** Demo Components Imports
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSettings } from 'src/@core/hooks/useSettings';
import { EntityAbility, UserAction } from 'src/configs/Action';
import { getbranchs } from 'src/redux/reducers/Branch/BranchReducer';
import { getroles } from 'src/redux/reducers/Role/RoleReducer';
import { RootState } from 'src/redux/store';
import ExpiredSessionDialog from 'src/views/pages/confirmDialog/ExpiredSessionDialog';
import EditView from 'src/views/pages/user/edit/Edit'
// ** Styled Component

const UserEdit = (props:any) => {

  const rolestore = useSelector((state: RootState) => state.role.data);
  const branchstore = useSelector((state: RootState) => state.branch.data);


  const {data,roleData,branchData}=props;

  const { settings, saveSettings } = useSettings()


  const dispatch=useDispatch()




   useEffect(()=>{
    saveSettings({ ...settings,
      iconPage:``,
      titlePage:`Modification Utilisateur`
     })
  },[])


  useEffect(()=>{
    dispatch(getroles(roleData));
    dispatch(getbranchs(branchData));
  },[dispatch])



  return (
      data?
        <EditView data={data} roles={rolestore} branchs={branchstore}/>
      :
       <ExpiredSessionDialog/>
  )
}

UserEdit.acl = {
  action:UserAction.Edit,
  subject:EntityAbility.USER
}

UserEdit.authGuard = true

export async function getServerSideProps(context: {req?: any; }) {
  const { req} = context;
  const { id } = context.query;


 const session = await getSession({ req });
  try{
  const {token}=session?.user;

    const useredit = await fetch(`${process.env.PUBLIC_URL}/user/${id}`,{
      headers: {
        'x-user-claims': `${token}`,
      },
    });



    const branchResp = await fetch(`${process.env.PUBLIC_URL}/branch`,{
      headers: {
        'x-user-claims': `${token}`,
      },
    });

    const roleResp = await fetch(`${process.env.PUBLIC_URL}/role`,{
      headers: {
        'x-user-claims': `${token}`,
      },
    });





    const usereditResponse:any = await useredit.json();
    const roleResponse:any = await roleResp.json();
    const branchResponse:any = await branchResp.json();




  if(!roleResponse || roleResponse.errors){
      return {redirect: {
        destination: '/login',
        permanent: false,
    }
  }}

  if(!branchResponse || branchResponse.errors){
    return {redirect: {
      destination: '/login',
      permanent: false,
  }
}}




return {
    props: {
      data:usereditResponse,
      roleData:roleResponse,
      branchData:branchResponse,

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
export default UserEdit
