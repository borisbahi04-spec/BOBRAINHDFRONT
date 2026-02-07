// ** Demo Components Imports
import { getSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSettings } from 'src/@core/hooks/useSettings';
import { EntityAbility, UserAction } from 'src/configs/Action';
import { getaccess } from 'src/redux/reducers/Access/AccessReducer';
import { RootState } from 'src/redux/store';
import ExpiredSessionDialog from 'src/views/pages/confirmDialog/ExpiredSessionDialog';
import EditView from 'src/views/pages/role/edit/Edit'
// ** Styled Component

const RoleEdit = (props:any) => {

  const accessstore = useSelector((state: RootState) => state?.access?.data);


  const {data,accessData}=props;

  const { settings, saveSettings } = useSettings()


  const dispatch=useDispatch()




   useEffect(()=>{
    saveSettings({ ...settings,
      iconPage:``,
      titlePage:`Modification Rôle`
     })
  },[])


  useEffect(()=>{
    dispatch(getaccess(accessData));
  },[dispatch])


  return (
      data?
        <EditView data={data} access={accessstore}/>
      :
       <ExpiredSessionDialog/>
  )
}

RoleEdit.acl = {
  action:UserAction.Edit,
  subject:EntityAbility.ROLE
}

RoleEdit.authGuard = true

export async function getServerSideProps(context: {req?: any; }) {
  const { req} = context;
  const { id } = context.query;


 const session = await getSession({ req });
  try{
  const {token}=session?.user;


  const roleedit = await fetch(`${process.env.PUBLIC_URL}/${process.env.ENTITYROLE}/${id}`,{
    headers: {
      'x-user-claims': `${token}`,
    },
  });


  const accessResp = await fetch(`${process.env.PUBLIC_URL}/${process.env.ENTITYACCESS}`,{
    headers: {
      'x-user-claims': `${token}`,
    },
  });





    const accesseditResponse:any = await roleedit.json();
    const accessResponse:any = await accessResp.json();




  if(!accessResponse || accessResponse.errors){
      return {redirect: {
        destination: '/login',
        permanent: false,
    }
  }}


return {
    props: {
      data:accesseditResponse,
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
export default RoleEdit
