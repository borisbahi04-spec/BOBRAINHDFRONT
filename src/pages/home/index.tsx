import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import LinearProgress from '@mui/material/LinearProgress'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Icon from 'src/@core/components/icon'
import { EntityAbility, UserAction } from 'src/configs/Action'
import { getSession } from 'next-auth/react'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/redux/store'
import { getstats } from 'src/redux/reducers/stat/stat-reducer'
import ExpiredSessionDialog from 'src/views/pages/confirmDialog/ExpiredSessionDialog'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import { CustomInput, SESSIONEXPIRECODE } from 'src/myCustomFunctions'
import { getSearchstatsAction } from 'src/redux/actions/stat/stat-actions'
import moment from 'moment'
import toast from 'react-hot-toast'
import { Avatar } from '@mui/material'

// ======================================================
// MOCK DATA (API simulée)
// ======================================================

// ======================================================
// UTILS
// ======================================================
const getColorByType = type => {
  switch (type) {
    case 'NETWORK': return 'primary'
    case 'IT': return 'success'
    case 'ELECTRICITY': return 'warning'
    default: return 'secondary'
  }
}


// ======================================================
// HOOKS METIER
// ======================================================


// ======================================================
// COMPONENTS
// ======================================================
const StatCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Stack direction='row' spacing={3} alignItems='center'>
        <CustomAvatar color={color} variant='rounded'>
          <Icon icon={icon} />
        </CustomAvatar>
        <Box>
          <Typography variant='h6'>{value}</Typography>
          <Typography variant='caption'>{title}</Typography>
        </Box>
      </Stack>
    </CardContent>
  </Card>
)

const StatLine = ({ label, value, icon, color }) => (
  <Box display='flex' alignItems='center' gap={1}>
    <Icon icon={icon} />
    <Box>
      <Typography variant='caption' color='text.secondary'>{label}</Typography>
      <Typography variant='body2' sx={{ color }}>{value}</Typography>
    </Box>
  </Box>
)

const EmitterCard = ({ emitter, total, mostFrequentType, breakdown }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      {/* Header */}
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Box>
          <Typography variant='h6'>{emitter}</Typography>
          <Typography variant='caption' color='text.secondary'>
            Type dominant : {mostFrequentType}
          </Typography>
        </Box>

        {/* TOTAL */}
        <Box textAlign='right'>
          <Typography variant='h5' fontWeight={700}>
            {total}
          </Typography>
          <Typography variant='caption'>Demandes</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Breakdown */}
      {Object.entries(breakdown).map(([type, count]) => (
        <Box key={type} mb={1.5}>
          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Chip
              size='small'
              color={getColorByType(type)}
              label={type}
            />
            <Typography variant='body2'>
              {count} ({Math.round((count / total) * 100)}%)
            </Typography>
          </Stack>

          <LinearProgress
            value={(count / total) * 100}
            variant='determinate'
            sx={{ height: 6, borderRadius: 5, mt: 0.5 }}
          />
        </Box>
      ))}
    </CardContent>
  </Card>
)

let sStat:any={startdate:'',endDate:''};

// ======================================================
// DASHBOARD PRINCIPAL
// ======================================================
const InterventionDashboard = (props: any) => {
const [startDate, setStartDate] = useState('')
const [endDate, setEndDate] = useState('')
const { settings, saveSettings } = useSettings()
const dispatch = useDispatch<AppDispatch>()
const store = useSelector((state: RootState) => state?.stat.data)
const [endDateRange, setEndDateRange] = useState<DateType>(null)
const [startDateRange, setStartDateRange] = useState<DateType>(null)
const [dates, setDates] = useState<Date[]>([])



   const _onError=(res:any)=>{
    const {errors}=res;
    if(res.code==SESSIONEXPIRECODE){
      expireSession(res.code);
    }else{
    toast.error(`${res.message}`,{position:'top-center'})
  }
}
  useEffect(() => {
    dispatch(getstats(props?.resdata));
  },[ dispatch, props?.resdata])

   const handleOnChangeRange = (dates: any) => {
        const [start, end] = dates
        const onSuccess=()=>{console.log('i')}
        if (start !== null && end !== null) {
          setDates(dates)
          dates?sStat={...sStat,startdate:dates[0]? moment(dates[0]).format("YYYY-MM-DD"):'',enddate:dates[1]?moment(dates[1]).format("YYYY-MM-DD"):''}:sStat={...sStat,startdate:'',enddate:''}
          dispatch(getSearchstatsAction(sStat,onSuccess,_onError))
        }
        setStartDateRange(start)
        setEndDateRange(end)
        dates?sStat={...sStat,startdate:start? moment(start).format("YYYY-MM-DD"):'',enddate:end?moment(end).format("YYYY-MM-DD"):''}:sStat={...sStat,startdate:'',enddate:''}
        dispatch(getSearchstatsAction(sStat,onSuccess,_onError))
      }

      useEffect(() => {
        saveSettings({
          ...settings,
          iconPage: 'mdi:chart-box-outline',
          titlePage: 'Tableau de bord analytique',
        })
      }, [])
      if(store!=null){
        return (
          <DatePickerWrapper>
            <Grid container spacing={6}>
              {/* FILTRES */}
              <Grid item xs={12}>
                <Card elevation={3}>
                  <CardHeader
                    title="Filtres temporels"
                    subheader="Sélectionnez une période d’analyse"
                    avatar={
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <Icon icon="mdi:calendar-range" />
                      </Avatar>
                    }
                  />
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <DatePicker
                          isClearable
                          selectsRange
                          monthsShown={2}
                          endDate={endDateRange}
                          selected={startDateRange}
                          startDate={startDateRange}
                          shouldCloseOnSelect
                          onChange={handleOnChangeRange}
                          customInput={
                            <CustomInput
                              label="Période"
                              dates={dates}
                              setDates={setDates}
                              start={startDateRange as Date}
                              end={endDateRange as Date}
                            />
                          }
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

            <Grid item xs={12} md={4}>
                <StatCard
                  title="Demandes"
                  value={store?.globalStats?.totalRequests || 0}
                  icon="mdi:file-document-multiple-outline"
                  color="primary"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <StatCard
                  title="Émetteurs"
                  value={store?.globalStats?.uniqueEmitters || 0}
                  icon="mdi:account-multiple-outline"
                  color="info"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <StatCard
                  title="Centres"
                  value={store?.globalStats?.uniqueTypes || 0}
                  icon="mdi:office-building-outline"
                  color="success"
                />
              </Grid>

              {/* KPI */}
              <Grid item xs={12} md={2}>
                <StatCard
                  title="Ouvertes"
                  value={store?.globalStats?.openRequests || 0}
                  icon="mdi:progress-clock"
                  color="warning"
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <StatCard
                  title="Approuvées"
                  value={store?.globalStats?.approvedRequests || 0}
                  icon="mdi:check-circle-outline"
                  color="success"
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <StatCard
                  title="Rejetées"
                  value={store?.globalStats?.rejectedRequests || 0}
                  icon="mdi:close-circle-outline"
                  color="error"
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <StatCard
                  title="Annulées"
                  value={store?.globalStats?.cancelledRequests || 0}
                  icon="mdi:cancel"
                  color="secondary"
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <StatCard
                  title="Fermées"
                  value={store?.globalStats?.closedRequests || 0}
                  icon="mdi:lock-check-outline"
                  color="info"
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <StatCard
                  title="Traitées"
                  value={store?.globalStats?.treatedRequests || 0}
                  icon="mdi:check-all"
                  color="success"
                />
              </Grid>



              {/* EMETTEURS */}
              {store?.emitterStats?.length>0 && (
              <Grid item xs={12}><Typography variant='h5'>Analyse par émetteur</Typography></Grid>
              )}
              {store?.emitterStats?.map(e => (
                <Grid item xs={12} md={4} key={e.emitter}><EmitterCard {...e} /></Grid>
              ))}

              {/* CENTRES */}
              {store?.centreStats?.length>0 && (
                <Grid item xs={12}><Typography variant='h5'>Analyse par centre logistique</Typography></Grid>
              )}
                {store?.centreStats?.map(c => (
                  <Grid item xs={12} md={4} key={c.centre}>
                      <Card elevation={3}>
                        <CardHeader
                          title={c.centre}
                          subheader={`Total demandes : ${c.total}`}
                          avatar={
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <Icon icon="mdi:office-building-outline" />
                            </Avatar>
                          }
                        />

                        <Divider />

                        <CardContent>
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <StatLine
                                label="Ouvertes"
                                value={c.open}
                                icon="mdi:progress-clock"
                                color="info.main"
                              />
                            </Grid>

                            <Grid item xs={6}>
                              <StatLine
                                label="Traitées"
                                value={c.treated}
                                icon="mdi:check-all"
                                color="success.main"
                              />
                            </Grid>

                            <Grid item xs={6}>
                              <StatLine
                                label="Approuvées"
                                value={c.approved}
                                icon="mdi:check-circle-outline"
                                color="success.main"
                              />
                            </Grid>

                            <Grid item xs={6}>
                              <StatLine
                                label="Rejetées"
                                value={c.rejected}
                                icon="mdi:close-circle-outline"
                                color="error.main"
                              />
                            </Grid>

                            <Grid item xs={6}>
                              <StatLine
                                label="Fermées"
                                value={c.closed}
                                icon="mdi:lock-check-outline"
                                color="info.main"
                              />
                            </Grid>

                            <Grid item xs={6}>
                              <StatLine
                                label="Annulées"
                                value={c.cancelled}
                                icon="mdi:cancel"
                                color="warning.main"
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                ))}
              </Grid>
          </DatePickerWrapper>
        )
      }else{
          return <ExpiredSessionDialog/>
      }
}

InterventionDashboard.acl = {
  action:UserAction.Read,
  subject:EntityAbility.BRANCH
}

InterventionDashboard.authGuard = true


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

const response = await fetch(`${process.env.PUBLIC_URL}/${process.env.ENTYTYSTATISTIC}`,{
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

  console.log('testbboris',res);


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



export default InterventionDashboard
