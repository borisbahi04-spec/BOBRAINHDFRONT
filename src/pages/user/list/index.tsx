/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable newline-before-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useState, useEffect, MouseEvent, useCallback, useContext, useRef, useMemo } from 'react'

// ** Next Imports
import Link from 'next/link'
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
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
import { PAGE_SETTINGS } from 'src/definitions/constantes'


interface UserStatusType {
  [key: string]: ThemeColor
}


interface CellType {
  row: any
}



// ** renders client column






let sUser:any={value:''};
const UserList = (props: any) => {
  const dispatch = useDispatch<AppDispatch>()
  const ability = useContext(AbilityContext)
  const [value, setValue] = useState<string>('')
  const { settings, saveSettings } = useSettings()
  const { data: session } = useSession()
  let pgquery:any={page:1,per_page:25};

  const authUser = session?.user?.session
  const usersState = useSelector((state: RootState) => state.user.data)

  const searchRef = useRef<string>('')
  const paginationRef = useRef({ page: 1, per_page: 25 })

  const [pageSize, setPageSize] = useState(25)
  const [searchValue, setSearchValue] = useState('')

  // ----------------------------------------------------------------------
  // INIT
  // ----------------------------------------------------------------------

  useEffect(() => {
    if (!session) router.push('/login')
  }, [session])

  useEffect(() => {
    saveSettings({
      ...settings,
      iconPage: PAGE_SETTINGS.user.icon,
      titlePage: PAGE_SETTINGS.user.title
    })
  }, [])

  useEffect(() => {
    dispatch(getusers(props.resdata))
    dispatch(getbranchs(props.branchData))
    dispatch(getroles(props.roleData))
  }, [dispatch])

  // ----------------------------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------------------------



  const handleFilter = (val: any) => {
      setValue(val)
      sUser={...sUser,value:val}
      const onSuccess=()=>{
        //setIsLoading(false)
      }
       dispatch(RST_getSearchUsersAction(sUser.value,pgquery,onSuccess))
     }

  const handleStatusChange = useCallback(
    (userId: number, checked: boolean) => {
      if (authUser?.user?.id === userId) return

      dispatch(
        RST_UpdateUserAction(
          userId,
          { isActive: checked },
          () => dispatch(RST_UsersAction()),
          () => {}
        )
      )
    },
    [dispatch, authUser]
  )

  const handleAddUser = () => router.push('/user/add')

  // ----------------------------------------------------------------------
  // COLUMNS
  // ----------------------------------------------------------------------

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'username', headerName: 'Nom', flex: 0.2, minWidth: 150 },
      { field: 'email', headerName: 'Email', flex: 0.2, minWidth: 150 },
      { field: 'phoneNumber', headerName: 'Téléphone', flex: 0.2, minWidth: 150 },
      {
        field: 'branch',
        headerName: 'Succursale',
        flex: 0.2,
        renderCell: ({ row }) => row.branch?.displayName || '-'
      },
      {
        field: 'role',
        headerName: 'Rôle',
        flex: 0.2,
        renderCell: ({ row }) => row.role?.name || '-'
      },
       {
        field: 'department',
        headerName: 'Département',
        flex: 0.2,
        renderCell: ({ row }) => row.department?.displayName || '-'
      },
      {
        field: 'isActive',
        headerName: 'Statut',
        minWidth: 120,
        renderCell: ({ row }) =>
          authUser?.user?.id !== row.id && ability.can(UserAction.Edit, EntityAbility.USER) ? (
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={row.isActive}
                    onChange={e => handleStatusChange(row.id, e.target.checked)}
                  />
                }
                label=''
              />
            </FormGroup>
          ) : (
            '-'
          )
      },
      {
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        minWidth: 120,
        renderCell: ({ row }) =>
          ability.can(UserAction.Edit, EntityAbility.USER) &&
          authUser?.user?.id !== row.id && (
            <Tooltip title={`Éditer ${row.username}`}>
              <IconButton component={Link} href={`/user/edit/${row.id}`}>
                <Icon icon='mdi:pencil-outline' color='green' />
              </IconButton>
            </Tooltip>
          )
      }
    ],
    [ability, authUser, handleStatusChange]
  )

  // ----------------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------------

  if (!usersState?.data) return <ExpiredSessionDialog />

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            handleAddUser={handleAddUser}
          />

          <DataGrid
            autoHeight
            rows={usersState.data}
            columns={columns}
            pageSize={usersState.per_page}
            rowCount={usersState.total}
            paginationMode='server'
            rowsPerPageOptions={[10, 25, 50, 100]}
            onPageChange={page => {
              paginationRef.current.page = page + 1
              dispatch(
                RST_getSearchUsersAction(
                  searchRef.current,
                  paginationRef.current,
                  () => {}
                )
              )
            }}
            onPageSizeChange={size => {
              setPageSize(size)
              paginationRef.current = { page: 1, per_page: size }
              dispatch(
                RST_getSearchUsersAction(
                  searchRef.current,
                  paginationRef.current,
                  () => {}
                )
              )
            }}
          />
        </Card>
      </Grid>
    </Grid>
  )
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


