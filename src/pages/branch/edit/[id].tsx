// ** Demo Components Imports
import { getSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSettings } from 'src/@core/hooks/useSettings';
import { EntityAbility, UserAction } from 'src/configs/Action';
import ExpiredSessionDialog from 'src/views/pages/confirmDialog/ExpiredSessionDialog';
import EditView from 'src/views/pages/branch/edit/Edit'
// ** Styled Component

const BranchEdit = (props:any) => {



  const {data}=props;

  const { settings, saveSettings } = useSettings()


  const dispatch=useDispatch()




   useEffect(()=>{
    saveSettings({ ...settings,
      iconPage:``,
      titlePage:`MODIFICATION SURCCUSALE`
     })
  },[])



  return (
      data?
        <EditView data={data}
        />
      :
       <ExpiredSessionDialog/>
  )
}

BranchEdit.acl = {
  action:UserAction.Edit,
  subject:EntityAbility.BRANCH
}

BranchEdit.authGuard = true

export async function getServerSideProps(context: {req?: any; }) {
  const { req} = context;
  const { id } = context.query;


 const session = await getSession({ req });
  try{
  const {token}=session?.user;

  const branchedit = await fetch(`${process.env.PUBLIC_URL}/${process.env.ENTITYBRANCH}/${id}`,{
    headers: {
      'x-user-claims': `${token}`,
    },
  });

    const brancheditResponse:any = await branchedit.json();


  if(!brancheditResponse || brancheditResponse.errors){
      return {redirect: {
        destination: '/login',
        permanent: false,
    }
  }}


return {
    props: {
      data:brancheditResponse,
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
export default BranchEdit
