// ** Demo Components Imports
import { getSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSettings } from 'src/@core/hooks/useSettings';
import { EntityAbility, UserAction } from 'src/configs/Action';
import { getSingledatarequester } from 'src/redux/reducers/requester/requester-reducer';
import { getrequesttypes } from 'src/redux/reducers/requesttype/requesttype-reducer';
import { getstations } from 'src/redux/reducers/station/station-reducer';
import { getusers } from 'src/redux/reducers/User/UserReducer';
import { RootState } from 'src/redux/store';
import ExpiredSessionDialog from 'src/views/pages/confirmDialog/ExpiredSessionDialog';
import Preview from 'src/views/pages/requester/preview/Preview';

// ** Styled Component

const RequesterPreview = (props: {
   data:any,
   stationData:any,
   requesttypeData:any,
   userData:any,
  }) => {
  const { settings, saveSettings } = useSettings()
    const dispatch=useDispatch()

  const {data,userData,stationData,requesttypeData }=props;

  const stationStore = useSelector((state: RootState) => state.station.data)
  const requesttypeStore = useSelector((state: RootState) => state.requesttype.data)
  const userStore = useSelector((state: RootState) => state.user.data)
  const singleRequesterStore = useSelector((state: RootState) => state.requester.previewdata)

  useEffect(() => {
    saveSettings({ ...settings,
        iconPage:'mdi:account-group',
        titlePage: 'DETAILS DE LA DEMANDE D\'INTERVENTION'
       })
},[])



  useEffect(()=>{
       dispatch(getrequesttypes(requesttypeData));
       dispatch(getstations(stationData));
       dispatch(getusers(userData));
       dispatch(getSingledatarequester(data));
     },[dispatch])


return (
    <Preview
      data={singleRequesterStore}
      requesttypes={requesttypeStore?.data}
      stations={stationStore?.data}
      users={userStore?.data}
     />
   )

}


RequesterPreview.acl = {
  action:UserAction.Read,
  subject: EntityAbility.REQUESTER
}
RequesterPreview.authGuard = true

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

     const userResp = await fetch(`${process.env.PUBLIC_URL}/${process.env.ENTITYUSER}`,{
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
    const userResponse:any = await userResp.json();




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
if(!userResponse || userResponse.errors){
  return {redirect: {
    destination: '/login',
    permanent: false,
}}
}




return {
    props: {
      data:requestereditResponse,
      requesttypeData:requesttypeResponse,
      stationData:stationResponse,
      userData:userResponse,
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
export default RequesterPreview
