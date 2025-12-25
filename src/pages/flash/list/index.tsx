/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable newline-before-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useState, useEffect, useContext, useRef } from 'react'

// ** Next Imports

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Chip } from '@mui/material'

// ** Icon Imports

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports

// ** Utils Import

// ** Actions Imports

// ** Third Party Components

// ** Types Imports

// ** Custom Table Components Imports
import { AppDispatch,  RootState,   } from 'src/redux/store'

import { AbilityContext } from 'src/layouts/components/acl/Can'
import { getSession, useSession } from 'next-auth/react'
import { RST_getSearchFlashsAction, RST_FlashsAction } from 'src/redux/actions/flash/flash-actions'
import TableHeader from 'src/views/pages/flash/list/TableHeader'

//import AddFlashDrawer from 'src/views/pages/flash/list/AddFlashDrawer'
import router from 'next/dist/client/router'
import ExpiredSessionDialog from 'src/views/pages/confirmDialog/ExpiredSessionDialog'
import { AccessTypeEnum, EntityAbility, UserAction } from 'src/configs/Action'
import { useSettings } from 'src/@core/hooks/useSettings'
import { getflashs } from 'src/redux/reducers/flash/flash-reducer'
import moment from 'moment'
import { closeSocket, initSocket } from 'src/myservices/socket/socket-service'
import { StatusFlashChip } from 'src/myCustomComponent/myStatusFlashChip'







// ** renders fournisseur column



const MyColumns = ({ authuser }): GridColDef[] => {
  const roleName = authuser?.role?.name;

  const baseColumns: GridColDef[] = [
    {
      flex: 0.3,
      field: 'createdAt',
      headerName: 'Date',
      valueFormatter: ({ value }) =>
        value ? moment(value).locale('fr').format('DD MMM YYYY HH:mm:ss') : '-',
    },
    { flex: 0.2, field: 'station', headerName: 'Station CL' },
    { flex: 0.2, field: 'sentWeight', headerName: 'Poids (kg)' },
    {
      flex: 0.25,
      field: 'status',
      headerName: 'Statut',
      renderCell: ({ value }) => <StatusFlashChip value={value} />,
    },
  ];

  // Ajouter conditionnellement des colonnes selon le rôle
  if (roleName != AccessTypeEnum.guest) {
    baseColumns.splice(3, 0, // insérer avant "status"
      { flex: 0.2, field: 'computerUser', headerName: 'Utilisateur' },
      { flex: 0.2, field: 'computerName', headerName: 'PC' },
      { flex: 0.2, field: 'userProfile', headerName: 'Profil' }
    );
  }

  return baseColumns;
};

let sFlash:any={value:''};
const FlashList = (props:any) => {
  //branchData
  // ** State
  const [plan, setPlan] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(25)
  const [flashPinOpen, setFlashPinOpen] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [flash, setFlash] = useState<any>(props?.data)
  const { settings, saveSettings } = useSettings()
  const ability = useContext(AbilityContext)
  const [_socket, setSocket] = useState(null);
const socketRef = useRef<any>(null)


  const session = useSession();
  const authuser=session?.data?.user?.session;

  // ** Hooks
   const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state?.flash?.data)
  let pgquery:any={page:1,per_page:25};




  const handleFilter = (val: any) => {
    setValue(val)
    sFlash={...sFlash,value:val}
    const onSuccess=()=>{
      //setIsLoading(false)
    }
     dispatch(RST_getSearchFlashsAction(sFlash.value,pgquery,onSuccess))
   }

  const {branchData,roleData}=props;



  const handleAddFlash = ()=> {
      router.push(`/flash/add`);
  }





  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  useEffect(() => {
        saveSettings({ ...settings,
            iconPage:'mdi:truck-fast-outline',
            titlePage: 'Flash Pont Bascule'
           })
  },[])

   useEffect(() => {
        dispatch(getflashs(props?.resdata));
     },[dispatch])

     const onFlashPageSuccess=(res)=>{
      console.log(res)
      }
 useEffect(() => {
  if (!session?.data?.user?.token) return

  const socket = initSocket(session.data.user.token)

  let silenceTimer: NodeJS.Timeout

  const resync = () => {
    console.log('🔄 Resync Flash')
    dispatch(RST_FlashsAction())
  }

  // 🔌 CONNECT
  socket.on('connect', () => {
    console.log('✅ Socket connecté Flash')
    socket.emit('join_flash')
    resync()
  })

  // 📡 EVENTS
  socket.on('sent_new_flash', resync)
  socket.on('start_flash_backend', resync)

  // 🧪 SILENCE DETECTION
  const resetSilence = () => {
    clearTimeout(silenceTimer)
    silenceTimer = setTimeout(() => {
      console.warn('⚠ Socket silencieux → resync')
      resync()
    }, 30_000) // 30s
  }

  socket.onAny(resetSilence)
  resetSilence()

  // ❌ CLEANUP
  return () => {
    clearTimeout(silenceTimer)
    socket.off()
    closeSocket()
    console.log('❌ Socket arrêté Flash')
  }

}, [session?.data?.user?.token])


/*
     useEffect(() => {
      const socket = initSocket(session?.data?.user?.token);
      setSocket(socket)

      socket.on('connect', () => {
        console.log('Socket connecté', socket.id);
        socket.emit('message', { text: 'Bonjour depuis flash-backoffice' });
      });

      socket.on('start_flash_backend', (data) => {
        console.log('start_flash_backend:', data);
        dispatch(RST_FlashsAction());
      });

      socket.on('sent_new_flash', () => {
        //console.log('sent_new_flash:', data);
        dispatch(RST_FlashsAction());
      });


      return () => {
        socket.off('start_flash');
        socket.off('new_flash');
        //socket.disconnect();
        //setSocket(null);
      };
    }, [dispatch, session?.data?.user?.token]);
*/

      if(store?.data!=null){
        return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <TableHeader value={value} handleFilter={handleFilter} handleAddFlash={handleAddFlash} />
                    <DataGrid
                      autoHeight
                      rows={store && store.data}
                      columns={MyColumns({authuser:authuser})}
                      disableSelectionOnClick
                      rowsPerPageOptions={[5,10, 25, 50,75,100]}
                      rowCount={store.total}
                      pageSize={store.per_page}
                      page={store.current_page - 1}
                      paginationMode="server"
                      onPageChange={(newPage) => {
                        pgquery={...pgquery,page:newPage + 1,per_page:pageSize}
                        dispatch(RST_getSearchFlashsAction(sFlash.value,pgquery,onFlashPageSuccess))
                      }}
                      onPageSizeChange={(newPageSize) => {
                        setPageSize(newPageSize)
                        pgquery={...pgquery,page:1,per_page:newPageSize}
                        dispatch(RST_getSearchFlashsAction(sFlash.value,pgquery,onFlashPageSuccess))
                      }}

                    />
              </Card>
            </Grid>
        </Grid>
        )
      }else{
        return <ExpiredSessionDialog/>
      }



}

FlashList.acl = {
  action:UserAction.Read,
  subject: EntityAbility.BRANCH
}
FlashList.authGuard = true



export async function getServerSideProps(context: { req: any }) {
  const { req } = context;
  const session = await getSession({ req });
  if(!session){
    return {
      redirect: {
          destination: '/login',
          permanent: false,
      }
  };
  }

  try{

  const {token}=session?.user;
  const response = await fetch(`${process.env.PUBLIC_URL}/${process.env.ENTITYFLASH}`, {
    headers: {
      'x-user-claims': `${token}`,
    },
  });

  const res:any = await response.json();

  if(!res || res.errors){
    return {redirect: {
      destination: '/login',
      permanent: false,
     }}
   }

  return {
    props: {
      resdata:res,
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


export default FlashList


