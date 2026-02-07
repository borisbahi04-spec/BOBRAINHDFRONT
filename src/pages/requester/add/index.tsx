
// ** React Imports
import { useEffect } from 'react'

// ** Next Imports

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Third Party Components

// ** Types

// ** Demo Components Imports

// ** Styled Component
import AddCard from 'src/views/pages/requester/add/AddCard'
import { getSession } from 'next-auth/react'



import { EntityAbility, UserAction } from 'src/configs/Action'
import { useSettings } from 'src/@core/hooks/useSettings'
import { RootState } from 'src/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { getrequesttypes } from 'src/redux/reducers/requesttype/requesttype-reducer'
import { getstations } from 'src/redux/reducers/station/station-reducer'



const RequesterAdd = (props:any) => {

  const { settings, saveSettings } = useSettings()

 const {requesttypeData,stationData}=props

  const requesttypeStore = useSelector((state: RootState) => state.requesttype.data)
  const stationStore = useSelector((state: RootState) => state.station.data)

  const dispatch=useDispatch()


  useEffect(()=>{
    saveSettings({ ...settings,
      iconPage:``,
      titlePage:`CREATION DEMANDE INTERVENTION`
     })
  },[])


 useEffect(()=>{
      dispatch(getrequesttypes(requesttypeData));
      dispatch(getstations(stationData));
    },[dispatch])




return (
      <Grid container spacing={2} direction="column" width='45%'>
        <Grid item xl={12} md={12} xs={12}>
          <AddCard
                data=''
                requesttypes={requesttypeStore?.data}
                stations={stationStore?.data}
                />
        </Grid>
      </Grid>
  )
}




RequesterAdd.acl = {
  action:UserAction.Create,
  subject:EntityAbility.REQUESTER
}

RequesterAdd.authGuard = true

export async function getServerSideProps(context: {req?: any; }) {
  const { req} = context;

 const session = await getSession({ req });
  try{

  const {token}=session?.user;

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


  if(!requesttypeResponse || requesttypeResponse.errors){
    return {redirect: {
      destination: '/login',
      permanent: false,
      }
    }
  }



  if(!stationResponse || stationResponse.errors){
    return {redirect: {
      destination: '/login',
      permanent: false,
      }
    }
  }


return {
    props: {
      requesttypeData:requesttypeResponse,
      stationData:stationResponse
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

export default RequesterAdd
