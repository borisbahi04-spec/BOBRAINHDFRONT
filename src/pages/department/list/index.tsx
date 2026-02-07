
// ** React Imports
import { useState, useEffect, useContext } from 'react'

// ** Next Imports

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'
import router from 'next/dist/client/router'

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
import TableHeader from 'src/views/pages/department/list/TableHeader'

import { getbranchs } from 'src/redux/reducers/Branch/BranchReducer'
import ExpiredSessionDialog from 'src/views/pages/confirmDialog/ExpiredSessionDialog'
import { EntityAbility, UserAction } from 'src/configs/Action'
import { useSettings } from 'src/@core/hooks/useSettings'
import { Box ,Tooltip} from '@mui/material'
import Link from 'next/link'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import { getSearchdepartmentsAction, departmentsAction, updatedepartmentAction, } from 'src/redux/actions/department/department-actions'
import { getdepartments } from 'src/redux/reducers/department/department-reducer'




interface CellType {
  row: any
}



// ** renders client column




const MyColumns=(props:any)=>{
  const {ability}=props;

return [
    {
      flex: 0.2,
      minWidth: 250,
      field: 'displayName',
      headerName: 'Libelle',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.displayName}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 250,
      field: 'description',
      headerName: 'Description',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
            {row.description?row.description:'-'}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 150,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {ability.can(UserAction.Edit, EntityAbility.ROLE) && (
              <Tooltip title={`Editer ${row.displayName}`}>
                <IconButton size='small' component={Link} href={ `/department/edit/${row.id}`}>
                  <Icon icon='mdi:pencil-outline' color="green" fontSize={20} />
                </IconButton>
              </Tooltip>
          )}
        </Box>
      )
    }
  ]
}


let sdepartment:any={value:''};
const List = (props:any) => {
  //branchData
  // ** State
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(25)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [department, setdepartment] = useState<any>(props?.data)
  const { settings, saveSettings } = useSettings()
  const ability = useContext(AbilityContext)


 const session = useSession();
  const authuser=session?.data?.user?.session;


  // ** Hooks
   const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state?.department?.data)
  let pgquery:any={page:1,per_page:25};

  const handleFilter = (val: any) => {
    setValue(val)
    sdepartment={...sdepartment,value:val}
    const onSuccess=()=>{
      //setIsLoading(false)
    }
     dispatch(getSearchdepartmentsAction(sdepartment.value,pgquery,onSuccess))
   }

  const {branchData}=props;



  const handleAdddepartment = ()=> {
      router.push(`/department/add`);
  }

  const handlehasStatusChange = (roleId,event: React.ChangeEvent<HTMLInputElement>)=> {
    const onSuccess=()=>{
      dispatch(departmentsAction())
    }
    const onError=()=>{
      console.log('erreur')
    }
    if(authuser.role.id!=roleId){
      dispatch(updatedepartmentAction(roleId,{isActive:event.target.checked},onSuccess,onError))
    }
  }




  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session]);

  useEffect(() => {
     saveSettings({
    ...settings,
    iconPage: 'mdi:domain',
    titlePage: 'Départements',
  })
  },[])

   useEffect(() => {
        dispatch(getdepartments(props?.resdata));
        dispatch(getbranchs(branchData))
     },[branchData, dispatch, props?.resdata])

     const ondepartmentPageSuccess=(res)=>{
      console.log(res)
      }


      if(store?.data!=null){
        return (
        <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} handleFilter={handleFilter} handleAdddepartment={handleAdddepartment} />
            <DataGrid
            autoHeight
            rows={store && store.data}
            columns={MyColumns({setIsEditMode:setIsEditMode,setdepartment:setdepartment,handlehasStatusChange:handlehasStatusChange,authuser:authuser,ability:ability})}
            disableSelectionOnClick
            rowsPerPageOptions={[5,10, 25, 50,75,100]}
            rowCount={store.total}
            pageSize={store.per_page}
            page={store.current_page - 1}
            paginationMode="server"
            onPageChange={(newPage) => {
              pgquery={...pgquery,page:newPage + 1,per_page:pageSize}
              dispatch(getSearchdepartmentsAction(sdepartment.value,pgquery,ondepartmentPageSuccess))
            }}

            onPageSizeChange={(newPageSize) => {
              setPageSize(newPageSize)
              pgquery={...pgquery,page:1,per_page:newPageSize}
              dispatch(getSearchdepartmentsAction(sdepartment.value,pgquery,ondepartmentPageSuccess))
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



List.acl = {
  action:UserAction.Read,
  subject:EntityAbility.DEPARTMENT
}

List.authGuard = true


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

const response = await fetch(`${process.env.PUBLIC_URL}/${process.env.ENTITYDEPARTMENT}`,{
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
  props: {resdata:res},
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


export default List


