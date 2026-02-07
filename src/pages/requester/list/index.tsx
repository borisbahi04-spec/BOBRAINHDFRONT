
// ** React Imports
import { useState, useEffect, useContext, useMemo } from 'react'

// ** Next Imports

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/dist/client/router'

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
import { getSession } from 'next-auth/react'
import TableHeader from 'src/views/pages/requester/list/TableHeader'

import ExpiredSessionDialog from 'src/views/pages/confirmDialog/ExpiredSessionDialog'
import { EntityAbility, UserAction } from 'src/configs/Action'
import { useSettings } from 'src/@core/hooks/useSettings'
import { Autocomplete, CardContent, CardHeader, Chip,FormControl,InputLabel,MenuItem,Select,SelectChangeEvent,TextField,Tooltip, useMediaQuery, useTheme} from '@mui/material'
import Link from 'next/link'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import { getSearchrequestersAction, } from 'src/redux/actions/requester/requester-actions'
import { getrequesters } from 'src/redux/reducers/requester/requester-reducer'
import { enumStatus, PriorityEnum } from 'src/definitions/enum'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import { CustomInput, SESSIONEXPIRECODE } from 'src/myCustomFunctions'
import moment from 'moment'
import toast from 'react-hot-toast'
import { getstations } from 'src/redux/reducers/station/station-reducer'
import { getrequesttypes } from 'src/redux/reducers/requesttype/requesttype-reducer'
import { getSearchstationsAction } from 'src/redux/actions/station/station-actions'
import { getSearchrequesttypesAction } from 'src/redux/actions/requesttype/requesttype-actions'
import { RST_getSearchUsersAction } from 'src/redux/actions/Users/UserActions'
import { getusers } from 'src/redux/reducers/User/UserReducer'
import { PAGE_SETTINGS } from 'src/definitions/constantes'


const statusColorMap: Record<enumStatus,'default' | 'success' | 'warning' | 'error' | 'info'> = {
  [enumStatus.Open]: 'info',
  [enumStatus.Approved]: 'success',
  [enumStatus.Treated]: 'warning',
  [enumStatus.Closed]: 'success',
  [enumStatus.Cancelled]: 'default',
  [enumStatus.Rejected]: 'error'
}

const priorityColorMap: Record<PriorityEnum,'success' | 'warning' | 'error'> = {
  [PriorityEnum.Normal]: 'success',
  [PriorityEnum.Important]: 'warning',
  [PriorityEnum.Urgent]: 'error'
}


const useRequesterColumns = (ability: any): GridColDef[] => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return useMemo<GridColDef[]>(
    () => [
      {
        field: 'reference',
        headerName: 'Référence',
        flex: 0.3,
        renderCell: ({ row }) => <Typography noWrap>{row.reference}</Typography>
      },
      {
        field: 'date',
        headerName: 'Date',
        flex: 0.3,
        renderCell: ({ row }) => (
          <Typography noWrap variant="body2">
            {moment(row?.createdAt).locale('fr').format('DD/MM/YYYY HH:mm:ss')}
          </Typography>
        )
      },
      {
        field: 'status',
        headerName: 'Statut',
        flex: 0.2,
        renderCell: ({ row }) => {
          const status: enumStatus = row.status

          return (
            <Chip
              label={status}
              size={isMobile ? 'small' : 'medium'}
              color={statusColorMap[status] ?? 'default'}
              sx={{ fontWeight: 600 }}
            />
          )
        }
      },
      {
        field: 'requesttype',
        headerName: 'Type de demande',
        flex: 0.3,
        hide: isMobile,
        renderCell: ({ row }) => row.requesttype?.displayName ?? '-'
      },
      {
        field: 'createdBy',
        headerName: 'Demandeur',
        flex: 0.15,
        hide: isMobile,
        renderCell: ({ row }) => row.createdBy?.username ?? '-'
      },
      {
        field: 'title',
        headerName: 'Titre',
        flex: 0.25,
        hide: isMobile
      },
      {
        field: 'ticket',
        headerName: 'N° Ticket',
        flex: 0.2,
        renderCell: ({ row }) => row.ticket ?? '-'
      },
      {
        field: 'station',
        headerName: 'Station',
        flex: 0.2,
        hide: isMobile,
        renderCell: ({ row }) => row.station?.displayName ?? '-'
      },
      {
        field: 'priority',
        headerName: 'Priorité',
        flex: 0.15,
        renderCell: ({ row }) => {
          const priority: PriorityEnum = row.priority

return (
            <Chip
              label={priority}
              size={isMobile ? 'small' : 'medium'}
              color={priorityColorMap[priority]}
              sx={{ fontWeight: 600 }}
            />
          )
        }
      },
      {
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        flex: isMobile ? 0.4 : 0.25,
        renderCell: ({ row }) => (
          <>
            {ability.can(UserAction.Edit, EntityAbility.REQUESTER) &&
              row.status === enumStatus.Open && (
                <Tooltip title={`Modifier la demande ${row.reference}`}>
                  <IconButton
                    size="small"
                    component={Link}
                    href={`/requester/edit/${row.id}`}
                  >
                    <Icon icon="mdi:pencil-outline" color="green" />
                  </IconButton>
                </Tooltip>
              )}

            {ability.can(UserAction.Read, EntityAbility.REQUESTER) && (
              <Tooltip title="Détails">
                <IconButton
                  size="small"
                  component={Link}
                  href={`/requester/preview/${row.id}`}
                >
                  <Icon icon="mdi:details" color="blue" fontSize={20} />
                </IconButton>
              </Tooltip>
            )}
          </>
        )
      }
    ],
    [ability, isMobile]
  )
}





let sRequester:any={value:'',stationId:'',createdById:'',requesttypeId:'',priority:'',status:''};
const List = ({ resdata, requesttypeData,stationData,userData }: any) => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const ability = useContext(AbilityContext)
  const { saveSettings, settings } = useSettings()
  const [endDateRange, setEndDateRange] = useState<DateType>(null)
  const [startDateRange, setStartDateRange] = useState<DateType>(null)
  const [dates, setDates] = useState<Date[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const columns = useRequesterColumns(ability)
  const pgquery:any={page:1,per_page:25};
  const store = useSelector((state: RootState) => state?.requester?.data)
  const stations = useSelector((state: RootState) => state?.station?.data)
  const requesttypes = useSelector((state: RootState) => state?.requesttype?.data)
  const users = useSelector((state: RootState) => state?.user?.data)

  const authuser = useSelector((state: RootState) => state.auth.getuserprofile)
  const auth=authuser?.session;

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))

  useEffect(() => {
  saveSettings({
    ...settings,
    iconPage: PAGE_SETTINGS.requester.icon,
    titlePage: PAGE_SETTINGS.requester.title,
  })
}, [])



  const _onError=(res:any)=>{
    const {errors}=res;
    if(res.code==SESSIONEXPIRECODE){
      expireSession(res.code);
    }else{
    toast.error(`${res.message}`,{position:'top-center'})
  }
}

    const handleOnChangeRange = (dates: any) => {
      const [start, end] = dates
      const onSuccess=()=>{console.log('i')}
      if (start !== null && end !== null) {
        setDates(dates)
        dates?sRequester={...sRequester,startdate:dates[0]? moment(dates[0]).format("YYYY-MM-DD"):'',enddate:dates[1]?moment(dates[1]).format("YYYY-MM-DD"):''}:sRequester={...sRequester,startdate:'',enddate:''}
        dispatch(getSearchrequestersAction(sRequester,pgquery,onSuccess,_onError))
      }
      setStartDateRange(start)
      setEndDateRange(end)
      dates?sRequester={...sRequester,startdate:start? moment(start).format("YYYY-MM-DD"):'',enddate:end?moment(end).format("YYYY-MM-DD"):''}:sRequester={...sRequester,startdate:'',enddate:''}
      dispatch(getSearchrequestersAction(sRequester,pgquery,onSuccess,_onError))
    }
 const handleStatusValue = (e: SelectChangeEvent) => {
  sRequester={...sRequester,status:e.target.value}
    const onSuccess=()=>{
      console.log('')
    }
    dispatch(getSearchrequestersAction(sRequester,{page:pgquery.page,per_page:100},onSuccess))
  }

  const handlePriorityValue = (e: SelectChangeEvent) => {
  sRequester={...sRequester,priority:e.target.value}
    const onSuccess=()=>{
      console.log('')
    }
    dispatch(getSearchrequestersAction(sRequester,{page:pgquery.page,per_page:100},onSuccess))
  }


  const handleStationValue = (e: SelectChangeEvent,values:any) => {
      sRequester={...sRequester,stationId:values?.id??''}
        const onSuccess=()=>{console.log('iattributeName')}
        dispatch(getSearchrequestersAction(sRequester,pgquery,onSuccess,_onError))
      }

  const handleRequesterTypeValue = (e: SelectChangeEvent,values:any) => {
    sRequester={...sRequester,requesttypeId:values?.id??''}
      const onSuccess=()=>{console.log('iattributeName')}
      dispatch(getSearchrequestersAction(sRequester,pgquery,onSuccess,_onError))
    }




  const handleCreatedByValue = (e: SelectChangeEvent,values:any) => {
    sRequester={...sRequester,createdById:values?.id??''}
      const onSuccess=()=>{console.log('iattributeName')}
      dispatch(getSearchrequestersAction(sRequester,pgquery,onSuccess,_onError))
    }


  const handleFilter = (val: any) => {
    setSearch(val)
    sRequester={...sRequester,value:val}
    const onSuccess=(res)=>{
      console.log('ggg2022222',res)
    }
     dispatch(getSearchrequestersAction(sRequester,pgquery,onSuccess))
   }


  useEffect(() => {
    dispatch(getrequesters(resdata))
    dispatch(getstations(stationData))
    dispatch(getrequesttypes(requesttypeData))
    dispatch(getusers(userData))




  }, [dispatch, resdata,])

  const fetchData = (params = {}) => {
    dispatch(
      getSearchrequestersAction(search, {
        page,
        per_page: pageSize,
        ...params
      })
    )
  }

    // Ajuster minWidth selon l'écran
  let minWidth = 1200 // desktop par défaut
  if (isTablet) minWidth = 900
  if (isMobile) minWidth = 700

    if(store?.data!=null){
      return (
          <>
                <DatePickerWrapper>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Card>
                        <CardHeader title='Filtres'/>
                        <CardContent>
                          <Grid container spacing={6}>
                            <Grid item xs={12} sm={4}>
                                <DatePicker
                                  isClearable
                                  selectsRange
                                  monthsShown={2}
                                  endDate={endDateRange}
                                  selected={startDateRange}
                                  startDate={startDateRange}
                                  shouldCloseOnSelect={true}
                                  id='date-range-picker-months'
                                  onChange={handleOnChangeRange}
                                  customInput={
                                    <CustomInput
                                      dates={dates}
                                      setDates={setDates}
                                      label='Période'
                                      end={endDateRange as number | Date}
                                      start={startDateRange as number | Date}
                                    />
                                  }
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <FormControl fullWidth>
                                <InputLabel >Statut</InputLabel>
                                <Select
                                  fullWidth
                                  sx={{ mr: 4, mb: 2 }}
                                  label='Status'

                                  onChange={handleStatusValue}
                                  labelId='att'>
                                  <MenuItem value=''>Tous les statuts</MenuItem>
                                  <MenuItem value={enumStatus.Approved} >{enumStatus.Approved}</MenuItem>
                                  <MenuItem value={enumStatus.Cancelled} >{enumStatus.Cancelled}</MenuItem>
                                  <MenuItem value={enumStatus.Closed} >{enumStatus.Closed}</MenuItem>
                                  <MenuItem value={enumStatus.Open} >{enumStatus.Open}</MenuItem>
                                  <MenuItem value={enumStatus.Rejected} >{enumStatus.Rejected}</MenuItem>
                                  <MenuItem value={enumStatus.Treated} >{enumStatus.Treated}</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                              <Autocomplete
                                id="requesttype"
                                options={requesttypes?.data??[]}
                                autoHighlight
                                onChange={handleRequesterTypeValue}
                                getOptionLabel={(option) => `${option?.displayName??''}`}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Type de demande"
                                    inputProps={{
                                      ...params.inputProps,
                                      autoComplete: '', // disable autocomplete and autofill
                                    }}
                                  />
                                )}
                                onInputChange={(event, newInputValue) => {
                                  dispatch(getSearchrequesttypesAction(newInputValue,pgquery))
                                }}
                              />
                            </Grid>
                            {!auth?.role?.isForOperator &&
                              <>
                                <Grid item xs={12} sm={4}>
                                  <Autocomplete
                                    id="stations"
                                    options={stations?.data??[]}
                                    autoHighlight
                                    onChange={handleStationValue}
                                    getOptionLabel={(option) => `${option?.displayName??''}`}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Station"
                                        inputProps={{
                                          ...params.inputProps,
                                          autoComplete: '', // disable autocomplete and autofill
                                        }}
                                      />
                                    )}
                                    onInputChange={(event, newInputValue) => {
                                      dispatch(getSearchstationsAction(newInputValue,pgquery))
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <Autocomplete
                                    id="users"
                                    options={users?.data??[]}
                                    autoHighlight
                                    onChange={handleCreatedByValue}
                                    getOptionLabel={(option) => `${option?.username??''}`}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Demandeur"
                                        inputProps={{
                                          ...params.inputProps,
                                          autoComplete: '', // disable autocomplete and autofill
                                        }}
                                      />
                                    )}
                                    onInputChange={(event, newInputValue) => {
                                      dispatch(RST_getSearchUsersAction(newInputValue,pgquery))
                                    }}
                                  />
                                </Grid>
                              </>
                              }
                            <Grid item xs={12} sm={4}>
                              <FormControl fullWidth>
                                <InputLabel >Priorité</InputLabel>
                                <Select
                                  fullWidth
                                  sx={{ mr: 4, mb: 2 }}
                                  label='Priority'

                                  onChange={handlePriorityValue}
                                  labelId='att'>
                                  <MenuItem value=''>Toutes les priorités</MenuItem>
                                  <MenuItem value={PriorityEnum.Important} >{PriorityEnum.Important}</MenuItem>
                                  <MenuItem value={PriorityEnum.Normal} >{PriorityEnum.Normal}</MenuItem>
                                  <MenuItem value={PriorityEnum.Urgent} >{PriorityEnum.Urgent}</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12}>
                      <Card>
                        <TableHeader
                          value={search}
                          handleFilter={handleFilter}
                          handleAddrequester={() => router.push('/requester/add')}
                        />

                       <div style={{ width: '100%', overflowX: 'auto' }}>
                          <DataGrid
                            autoHeight
                            rows={store?.data || []}
                            columns={columns}
                            page={store.current_page - 1}
                            pageSize={pageSize}
                            rowCount={store.total}
                            paginationMode="server"
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            onPageChange={(newPage) => {
                              setPage(newPage + 1)
                              fetchData({ page: newPage + 1 })
                            }}
                            onPageSizeChange={(size) => {
                              setPageSize(size)
                              setPage(1)
                              fetchData({ page: 1, per_page: size })
                            }}
                            sx={{
                              minWidth: 800, // assure que le DataGrid dépasse la largeur mobile
                              '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
                                whiteSpace: 'nowrap', // texte sur une seule ligne
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              },
                            }}
                          />
                       </div>

                      </Card>
                    </Grid>
                  </Grid>
                </DatePickerWrapper>
          </>
      )
   }else{
      return <ExpiredSessionDialog/>
    }
}



List.acl = {
  action:UserAction.Read,
  subject:EntityAbility.REQUESTER
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

const response = await fetch(`${process.env.PUBLIC_URL}/${process.env.ENTITYREQUESTER}`,{
  headers: {
    'x-user-claims': `${token}`,
  },
});

const requesttyperesponse = await fetch(`${process.env.PUBLIC_URL}/${process.env.ENTITYREQUESTTYPE}`,{
  headers: {
    'x-user-claims': `${token}`,
  },
});

const stationresponse = await fetch(`${process.env.PUBLIC_URL}/${process.env.ENTITYSTATION}`,{
  headers: {
    'x-user-claims': `${token}`,
  },
});

const userresponse = await fetch(`${process.env.PUBLIC_URL}/${process.env.ENTITYUSER}`,{
  headers: {
    'x-user-claims': `${token}`,
  },
});

const res:any = await response.json();
const requesttyperes:any = await requesttyperesponse.json();
const stationres:any = await stationresponse.json();
const userres:any = await userresponse.json();



if(!res || res.errors){
  return {redirect: {
    destination: '/login',
    permanent: false,
    }}
}

if(!requesttyperes || requesttyperes.errors){
  return {redirect: {
    destination: '/login',
    permanent: false,
    }}
}

if(!stationres || stationres.errors){
  return {redirect: {
    destination: '/login',
    permanent: false,
    }}
}

if(!userresponse || userresponse.errors){
  return {redirect: {
    destination: '/login',
    permanent: false,
    }}
}



return {
  props: {
    resdata:res,
    requesttypeData:requesttyperes,
    stationData:stationres,
    userData:userres

  }
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


