import React from 'react';
import { useFormContext } from 'react-hook-form';

import {
  Grid,
  TextField,
  Typography,
  Box,
} from '@mui/material';

type xFieldProps = {
  fieldGroupname: string;
  register:any;
  control: any;
  getValues: any;
  formState: any;
  label?: string;
};

const XFieldGroup = ({fieldGroupname,control,getValues,formState, register,label }: xFieldProps) => {
  //const {  getValues, formState: { errors }} = useFormContext();
  // eslint-disable-next-line newline-before-return
  return (
    <Box mb={2}>
      <Typography variant="body1">{label}</Typography>
      {getValues(fieldGroupname)?.map((field, index) => (
        <Box key={field.id} p={2} mt={1} border="1px solid #ccc" borderRadius={2}>
          <Grid container spacing={2}>
          <Grid item xs={6}>
              <TextField
                label=""
                size='small'
                disabled
                fullWidth
                {...register(`${fieldGroupname}.${index}.displayName`)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="value"
                type="number"
                size='small'
                fullWidth
                {...register(`${fieldGroupname}.${index}.value`)}
                {...register(`${fieldGroupname}.${index}.value`,{valueAsNumber:true})}
                error={!!formState.errors?.[fieldGroupname]?.[index]?.value}
                helperText={formState.errors?.[fieldGroupname]?.[index]?.value?.message}
              />
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default function xFieldForm(props: {register:any, getValues: any,formState:any,fieldGroupname: any,control:any,label:string }) {
  const {register,getValues,formState,fieldGroupname,control,label}=props

return (
  <Box p={2} mt={1} border="1px solid #bcd" borderRadius={1}>
    <XFieldGroup
      register={register}
      getValues={getValues}
      control={control}
      formState={formState}
      fieldGroupname={fieldGroupname}
      label={label}/>
    </Box>
  );
}
