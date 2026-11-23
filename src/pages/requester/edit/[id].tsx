// ** Demo Components Imports
import { useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useSettings } from 'src/@core/hooks/useSettings';
import { EntityAbility, UserAction } from 'src/configs/Action';
import ExpiredSessionDialog from 'src/views/pages/confirmDialog/ExpiredSessionDialog';
import EditView from 'src/views/pages/requester/edit/Edit'
// ** Styled Component

const RequesterEdit = (props: any) => {
  const { data } = props
  const { settings, saveSettings } = useSettings()

  useEffect(() => {
    saveSettings({ ...settings, iconPage: 'mdi:file-document-edit-outline', titlePage: 'MODIFICATION DEMANDE INTERVENTION' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return data?.id ? <EditView data={data} /> : <ExpiredSessionDialog />
}

RequesterEdit.acl = {
  action:UserAction.Edit,
  subject:EntityAbility.REQUESTER
}

RequesterEdit.authGuard = true

export async function getServerSideProps(context: any) {
  const { req} = context;
  const { id } = context.query;


 const session: any = await getSession({ req });
  try{
  const {token}=session?.user;

    const requesteredit = await fetch(`${process.env.PUBLIC_URL}/${process.env.ENTITYREQUESTER}/${id}`,{
      headers: {
        'x-user-claims': `${token}`,
      },
    });



    const requesttypeResp = await fetch(`${process.env.PUBLIC_URL}/${process.env.ENTITYREQUESTTYPE}`,{
      headers: {
        'x-user-claims': `${token}`,
      },
    });

    const stationResp = await fetch(`${process.env.PUBLIC_URL}/${process.env.ENTITYSTATION}`,{
      headers: {
        'x-user-claims': `${token}`,
      },
    });





    const requesttypeResponse:any = await requesttypeResp.json();
    const stationResponse:any = await stationResp.json();
    const requestereditResponse:any = await requesteredit.json();




  if(!requesttypeResponse || requesttypeResponse.errors){
      return {redirect: {
        destination: '/login',
        permanent: false,
    }
  }}

  if(!stationResponse || stationResponse.errors){
    return {redirect: {
      destination: '/login',
      permanent: false,
  }
}}




return {
    props: {
      data:requestereditResponse,
      requesttypeData:requesttypeResponse,
      stationData:stationResponse,
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
export default RequesterEdit
