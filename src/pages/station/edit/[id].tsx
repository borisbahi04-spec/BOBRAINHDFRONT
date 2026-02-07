// ** Demo Components Imports
import { getSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useSettings } from 'src/@core/hooks/useSettings';
import { EntityAbility, UserAction } from 'src/configs/Action';
import ExpiredSessionDialog from 'src/views/pages/confirmDialog/ExpiredSessionDialog';
import EditView from 'src/views/pages/station/edit/Edit'
// ** Styled Component

const StationEdit = (props:any) => {

  const {data}=props;

  const { settings, saveSettings } = useSettings()






   useEffect(()=>{
    saveSettings({ ...settings,
      iconPage:``,
      titlePage:`Modification Station`
     })
  },[])




  return (
      data?
        <EditView data={data} />
      :
       <ExpiredSessionDialog/>
  )
}

StationEdit.acl = {
  action:UserAction.Edit,
  subject:EntityAbility.BRANCH
}

StationEdit.authGuard = true

export async function getServerSideProps(context: {req?: any; }) {
  const { req} = context;
  const { id } = context.query;


 const session = await getSession({ req });
  try{
  const {token}=session?.user;


  const stationedit = await fetch(`${process.env.PUBLIC_URL}/${process.env.ENTITYSTATION}/${id}`,{
    headers: {
      'x-user-claims': `${token}`,
    },
  });



    const stationbeditResponse:any = await stationedit.json();



  if(!stationbeditResponse || stationbeditResponse.errors){
      return {redirect: {
        destination: '/login',
        permanent: false,
    }
  }}


return {
    props: {
      data:stationbeditResponse,
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
export default StationEdit
