import React, { forwardRef } from "react";
import format from 'date-fns/format'

import styled from "@emotion/styled";
import { TextField } from "@mui/material";
import { enumCashewSage } from "src/definitions/enum";
import toast from "react-hot-toast";

// Fonction pour formater la date en "YYYY-MM-DD:HH:mm"
export function myformatDate (isoString) {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}:${hours}:${minutes}`;
};
export function usePrevious(value:any) {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });

return ref.current;
}

export enum ProductTypeEnum {
  eyeglassFrame = 'eyeglass_frame',
  eyeglassLens = 'eyeglass_lens',
  other = 'other',
}

export enum YearEnum {
  currentYear = 'currentYear',
}


const currentDate = new Date();
export const currentYear = currentDate.getFullYear();



export const getYearsList=()=> {
  // Get the current year
const currentYear = new Date().getFullYear();

// Initialize an empty array to store the years
const yearList = ['Tous'];

// Start the loop from 2022 to the current year
for (let year = 2020; year <= currentYear; year++) {
  yearList.push(year.toString());

}

return yearList.sort((a, b) => b - a);

}

export const filterDateList = [
  {
    id:'lastXDays',
    value:'7 Derniers jours'
  },
  {
    id:'currentMonth',
    value:'Mois Courant'
  },
  {
    id:'lastMonth',
    value:'Mois précedent'
  },
  {
    id:'currentYear',
    value:'Année Courante'
  },
  {
    id:'lastYear',
    value:'Année Précédente'
  }
];

export const  getRandomColor=()=>{
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

return color;
}


export const getFilterDateList=()=> {
  // Get the current year
const currentYear = new Date().getFullYear();

// Initialize an empty array to store the years
const yearList = ['Tous'];

// Start the loop from 2022 to the current year
for (let year = 2020; year <= currentYear; year++) {
  yearList.push(year.toString());

}

return yearList.sort((a, b) => b - a);

}
export const returnResponse=(value:Promise<any>)=>{
  return value.then((data: any)=>{
  return data;
}).catch((error: any)=>{
return {hasError:true,error};
})
}



export const  getAvailableProductsWithQuantity=(
  productForsellings: Array<any>,
  destinationBranchId: number | string
): Array<any> =>{
  return productForsellings
    ?.map(product => {
      let availableQuantity = 0;

      if (product.hasVariant) {
        // Cas des produits avec variantes
          const branchVariantToProducts = product.branchVariantToProducts?.filter(
            (e: any) =>
              e.isAvailable === true && e.branchId === destinationBranchId
          ) || [];

          for (const bvp of branchVariantToProducts) {
            availableQuantity += bvp.inStock || 0;
          }

      } else {
        // Cas des produits simples
        const branchToProducts = product.branchToProducts?.filter(
          (e: any) =>
            e.isAvailable === true && e.branchId === destinationBranchId
        ) || [];

        for (const bp of branchToProducts) {
          availableQuantity += bp.inStock || 0;
        }
      }

return {
          ...product,
          inStock:availableQuantity
        };



      //return null;
    })
}

export interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

export interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

export const SESSIONEXPIRECODE= 43;
export const CustomInput = forwardRef((props: CustomInputProps, ref) => {
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
  const updatedProps = { ...props }
  delete updatedProps.setDates

  return <TextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
})

export const MyTranslateProductType=(value:string)=>{
  if(value==ProductTypeEnum.eyeglassFrame){
    return 'Monture'
  }
  if(value==ProductTypeEnum.eyeglassLens){
    return 'Verre'
  }
  if(value==ProductTypeEnum.other){
    return 'Autre'
  }
}

export const ImgStyled = styled('img')(({ theme }) => ({
  width: 230,
  height: 70,
  borderRadius: 4,
  marginRight: theme.spacing(0)
}))

export const CapitalFirstSentenceLetter=(value:string)=>{
  const Capital_letter:string=value.charAt(0).toUpperCase();
  const Capital_string:string=Capital_letter+value.slice(1);

return Capital_string
}


export const isTimestampExpired=(timestamp)=>{
  // Get the current timestamp in seconds
  const currentTimestamp = Math.floor(Date.now() / 1000);

  // Compare the provided timestamp with the current timestamp
  return currentTimestamp >= timestamp;
}











export const displayErreurs=(errors)=>{
  if (typeof errors !== 'object' || errors === null) {
    toast.error(`Format d'erreur invalide`,{position:'top-center'})

return;
}

for (const champ in errors) {
  console.log("P1",champ,errors[champ])
    const messages = errors[champ];
    if (Array.isArray(messages)) {
        messages.forEach((message) => {
            toast.error(`${message}`,{position:'top-right'})

            //Erreur ${champ} :*/
        });
    } else {
      toast.error(`${messages}`,{position:'top-right'})

      //Erreur ${champ} :
    }
}
}






export const getOptionNameString = (data) => {
  return data.map(option => option.name).join('/');
};



export const sumQuantities=(items=[]) =>  {
  let sum = 0;
  items?.forEach(item => {
      sum += item.quantity;
  });

return sum;
}


