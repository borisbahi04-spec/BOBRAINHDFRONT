import { SvgIcon } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';

//export const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
export const phoneRegExp = /^\d{10}$/;
export const emailRegExp=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
export const  regexCoords = /^([+-]?\d+\.?\d+)\s*,\s*([+-]?\d+\.?\d+)$/
export const regexpasswords=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/

export const regexdate=/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/
export const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} est obligatoire    `
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} doit être au moins ${min} caractère(s)`
  } else {
    return ''
  }
}

export const ValidationIcon = (props) => (
  <SvgIcon {...props}>
    <CheckIcon fontSize='large' sx={{ color: "black" }} />
  </SvgIcon>
);


  // Define your colors here
 export  const systemsColors = {
    blue: 'blue',
    yellow: 'yellow',
    red: 'red',
    orange: 'orange',
    green: 'green',
    gray: 'gray',
    purple: 'purple',
    gold: 'gold',

    // Add more colors as needed
  };

export const  USERROLE={
  Admin:"admin"
}

