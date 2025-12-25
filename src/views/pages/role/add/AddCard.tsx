import { useState, useEffect, useContext } from 'react'


// ** Icon Imports

// ** Third Party Imports

// ** Configs

// ** Custom Component Imports
import { AppDispatch } from 'src/redux/store'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller} from 'react-hook-form'

import toast from 'react-hot-toast'

import { useDispatch } from 'react-redux'
import { showErrors } from 'src/helpers'
import { RST_RolesAction, RST_CreateRoleAction, RST_UpdateRoleAction, RST_DeleteRoleAction } from 'src/redux/actions/Roles/RoleActions'
import { useRouter } from 'next/router'
import {  makeStyles } from '@material-ui/core';
import { AccessNameEnum, EntityAbility, UserAction } from 'src/configs/Action'
import { CreateRoleDto } from 'src/dto/role/role.dto'
import { RoleCreateDto } from 'src/dto/role/access-dto-view'
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper
} from "@mui/material";
import { AbilityContext } from 'src/layouts/components/acl/Can'






const AddCard = (props:RoleCreateDto) => {
  const router = useRouter()
  const {data,access}=props;
  const defaultValues = {
    id: '',
    name: '',
    displayName: '',
    permissions:''
  }

  const ability = useContext(AbilityContext)



  // ** State
  const [entityList, setEntityList] = useState<any>({})
  const [entityPermissions, setEntityPermissions] = useState({});
  const [permissionList, setPermissionList] = useState( {});



  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const schema = yup.object().shape({
    id:yup.string(),
    name: yup
    .string()
    .min(3, obj => showErrors('Nom du rôle ', obj.value.length, obj.min))
    .required('Nom du rôle obilgatoire '),
    displayName: yup.string(),
    permissions: yup.object().nullable(),
  })
  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })


  const create = (data: CreateRoleDto) => {
    const _onSuccess=()=>{
      resetAll()
    }
    const _onError=(res:any)=>{
      const {errors}=res;
      toast.error(`${roleErrMess(errors)}`,{position:'top-center'})
     }

    dispatch(RST_CreateRoleAction(data,_onSuccess,_onError))
  }

  const resetAll=() =>{
    reset();
    router.push('/role/list')
  }

  const roleErrMess=(errors)=>{
    let errmess='';

    if(errors?.email) errmess+=errors?.email+' '
    if(errors?.phoneNumber) errmess+=errors?.phoneNumber+' '
    if(errors?.rolename) errmess+=errors?.rolename+' '
    if(errors?.id) errmess+=errors?.id

    return errmess
  }


const  edit=(data:CreateRoleDto)=> {
  const onUpdateRoleSuccess=()=>{
     dispatch(RST_RolesAction())
     resetAll()
   }

   const onUpdateRoleError=(res:any)=>{
    const {errors}=res;
      toast.error(`${roleErrMess(errors)}`,{position:'top-center'})
   }
    dispatch(RST_UpdateRoleAction(data.id,data,onUpdateRoleSuccess,onUpdateRoleError))
 }

 const handleDelete = (row:any) => {
  const onSuccess = () => {
    dispatch(RST_RolesAction())
    toast.success(`Suppression '${row.name}' effectuée avec succès`,{position:'top-center'})
    resetAll();
  }
  const onError = (res:any) => {
    toast.error(`${res.message}`,{position:'top-center'})
  }
  dispatch(RST_DeleteRoleAction(row.id,onSuccess,onError))
}



const handleGetDefaultEntityList= (access:any) => {
    const accessss = access?.find(ac => ac.name ===  AccessNameEnum.default)?.entity;
    const permissions = access?.find(ac => ac.name ===  AccessNameEnum.default)?.permissions;
    setEntityList(accessss)
    setPermissionList(permissions)
}



  const onSubmit = (dt:CreateRoleDto,e:any) =>{
    e.preventDefault();

return data? edit(dt):create(dt);
}



useEffect(()=>{
  const initialPermissions = {};

  if (data) {
    setValue('id', data.id)
    setValue('name', data.name)
    setValue('displayName', data.displayName)
    setEntityPermissions(data?.permissions);

   }else{
    Object.keys(entityList).forEach((entity) => {
      initialPermissions[entity] = {};
      Object.keys(permissionList).forEach((perm) => {
        initialPermissions[entity][perm] = false;
      });
    });
    setPermissionList(initialPermissions);
   }
  handleGetDefaultEntityList(access?.data??[])
},[access?.data])





  setValue(`permissions`,entityPermissions??{});






  // Gère le changement d'une seule permission
  const handlePermissionChange = (entity, perm) => {
    setEntityPermissions((prev) => ({
      ...prev,
      [entity]: {
        ...prev[entity],
        [perm]: !prev[entity]?.[perm]
      }
    }));
  };


  // Gère le "Tout sélectionner" pour une entité
  const handleSelectAll = (entity) => {
    const allSelected = Object.keys(permissionList).every((perm) =>entityPermissions[entity]?.[perm])
       setEntityPermissions((prev) => ({
      ...prev,
      [entity]: Object.fromEntries(Object.keys(permissionList).map((perm) => [perm, !allSelected]))
    }));
  };

  const isAllPermissionsSelected = (perm) => {
      return Object.keys(entityPermissions).every(
      (entity) => entityPermissions[entity]?.[perm]
    );

  };

  const isSomePermissionsSelected = (perm) => {
    return (
      Object.keys(entityPermissions).some(
        (entity) => entityPermissions[entity]?.[perm]
      ) && !isAllPermissionsSelected(perm)
    );
  };

  const handleToggleAllForPermission = (perm) => {
    const allSelected = isAllPermissionsSelected(perm);
    const updated = { ...entityPermissions };

    Object.keys(updated).forEach((entity) => {
      updated[entity] = {
        ...updated[entity],
        [perm]: !allSelected
      };
    });

    setEntityPermissions(updated);
  };


  return (
    <>
       <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      autoFocus
                      label="Nom*"
                      variant="standard"
                      inputProps={{
                        style: {
                          fontSize: 30,
                          height: 60,
                          width: 272,
                          padding: "0 14px",
                          fontWeight: "bold"
                        }
                      }}
                      error={Boolean(errors.name)}
                    />
                  )}
                />
                {errors.name && <FormHelperText sx={{ color: "error.main" }}>{errors.name.message}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name="displayName"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nom à afficher"
                      variant="standard"
                      multiline
                      rows={2}
                      error={Boolean(errors.displayName)}
                    />
                  )}
                />
                {errors.displayName && <FormHelperText sx={{ color: "error.main" }}>{errors.displayName.message}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>

        {/* Tableau des permissions */}
        {entityList && Object.keys(entityList).length > 0 && (
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Entité</strong></TableCell>
                    <TableCell align="center"><strong>Tout sélectionner</strong></TableCell>
                    {
                      Object.keys(permissionList).map((perm)=> (
                      <TableCell key={perm} align="center">
                        <strong>{perm}</strong>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                      <TableCell colSpan={2}><strong>Tout gérer</strong></TableCell>
                      {Object.keys(permissionList).map((perm) => (
                        <TableCell key={perm} align="center">
                          <Checkbox
                            checked={isAllPermissionsSelected(perm)}
                            indeterminate={isSomePermissionsSelected(perm)}
                            onChange={() => handleToggleAllForPermission(perm)}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(entityList).map((entity) => {
                      return (
                        <TableRow key={entity}>
                        <TableCell>{entity}</TableCell>
                        <TableCell align="center">
                          <Checkbox
                            checked={Object.keys(permissionList).every((perm) =>{
                              return entityPermissions[entity]?.[perm]
                            } )}
                            indeterminate={
                              !Object.keys(permissionList).every((perm) => entityPermissions[entity]?.[perm]) &&
                              Object.keys(permissionList).some((perm) => entityPermissions[entity]?.[perm])
                            }
                            onChange={() => handleSelectAll(entity)}
                          />
                        </TableCell>
                        {Object.keys(permissionList).map((perm) => (
                          <TableCell key={`${entity}-${perm}`} align="center">
                            <Checkbox
                              checked={entityPermissions[entity]?.[perm] || false}
                              onChange={() => handlePermissionChange(entity, perm)}
                            />
                          </TableCell>
                        ))}
                          </TableRow>
                      )})
                    }

                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        )}

        <Divider />

        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              {data && (
                 ability.can(UserAction.Delete, EntityAbility.ROLE) && (
                <Button size="medium" variant="outlined" color="error" onClick={() => handleDelete(data)}>
                  Supprimer
                </Button>
                )
              )}
            </Grid>
            <Grid item xs={12} md={8}>
              <Box display="flex" justifyContent="flex-end">
                <Button size="medium" variant="outlined" color="secondary" sx={{ mr: 2 }} onClick={resetAll}>
                  Annuler
                </Button>
                {ability.can(UserAction.Delete, EntityAbility.ROLE) && (
                <Button size="medium" type="submit" variant="outlined">
                  Enregistrer
                </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  </>
  )
}



export default AddCard
