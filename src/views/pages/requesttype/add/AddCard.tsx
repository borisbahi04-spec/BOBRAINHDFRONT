import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  TextField
} from '@mui/material'

import { AppDispatch } from 'src/redux/store'
import { showErrors } from 'src/helpers'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { EntityAbility, UserAction } from 'src/configs/Action'
import {
  createrequesttypeAction,
  deleterequesttypeAction,
  requesttypesAction,
  updaterequesttypeAction
} from 'src/redux/actions/requesttype/requesttype-actions'

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

interface AddCardProps {
  data?: {
    id: string
    displayName: string
    description?: string
  }
}

interface FormValues {
  id?: string
  displayName: string
  description?: string
}

/* -------------------------------------------------------------------------- */
/*                                   SCHEMA                                   */
/* -------------------------------------------------------------------------- */

const schema = yup.object({
  displayName: yup
    .string()
    .min(3, obj => showErrors('Nom de la requesttype', obj.value.length, obj.min))
    .required('Nom de la requesttype obligatoire'),
  description: yup.string().nullable()
})

/* -------------------------------------------------------------------------- */
/*                                 COMPONENT                                  */
/* -------------------------------------------------------------------------- */

const AddCard = ({ data }: AddCardProps) => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const ability = useContext(AbilityContext)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<FormValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      displayName: '',
      description: ''
    }
  })

  /* ------------------------------ INIT EDIT ------------------------------ */

  useEffect(() => {
    if (data) {
      setValue('id', data.id)
      setValue('displayName', data.displayName)
      setValue('description', data.description ?? '')
    }
  }, [data, setValue])

  /* ----------------------------- HELPERS ----------------------------- */


 const resetAll=() =>{
    reset();
    router.push('/requesttype/list')
  }
  const requesttypeErrMess = (errors: any) =>
    Object.values(errors || {}).join(' ')

  /* ------------------------------ ACTIONS ------------------------------ */

  const create = (formData: FormValues) => {
    dispatch(
      createrequesttypeAction(
        formData,
        resetAll,
        (res: any) => toast.error(requesttypeErrMess(res.errors))
      )
    )
  }

  const edit = (formData: FormValues) => {
    if (!formData.id) return

    dispatch(
      updaterequesttypeAction(
        formData.id,
        formData,
        () => {
          dispatch(requesttypesAction())
          resetAll()
        },
        (res: any) => toast.error(requesttypeErrMess(res.errors))
      )
    )
  }

  const handleDelete = () => {
    if (!data) return

    dispatch(
      deleterequesttypeAction(
        data.id,
        () => {
          dispatch(requesttypesAction())
          toast.success(`Suppression '${data.displayName}' réussie`)
          resetAll()
        },
        (res: any) => toast.error(res.message)
      )
    )
  }

  const onSubmit = (formData: FormValues) =>
    data ? edit(formData) : create(formData)

  /* -------------------------------------------------------------------------- */

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name="displayName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      autoFocus
                      label="Nom *"
                      variant="standard"
                      error={!!errors.displayName}
                      inputProps={{
                        style: {
                          fontSize: 30,
                          height: 60,
                          fontWeight: 'bold'
                        }
                      }}
                    />
                  )}
                />
                <FormHelperText error>
                  {errors.displayName?.message}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description"
                      variant="standard"
                      multiline
                      rows={2}
                    />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              {data &&
                ability.can(UserAction.Delete, EntityAbility.BRANCH) && (
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={handleDelete}
                  >
                    Supprimer
                  </Button>
                )}
            </Grid>

            <Grid item xs={12} md={8}>
              <Box display="flex" justifyContent="flex-end">
                <Button size="medium" variant="outlined" color="secondary" sx={{ mr: 2 }} onClick={resetAll}>
                  Annuler
                </Button>

                {ability.can(UserAction.Create, EntityAbility.BRANCH) && (
                  <Button type="submit" variant="outlined">
                    Enregistrer
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
