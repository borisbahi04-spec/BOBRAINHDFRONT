// AddCard.tsx — version refactorisée, lisible et professionnelle

import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller, SubmitHandler} from 'react-hook-form'

import toast from 'react-hot-toast'

import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  TextField
} from '@mui/material'

import { AppDispatch } from 'src/redux/store'
import { showErrors } from 'src/helpers'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { EntityAbility, UserAction } from 'src/configs/Action'
import {
  createrequesterAction,
  deleterequesterAction,
  requestersAction,
  updaterequesterAction
} from 'src/redux/actions/requester/requester-actions'
import { enumStatus, PriorityEnum, PriorityOptions } from 'src/definitions/enum'
import { getSearchrequesttypesAction } from 'src/redux/actions/requesttype/requesttype-actions'
import { getSearchstationsAction } from 'src/redux/actions/station/station-actions'

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

interface AddCardProps {
  data?: {
    id: string
    ticket?: string
    title: string
    priority: PriorityEnum
    description?: string
    requesttype?: { id: string }
    station?: { id: string }
  }
  requesttypes?: any[]
  stations?: any[]
}

interface FormValues {
  id?: string
  ticket?: string
  title: string
  priority: PriorityEnum
  description?: string
  requesttypeId?: string
  stationId?: string
}

/* -------------------------------------------------------------------------- */
/*                                   SCHEMA                                   */
/* -------------------------------------------------------------------------- */

const schema: yup.Schema<FormValues> = yup.object({
  title: yup
    .string()
    .min(3, obj => showErrors('Titre de la demande', obj.value.length, obj.min))
    .required('Titre de la demande obligatoire'),

  ticket: yup
  .string()
  .required('Ticket obligatoire')
  .matches(
    /^([A-Z]{2}-\d{4,12})(\s*,\s*[A-Z]{2}-\d{4,12})*$/,
    'Format invalide : ex AY-0001 ou AY-0001, AZ-1234'
  ),

  priority: yup
    .mixed<PriorityEnum>()
    .oneOf(Object.values(PriorityEnum))
    .required('La priorité est obligatoire'),

  description: yup
    .string()
    .required('La description de la demande doit être renseignée'),
  stationId: yup
    .string()
    .required('La station est obligatoire'),
  requesttypeId: yup
    .string()
    .required('Le type de requête est obligatoire')
})

/* -------------------------------------------------------------------------- */
/*                                 COMPONENT                                  */
/* -------------------------------------------------------------------------- */

const AddCard = ({ data, requesttypes = [], stations = [] }: AddCardProps) => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const ability = useContext(AbilityContext)
  const [loading, setLoading] = useState(false)

  const pgquery = { page: 1, per_page: 25 }

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<FormValues>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      ticket: '',
      description: '',
      priority: PriorityEnum.Normal,
      requesttypeId: '',
      stationId: ''
    }
  })

  /* ------------------------------ INIT EDIT ------------------------------ */

  useEffect(() => {
    if (!data) return

    setValue('id', data.id)
    setValue('title', data.title)
    setValue('ticket', data.ticket ?? '')
    setValue('description', data.description ?? '')
    setValue('priority', data.priority ?? PriorityEnum.Normal)
    setValue('requesttypeId', data.requesttype?.id ?? '')
    setValue('stationId', data.station?.id ?? '')
  }, [data, setValue])

  /* ------------------------------ HELPERS ------------------------------ */

  const resetAll = () => {
    reset()
    router.push('/requester/list')
  }

  const requesterErrMess = (errs: any) => Object.values(errs || {}).join(' ')

  /* ------------------------------ ACTIONS ------------------------------ */

  /*const onSubmit = (formData: FormValues) => {
    if (data?.id) {
      dispatch(
        updaterequesterAction(
          data.id,
          formData,
          () => {
            dispatch(requestersAction())
            resetAll()
          },
          (res: any) => toast.error(requesterErrMess(res.errors))
        )
      )
      return
    }

    dispatch(
      createrequesterAction(
        formData,
        resetAll,
        (res: any) => toast.error(requesterErrMess(res.errors))
      )
    )
  }*/

 const onSubmit: SubmitHandler<FormValues> = (formData) => {
    setLoading(true)

    if (data?.id) {
      // Update
      dispatch(
        updaterequesterAction(
          data.id,
          formData,
          () => {
            dispatch(requestersAction())
            resetAll()
            setLoading(false)
          },
          (res: any) => {
            toast.error(requesterErrMess(res.errors))
            setLoading(false)
          }
        )
      )
      return
    }

    // Create
    dispatch(
      createrequesterAction(
        formData,
        () => {
          resetAll()
          setLoading(false)
        },
        (res: any) => {
          toast.error(requesterErrMess(res.errors))
          setLoading(false)
        }
      )
    )
  }
  const handleDelete = () => {
    if (!data) return

    dispatch(
      deleterequesterAction(
        data.id,
        () => {
          dispatch(requestersAction())
          toast.success(`Suppression '${data.title}' réussie`)
          resetAll()
        },
        (res: any) => toast.error(res.message)
      )
    )
  }

  /* -------------------------------------------------------------------------- */

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            {/* Ticket */}
            <Grid item xs={12} md={12}>
              <FormControl fullWidth error={!!errors.ticket}>
                <Controller
                  name="ticket"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Ticket *"
                      placeholder="Example : AY-0001, EB-00001, ..."
                    />
                  )}
                />
                <FormHelperText>{errors.ticket?.message}</FormHelperText>
              </FormControl>
            </Grid>

            {/* Title */}
            <Grid item xs={12} md={12}>
              <FormControl fullWidth error={!!errors.title}>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Titre *"
                     />
                  )}
                />
                <FormHelperText>{errors.title?.message}</FormHelperText>
              </FormControl>
            </Grid>


            {/* Station */}
            <Grid item xs={12} md={5}>
              <Controller
                name="stationId"
                control={control}
                render={({ field, fieldState }) => {
                  const selectedStation = stations?.find((r) => r.id === field.value) ?? null;

                  return (
                  <Autocomplete
                    options={stations}
                    value={selectedStation}
                    isOptionEqualToValue={(o, v) => o.id === v.id}
                    getOptionLabel={o => o?.displayName ?? ''}
                    onChange={(_, v) => field.onChange(v?.id ?? '')}
                    onInputChange={(_, v) => dispatch(getSearchstationsAction(v, pgquery))}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Rechercher Station"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                  )
                }
              }
              />
            </Grid>

            {/* Request Type */}
            <Grid item xs={12} md={7}>
              <Controller
                name="requesttypeId"
                control={control}
                render={({ field, fieldState }) => {
                  const selectedRequestType = requesttypes?.find((r) => r.id === field.value) ?? null;

                  return <Autocomplete
                      options={requesttypes}
                      value={selectedRequestType}
                      isOptionEqualToValue={(o, v) => o.id === v.id}
                      getOptionLabel={o => o?.displayName ?? ''}
                      onChange={(_, v) => field.onChange(v?.id ?? '')}
                      onInputChange={(_, v) => dispatch(getSearchrequesttypesAction(v, pgquery))}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label="Rechercher Type de Requête"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                        />
                      )}
                    />
                }}

              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Description *"
                    multiline
                    minRows={3}
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
             {/* Priority */}
            <Grid item xs={12} md={12}>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Priorité *" fullWidth>
                    {PriorityOptions.map(p => (
                      <MenuItem key={p.key} value={p.key} sx={{ color: p.color, fontWeight: 'bold' }}>
                        {p.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              {data && ability.can(UserAction.Delete, EntityAbility.REQUESTER) && (
                <Button color="error" variant="outlined" onClick={handleDelete}>
                  Supprimer
                </Button>
              )}
            </Grid>

            <Grid item xs={12} md={8}>
              <Box display="flex" justifyContent="flex-end">
                 <Button size='medium' variant='outlined' color='secondary' sx={{ mr: 2 }} onClick={resetAll} fullWidth>
                      Annuler
                </Button>
                {ability.can(UserAction.Edit, EntityAbility.REQUESTER) && (
                 <Button
                    type="submit"
                    size="medium"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={16} />}
                  >
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>

  )
}

export default AddCard
