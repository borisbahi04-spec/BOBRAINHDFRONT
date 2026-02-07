// ** Demo Components Imports
import { useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { useSettings } from 'src/@core/hooks/useSettings';
import { EntityAbility, UserAction } from 'src/configs/Action';
import { RootState } from 'src/redux/store';
import ExpiredSessionDialog from 'src/views/pages/confirmDialog/ExpiredSessionDialog';
import EditView from 'src/views/pages/requester/edit/Edit'
import { getrequesttypes } from 'src/redux/reducers/requesttype/requesttype-reducer';
import { getstations } from 'src/redux/reducers/station/station-reducer';
// ** Styled Component

const RequesterEdit = (props:any) => {
  const requesttypeStore = useSelector((state: RootState) => state.requesttype.data)
  const stationStore = useSelector((state: RootState) => state.station.data)
  const {data,requesttypeData,stationData}=props;
  const { settings, saveSettings } = useSettings()
  const dispatch=useDispatch()


   useEffect(()=>{
    saveSettings({ ...settings,
      iconPage:``,
      titlePage:`MODIFICATION DEMANDE INTERVENTION`
     })
  },[])


  useEffect(()=>{
       dispatch(getrequesttypes(requesttypeData));
       dispatch(getstations(stationData));
     },[dispatch])



  return (
      data?
        <EditView data={data} requesttypes={requesttypeStore?.data} stations={stationStore?.data} />
      :
       <ExpiredSessionDialog/>
  )
}

RequesterEdit.acl = {
  action:UserAction.Edit,
  subject:EntityAbility.REQUESTER
}

RequesterEdit.authGuard = true

export async function getServerSideProps(context: {req?: any; }) {
  const { req} = context;
  const { id } = context.query;


 const session = await getSession({ req });
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
