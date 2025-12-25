// ** MUI Imports

// ** Custom Components Imports
import { getSession, GetSessionParams } from 'next-auth/react'
import { EntityAbility, UserAction } from 'src/configs/Action'

// ** Custom Components Imports
import { CardStatsCharacterProps } from 'src/@core/components/card-statistics/types'
import DashboardComponent from 'src/myCustomComponent/dashboardComponent'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux/store'
import {useTranslate } from "react-translate"
import { isTimestampExpired } from 'src/myCustomFunctions'
import ExpiredSessionDialog from 'src/views/pages/confirmDialog/ExpiredSessionDialog'
import { useEffect, useState } from 'react'

const data: CardStatsCharacterProps[] = [
  {
    stats: '13.7k',
    title: 'Ventes',
    trendNumber: '+38%',
    chipColor: 'primary',
    chipText: 'Year of 2022',
    src: '/images/cards/pose_f9.png'
  },
  {
    stats: '24.5k',
    trend: 'negative',
    title: 'Consultations',
    trendNumber: '-22%',
    chipText: 'Last Week',
    chipColor: 'secondary',
    src: '/images/cards/pose_m18.png'
  }
]


const Home = (props) => {
  const authuser = useSelector((state: RootState) => state.auth.getuserprofile)
  const auth=authuser?.session;
  const [isSessionExpire,setisSessionExpire]=useState(false)

  //const {t}  = useTranslation("common");
  const translate= useTranslate("common");
  console.log('auth2222222')
  console.log(props.session)

  useEffect(()=>{
    if(props.session){

      setisSessionExpire(true)
    }

  },[props.session])


return (
  <ExpiredSessionDialog/>

  /*props.session?
              <DashboardComponent t={translate} targetBranchId={auth?.targetBranchId}/>

  :<ExpiredSessionDialog/>*/
  )
}

export async function getServerSideProps(context: GetSessionParams | undefined) {
  const { req } = context;
  const session = await getSession({ req });

 if (!session){
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

return {
    props: { session },
  };
}




Home.acl = {
  action:UserAction.Read,
  subject:EntityAbility.BRANCH
}

Home.authGuard = true

export default  Home
