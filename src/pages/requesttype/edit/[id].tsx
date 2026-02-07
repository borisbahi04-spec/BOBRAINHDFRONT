// ** Demo Components Imports
import { getSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useSettings } from 'src/@core/hooks/useSettings';
import { EntityAbility, UserAction } from 'src/configs/Action';
import ExpiredSessionDialog from 'src/views/pages/confirmDialog/ExpiredSessionDialog';
import EditView from 'src/views/pages/requesttype/edit/Edit'
// ** Styled Component

const RequesttypeEdit = (props:any) => {

  const {data}=props;

  const { settings, saveSettings } = useSettings()






   useEffect(()=>{
    saveSettings({ ...settings,
      iconPage:``,
      titlePage:`Modification type de demande`
     })
  },[])




  return (
      data?
        <EditView data={data} />
      :
       <ExpiredSessionDialog/>
  )
}

RequesttypeEdit.acl = {
  action:UserAction.Edit,
  subject:EntityAbility.BRANCH
}

RequesttypeEdit.authGuard = true

export async function getServerSideProps(context: {req?: any; }) {
  const { req} = context;
  const { id } = context.query;


 const session = await getSession({ req });
  try{
  const {token}=session?.user;


  const requesttypeedit = await fetch(`${process.env.PUBLIC_URL}/${process.env.ENTITYREQUESTTYPE}/${id}`,{
    headers: {
      'x-user-claims': `${token}`,
    },
  });



    const requesttypebeditResponse:any = await requesttypeedit.json();



  if(!requesttypebeditResponse || requesttypebeditResponse.errors){
      return {redirect: {
        destination: '/login',
        permanent: false,
    }
  }}


return {
    props: {
      data:requesttypebeditResponse,
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
export default RequesttypeEdit
