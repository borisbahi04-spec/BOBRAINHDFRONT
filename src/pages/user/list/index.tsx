/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable newline-before-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useState, useEffect, MouseEvent, useCallback, useContext, useRef } from 'react'

// ** Next Imports
import Link from 'next/link'
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports

// ** Third Party Components
import axios from 'axios'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { CardStatsHorizontalProps } from 'src/@core/components/card-statistics/types'

// ** Custom Table Components Imports
import { AppDispatch,  RootState, store,   } from 'src/redux/store'
import toast from 'react-hot-toast'

import { AbilityContext } from 'src/layouts/components/acl/Can'
import { getSession, useSession } from 'next-auth/react'
import { RST_DeleteUserAction, RST_getSearchUsersAction, RST_UpdateUserAction, RST_UsersAction } from 'src/redux/actions/Users/UserActions'
import { getusers } from 'src/redux/reducers/User/UserReducer'
import TableHeader from 'src/views/pages/user/list/TableHeader'

//import AddUserDrawer from 'src/views/pages/user/list/AddUserDrawer'
import { RST_RolesAction } from 'src/redux/actions/Roles/RoleActions'
import { t } from 'i18next'
import { SessionAction } from 'src/redux/actions/Auth/AuthActions'
import router from 'next/dist/client/router'
import { getbranchs } from 'src/redux/reducers/Branch/BranchReducer'
import { getroles } from 'src/redux/reducers/Role/RoleReducer'
import ExpiredSessionDialog from 'src/views/pages/confirmDialog/ExpiredSessionDialog'
import { EntityAbility, UserAction } from 'src/configs/Action'
import { FormControlLabel, FormGroup, Switch, Tooltip } from '@mui/material'
import { useSettings } from 'src/@core/hooks/useSettings'
import PinModal from 'src/modals/user/PinModal'


interface UserStatusType {
  [key: string]: ThemeColor
}


interface CellType {
  row: any
}



// ** renders client column




const MyColumns=(props:any)=>{
    const {handlehasStatusChange,authuser,ability}=props;

    return [
      {
        flex: 0.2,
        minWidth: 150,
        field: 'username',
        headerName: 'Nom',
        renderCell: ({ row }: CellType) => {
          return (
            <Typography noWrap variant='body2'>
              {row.username}
            </Typography>
          )
        }
      },
      {
        flex: 0.2,
        minWidth: 150,
        field: 'email',
        headerName: 'Email',
        renderCell: ({ row }: CellType) => {
          return (
            <Typography noWrap variant='body2'>
              {row.email?row.email:'-'}
            </Typography>
          )
        }
      },
      {
        flex: 0.2,
        minWidth: 150,
        field: 'phoneNumber',
        headerName: 'Téléphone',
        renderCell: ({ row }: CellType) => {
          return (
            <Typography noWrap variant='body2'>
              {row.phoneNumber?row.phoneNumber:'-'}
            </Typography>
          )
        }
      },
      {
        flex: 0.2,
        minWidth: 150,
        field: 'branch',
        headerName: 'Surccusale',
        renderCell: ({ row }: CellType) => {
          return (
            <Typography noWrap variant='body2'>
              {row.branch?row.branch?.displayName:'-'}
            </Typography>
          )
        }
      },
      {
        flex: 0.2,
        minWidth: 100,
        field: 'roleId',
        headerName: 'Role',
        renderCell: ({ row }: CellType) => {
          return (
            <Typography noWrap variant='body2'>
              {row.role?row.role.name:'-'}
            </Typography>
          )
        }
      },
      {
        flex: 0.2,
        minWidth: 100,
        field: 'isActive',
        headerName: 'Statut',
        renderCell: ({ row }: any) => {
             return(
              authuser.user.id!=row.id?
              <FormGroup>
                 { ability.can(UserAction.Edit, EntityAbility.USER) && (
                  <FormControlLabel  control={
                  <Switch
                  name="hasStatus"
                  size="medium"
                  checked={row.isActive}
                  onChange={(e:event)=>handlehasStatusChange(row.id,e)}
                  inputProps={{ 'aria-label': 'controlled' }}
                  />}/>
                 )}
              </FormGroup>:'-'

              )

        }
      },
      {
        flex: 0.1,
        minWidth: 150,
        sortable: false,
        field: 'actions',
        headerName: 'Actions',
        renderCell: ({ row }: CellType) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {  ability.can(UserAction.Edit, EntityAbility.USER) && (
               authuser?.user?.id==row.id? "":
                <Tooltip title={`Editer ${row.username}`}>
                  <IconButton size='small' component={Link} href={ `/user/edit/${row.id}`}>
                    <Icon icon='mdi:pencil-outline' color="green" fontSize={20} />
                  </IconButton>
                </Tooltip>
                )
            }
          </Box>
        )
      }
    ]
}


let sUser:any={value:''};
const UserList = (props:any) => {
  //branchData
  // ** State
  const [plan, setPlan] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(25)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [user, setUser] = useState<any>(props?.data)
  const { settings, saveSettings } = useSettings()
  const ability = useContext(AbilityContext)


  const session = useSession();
  const authuser=session?.data?.user?.session;

  // ** Hooks
   const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state?.user?.data)
  let pgquery:any={page:1,per_page:25};




  const handleFilter = (val: any) => {
    setValue(val)
    sUser={...sUser,value:val}
    const onSuccess=(res)=>{
      //setIsLoading(false)
    }
    console.log('oioioioioio',sUser)
     dispatch(RST_getSearchUsersAction(sUser,pgquery,onSuccess))
   }

  const {branchData,roleData}=props;



  const handleAddUser = ()=> {
    const {data}=store;
      router.push(`/user/add`);

  }

  const handlehasStatusChange = (userId,event: React.ChangeEvent<HTMLInputElement>)=> {
    const onSuccess=()=>{
      dispatch(RST_UsersAction())
    }
    const onError=()=>{
      console.log('erreur')
    }
    if(authuser.user.id!=userId){
      dispatch(RST_UpdateUserAction(userId,{isActive:event.target.checked},onSuccess,onError))
    }
  }




  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  useEffect(() => {
        saveSettings({ ...settings,
            iconPage:'mdi:account-group',
            titlePage: 'LISTE UTILISATEURS'
           })
  },[])

   useEffect(() => {
        dispatch(getusers(props?.resdata));
        dispatch(getbranchs(branchData))
        dispatch(getroles(roleData))
     },[dispatch])

     const onUserPageSuccess=(res)=>{
      console.log(res)
      }


      if(store?.data!=null){
        return (
        <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} handleFilter={handleFilter} handleAddUser={handleAddUser} />
              <DataGrid
                autoHeight
                rows={store && store.data}
                columns={MyColumns({setIsEditMode:setIsEditMode,setUser:setUser,handlehasStatusChange:handlehasStatusChange,authuser:authuser,ability:ability})}
                disableSelectionOnClick
                rowsPerPageOptions={[5,10, 25, 50,75,100]}
                rowCount={store.total}
                pageSize={store.per_page}
                page={store.current_page - 1}
                paginationMode="server"
                onPageChange={(newPage) => {
                  pgquery={...pgquery,page:newPage + 1,per_page:pageSize}
                  dispatch(RST_getSearchUsersAction(sUser.value,pgquery,onUserPageSuccess))
                }}
                onPageSizeChange={(newPageSize) => {
                  setPageSize(newPageSize)
                  pgquery={...pgquery,page:1,per_page:newPageSize}
                  dispatch(RST_getSearchUsersAction(sUser.value,pgquery,onUserPageSuccess))
                }}

              />
        </Card>
      </Grid>

      {/*addUserOpen?
      <AddUserDrawer  open={addUserOpen} toggle={toggleAddUserDrawer} isEditMode={isEditMode} setIsEditMode={setIsEditMode} row={isEditMode?user:''} setUser={setUser}/>
      :''*/}
        </Grid>
        )
      }else{
        return <ExpiredSessionDialog/>
      }



}

UserList.acl = {
  action:UserAction.Read,
  subject: EntityAbility.USER
}
UserList.authGuard = true



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
  const response = await fetch(`${process.env.PUBLIC_URL}/user`,{
    headers: {
      'x-user-claims': `${token}`,
    },
  });
  const branchresponse = await fetch(`${process.env.PUBLIC_URL}/branch`,{
    headers: {
      'x-user-claims': `${token}`,
    },
  });

  const roleresponse = await fetch(`${process.env.PUBLIC_URL}/role`,{
    headers: {
      'x-user-claims': `${token}`,
    },
  });

  const res:any = await response.json();
  const branchresp:any = await branchresponse.json();
  const roleresp:any = await roleresponse.json();

  if(!res || res.errors){
    return {redirect: {
      destination: '/login',
      permanent: false,
     }}
   }

   if(!branchresp || branchresp.errors){
    return {redirect: {
      destination: '/login',
      permanent: false,
       }
     }
  }

  if(!roleresp || roleresp.errors){
    return {redirect: {
      destination: '/login',
      permanent: false,
       }
     }
  }

  return {
    props: {
      resdata:res,
      branchData:branchresp.data,
      roleData:roleresp.data,

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


export default UserList


