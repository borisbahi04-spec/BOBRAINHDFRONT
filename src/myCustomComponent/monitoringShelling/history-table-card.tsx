
// ** React Imports
import { useState, useContext } from 'react'

// ** Next Imports

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'

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
import { useSession } from 'next-auth/react'

import router from 'next/dist/client/router'
import ExpiredSessionDialog from 'src/views/pages/confirmDialog/ExpiredSessionDialog'
import { EntityAbility, UserAction } from 'src/configs/Action'
import { useSettings } from 'src/@core/hooks/useSettings'
import { shellingByIdAction } from 'src/redux/actions/shelling/shelling-actions'
import moment from 'moment'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { InfoCard } from './info-card'




interface CellType {
  row: any
}



// ** renders client column




const MyColumns=(props:any)=>{
  const {ability,handleHumididityCoolingClick}=props;

return [
  {
    width: 180,
    field: 'date',
    headerName: 'Date',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>
              {`${moment(row?.date).locale('fr').format('DD/MM/YYYY HH:mm')}`}
          </Typography>
        )
      }
    },
    {
      width: 180,
      field: 'destinationBranchId',
      headerName: 'Surccusale',
        renderCell: ({ row }: CellType) => {
          return (
            <Typography noWrap variant='body2'>
                {row?.destinationBranch?.displayName}
            </Typography>
          )
        }
      },
      {
        width: 150,
        field: 'level',
        headerName: 'Level',
          renderCell: ({ row }: CellType) => {
            return (
              <Typography noWrap variant='body2'>
                  {row?.level}
              </Typography>
            )
          }
        },
        {
          width: 250,
          field: 'type',
          headerName: 'Type',
            renderCell: ({ row }: CellType) => {
              return (
                <Typography noWrap variant='body2'>
                    {row?.type}
                </Typography>
              )
            }
      },
      {
        width: 300,
        field: 'message',
        headerName: 'Message',
          renderCell: ({ row }: CellType) => {
            const {message}=row;

            return (
              <InfoCard
              title=""
              metrics={[
                message?.branch ? `Succursale : ${message?.branch} | ` : '',
                message?.lotnumber ? `Lot : ${message?.lotnumber} |` : '',
                message?.stacknumber ? `Stack : ${message?.stacknumber} | ` : '',
                message?.shift ? `Shift : ${message?.shift} |` : '',
                message?.machineline ? `Ligne : ${message?.machineline ?? '-'} | Machine : ${message?.machine ?? '-'} | ` : '',
                message?.kwhs ? `kwhs : ${message?.kwhs} | kpcs : ${message?.kpcs} | ` : '',
                message?.unscpcs ? `unscpcs : ${message?.unscpcs} | unscwhs : ${message?.unscwhs} | ` : '',
                message?.shelled ? `shelled : ${message?.shelled} | uncut : ${message?.uncut} | ` : '',
                message?.backcut ? `backcut : ${message?.backcut} | tipcup : ${message?.tipcup} | ` : '',
                message?.moisturercn ? `moisture : ${message?.moisturercn} | ` : '-',
                message?.x ? ` ${message?.x}` : '-',
              ]}
              statusColor="green"
            />
            )
          }
        },
      ]
}


const sShelling:any={value:'',sizeId:'',equipmentId:'',stackId:''};
const HistoryTable = (props:any) => {
  const {rows}=props;

  // ** State
  const [value, setValue] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [detailshelling, setDetailShelling] = useState<any>()

  const { settings, saveSettings } = useSettings()
  const ability = useContext(AbilityContext)
  const {branchData,shiftData,stackData,userData,operatorData,lotData}=props;
  const [endDateRange, setEndDateRange] = useState<DateType>(null)
  const [startDateRange, setStartDateRange] = useState<DateType>(null)
  const [dates, setDates] = useState<Date[]>([])


  const session = useSession();
  const authuser=session?.data?.user?.session;

  // ** Hooks
   const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state?.shelling?.data)
  const pgquery:any={page:1,per_page:25};
  const stacks = useSelector((state: RootState) => state?.stack?.data)

  //const operators = useSelector((state: RootState) => state?.operator?.data)
  const users = useSelector((state: RootState) => state?.user?.data)

  const lots = useSelector((state: RootState) => state?.lot?.data)

/*
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
        dates?sShelling={...sShelling,startdate:dates[0]? moment(dates[0]).format("YYYY-MM-DD"):'',enddate:dates[1]?moment(dates[1]).format("YYYY-MM-DD"):''}:sShelling={...sShelling,startdate:'',enddate:''}
        dispatch(getsearchshellingsAction(sShelling,pgquery,onSuccess,_onError))
      }
      setStartDateRange(start)
      setEndDateRange(end)
      dates?sShelling={...sShelling,startdate:start? moment(start).format("YYYY-MM-DD"):'',enddate:end?moment(end).format("YYYY-MM-DD"):''}:sShelling={...sShelling,startdate:'',enddate:''}
      dispatch(getsearchshellingsAction(sShelling,pgquery,onSuccess,_onError))
    }

  const handleFilter = (val: any) => {
    setValue(val)
    sShelling={...sShelling,value:val}
    const onSuccess=()=>{
      console.log('ggg')
    }
     dispatch(getsearchshellingsAction(sShelling,pgquery,onSuccess))
   }


    const handleBranchValue = (e: SelectChangeEvent) => {
       sShelling={...sShelling,destinationBranchId:e.target.value}
       const onSuccess=()=>{
         console.log('')
       }
       dispatch(getsearchshellingsAction(sShelling,{page:pgquery.page,per_page:100},onSuccess))
     }


      const handleStackValue = (e: SelectChangeEvent,values:any) => {
        sShelling={...sShelling,stackId:values?.id??''}
          const onSuccess=()=>{console.log('iattributeName')}
          dispatch(getsearchshellingsAction(sShelling,pgquery,onSuccess,_onError))
        }

    const handleOperatorValue = (e: SelectChangeEvent,values:any) => {
      sShelling={...sShelling,userId:values?.id??''}
        const onSuccess=()=>{console.log('iattributeName')}
        dispatch(getsearchshellingsAction(sShelling,pgquery,onSuccess,_onError))
      }

      const handleLotValue = (e: SelectChangeEvent,values:any) => {
        sShelling={...sShelling,lotId:values?.id??''}
          const onSuccess=()=>{console.log('iattributeName')}
          dispatch(getsearchshellingsAction(sShelling,pgquery,onSuccess,_onError))
        }

    const handleShiftValue = (e: SelectChangeEvent) => {
      sShelling={...sShelling,shiftId:e.target.value}
      const onSuccess=()=>{
        console.log('')
      }
      dispatch(getsearchshellingsAction(sShelling,{page:pgquery.page,per_page:100},onSuccess))
    }

 const handleStatusValue = (e: SelectChangeEvent) => {
  sShelling={...sShelling,status:e.target.value}
    const onSuccess=()=>{
      console.log('')
    }
    dispatch(getsearchshellingsAction(sShelling,{page:pgquery.page,per_page:100},onSuccess))
  }


   useEffect(() => {
        dispatch(getshellings(props?.resdata));
     },[dispatch])

   useEffect(() => {
          dispatch(getsearchstacks(stackData));
          dispatch(getsearchusers(userData));
          dispatch(getsearchoperators(operatorData));
          dispatch(getsearchlots(lotData));
  },[dispatch])
*/
  const onShellingPageSuccess=(res)=>{
  console.log(res)
  }


   const handleCellDoubleClick = (params) => {
      const {row}=params;
      router.push(`/shelling/preview/${row.id}`);
    };

    const handleHumididityCoolingClick = (data) => {
      setQaShelling(true)
      const onSuccess=(res)=>{
        console.log('uyuyuyuo66565',res)
        setDetailShelling(res)
      }
      dispatch(shellingByIdAction(data.id,onSuccess))
    };

      if(rows?.data!=null){
        return (
            <DatePickerWrapper>
              <Grid container spacing={2}>
              {/*<Grid item xs={12}>
                <Card>
                  <CardHeader title='Filtrer'/>
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
                                  label='Par Date'
                                  end={endDateRange as number | Date}
                                  start={startDateRange as number | Date}
                                />
                              }
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FormControl fullWidth>
                            <InputLabel >Par Statut</InputLabel>
                            <Select
                              fullWidth
                              sx={{ mr: 4, mb: 2 }}
                              label='Statut'

                              onChange={handleStatusValue}
                              labelId='att'>
                              <MenuItem value=''>Tous les status</MenuItem>
                              <MenuItem value={ShellingStatusEnum.pending} >{ShellingStatusEnum.pending}</MenuItem>
                              <MenuItem value={ShellingStatusEnum.closed} >{ShellingStatusEnum.closed}</MenuItem>
                              <MenuItem value={ShellingStatusEnum.canceled} >{ShellingStatusEnum.canceled}</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FormControl fullWidth>
                            <InputLabel id=''>Par surccusale</InputLabel>
                            <Select
                              fullWidth
                              sx={{ mr: 4, mb: 2 }}
                              label='Surccusale'

                              onChange={handleBranchValue}
                              labelId='Type-select'
                            >
                              <MenuItem value=''>Toutes les surccursales</MenuItem>
                              {
                                branchData && branchData?.map((item:any,index:number)=>{
                                  return <MenuItem value={item.id} key={index}>{item.displayName}</MenuItem>
                                })
                              }
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <Autocomplete
                            id="stack"
                            options={stacks?.data??[]}
                            autoHighlight
                            onChange={handleStackValue}
                            getOptionLabel={(option) => `${option?.displayName??''}`}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Par Stack"
                                inputProps={{
                                  ...params.inputProps,
                                  autoComplete: '', // disable autocomplete and autofill
                                }}
                              />
                            )}
                            onInputChange={(event, newInputValue) => {
                              dispatch(getsearchstacksAction(newInputValue,pgquery))
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <FormControl fullWidth>
                            <InputLabel id=''>Par Shift</InputLabel>
                            <Select
                              fullWidth
                              sx={{ mr: 4, mb: 2 }}
                              label='Shift'

                              onChange={handleShiftValue}
                              labelId='Type-select'
                            >
                              <MenuItem value=''>Tous les Shifts</MenuItem>
                              {
                                shiftData && shiftData?.map((item:any,index:number)=>{
                                  return <MenuItem value={item.id} key={index}>{item.value}</MenuItem>
                                })
                              }
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Autocomplete
                            id="user"
                            options={users?.data??[]}
                            autoHighlight
                            onChange={handleOperatorValue}
                            getOptionLabel={(option) => `${option?.username??''}`}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Par Superviseur"
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
                        <Grid item xs={12} sm={3}>
                          <Autocomplete
                            id="lot"
                            options={lots?.data??[]}
                            autoHighlight
                            onChange={handleLotValue}
                            getOptionLabel={(option) => `${option?.displayName??''}`}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Par lot"
                                inputProps={{
                                  ...params.inputProps,
                                  autoComplete: '', // disable autocomplete and autofill
                                }}
                              />
                            )}
                            onInputChange={(event, newInputValue) => {
                              dispatch(getsearchlotsAction(newInputValue,pgquery))
                            }}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>*/}
                <Grid item xs={12}>
                <Card>
                      <DataGrid
                        autoHeight
                        rowHeight={150}
                        rows={rows && rows?.data}
                        columns={MyColumns({handleHumididityCoolingClick,authuser:authuser,ability:ability})}
                        disableSelectionOnClick

                        rowsPerPageOptions={[5,10,25,50,75,100]}
                        rowCount={rows?.total}
                        pageSize={rows?.per_page}
                        page={rows?.current_page - 1}
                        paginationMode="server"
                        /*onPageChange={(newPage) => {
                          pgquery={...pgquery,page:newPage + 1,per_page:pageSize}
                          dispatch(getsearchshellingsAction(sShelling.value,pgquery,onShellingPageSuccess))
                        }}
                        onPageSizeChange={(newPageSize) => {
                          setPageSize(newPageSize)
                          pgquery={...pgquery,page:1,per_page:newPageSize}
                          dispatch(getsearchshellingsAction(sShelling.value,pgquery,onShellingPageSuccess))
                        }}
                        onCellDoubleClick={handleCellDoubleClick}*/
                    />
                  </Card>

                </Grid>
              </Grid>
            </DatePickerWrapper>
        )
      }else{
        return <ExpiredSessionDialog/>
      }



}



HistoryTable.acl = {
  action:UserAction.Read,
  subject:EntityAbility.PRODUCT
}

HistoryTable.authGuard = true



export default HistoryTable


