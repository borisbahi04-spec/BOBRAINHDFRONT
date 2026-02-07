// ** Demo Components Imports
import { getSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useSettings } from 'src/@core/hooks/useSettings';
import { EntityAbility, UserAction } from 'src/configs/Action';
import ExpiredSessionDialog from 'src/views/pages/confirmDialog/ExpiredSessionDialog';
import EditView from 'src/views/pages/department/edit/Edit'
// ** Styled Component

const DepartmentEdit = (props:any) => {

  const {data}=props;

  const { settings, saveSettings } = useSettings()






   useEffect(()=>{
    saveSettings({ ...settings,
      iconPage:``,
      titlePage:`Modification departement`
     })
  },[])




  return (
      data?
        <EditView data={data} />
      :
       <ExpiredSessionDialog/>
  )
}

DepartmentEdit.acl = {
  action:UserAction.Edit,
  subject:EntityAbility.BRANCH
}

DepartmentEdit.authGuard = true

export async function getServerSideProps(context: {req?: any; }) {
  const { req} = context;
  const { id } = context.query;


 const session = await getSession({ req });
  try{
  const {token}=session?.user;


  const departmentedit = await fetch(`${process.env.PUBLIC_URL}/${process.env.ENTITYDEPARTMENT}/${id}`,{
    headers: {
      'x-user-claims': `${token}`,
    },
  });



    const departmentbeditResponse:any = await departmentedit.json();



  if(!departmentbeditResponse || departmentbeditResponse.errors){
      return {redirect: {
        destination: '/login',
        permanent: false,
    }
  }}


return {
    props: {
      data:departmentbeditResponse,
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
export default DepartmentEdit
