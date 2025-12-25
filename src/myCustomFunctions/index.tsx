import React, { forwardRef } from "react";
import format from 'date-fns/format'

import styled from "@emotion/styled";
import { TextField } from "@mui/material";
import { enumCashewSage, enumRoasterItem } from "src/definitions/enum";
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



export const generateOptionCombinations = (data: any[],price=0,cost=0,sku:any='',barreCode:any='') => {
  const combinations: { variant: any; }[] = [];
  const optionNames = data.map(option => option.name);
  const optionValues = data.map(option => option.values);

  const generateVariantNames = (currentIndex: number, currentVariantName: string,price:any,cost:any,sku:string,barreCode:string) => {
    if (currentIndex === optionNames.length) {
      combinations.push({ name:currentVariantName,price:price,cost:cost,sku:sku,barreCode:barreCode});

      //combinations.push({ /*id:currentVariantName,*/name:currentVariantName,price:price,cost:cost,sku:sku,barreCode:barreCode});

return;
    }
    const currentOptionValues = optionValues[currentIndex];
    currentOptionValues.forEach(value => {
      const updatedVariantName = currentVariantName ? `${currentVariantName}/${value}`:value;
      generateVariantNames(currentIndex + 1, updatedVariantName,price,cost,sku,barreCode);
    });
  };

  generateVariantNames(0, '',price,cost,sku,barreCode);

  return combinations;
};

export const generateOptionNewCombinations = (data: any[],price=0,cost=0,sku:any='',barreCode:any='') => {
  let lcombinations = [];
  const result = [];

  lcombinations=  generateOptionCombinations(data,price,cost,sku,barreCode)

  let start_sku=sku


      lcombinations.forEach(value => {
        value.sku = String(start_sku)
        start_sku ++
        result.push(value)
    });

return result;
};


export const generateProductVariantToBranchCombinations = (variantData: any[],branchData:any[],inStock=0,optimalStock=0,lowStock=0) => {
  const result = [];
  variantData.forEach(product => {
    branchData.forEach(branch => {
        const combination = {
            //"id": product.id,
            "name": product.name,
            "price": parseInt(product.price),
            "sku": parseInt(product.sku),
            "barreCode": product.barreCode,
            "branchId": branch.id,
            "branchName": branch.displayName,
            'inStock':parseFloat(inStock),
            'optimalStock':parseFloat(optimalStock),
            'lowStock':parseFloat(lowStock),
            "isAvailable":true
        };
        result.push(combination);
    });
});

return result;
};

export const transformEditBranchVariantToProductData=(branches: any=[],variantToProducts: any=[])=> {
  const data=[];
  for( const elements of variantToProducts){
    for (const item of branches ) {

		const branchMatch = elements?.branchVariantToProducts.find(el => el.branchId === item.id);

		if(branchMatch){
			    /*for (const el of elements?.branchVariantToProducts ) {*/
					const {name}=branchMatch?.variantToproduct;
					const {displayName}=branchMatch?.branch;

					//el.name=name;
					//el.branchName=displayName;
					//data.push(el)
          console.log("P15",branchMatch)

				/*//}*/
        const combination = {
          //"id":'',
          "price": branchMatch.price,
          "sku": branchMatch.sku,
          "name":name,
          "branchId": item.id,
          "branchName": displayName,
          "barreCode":branchMatch.barreCode,
          'inStock':branchMatch.inStock,
          'optimalStock':branchMatch.optimalStock,
          'lowStock':branchMatch.lowStock,
          "isAvailable":branchMatch.isAvailable
      };
      data.push(combination)
		}else{
      //for (const l of elements?.branchVariantToProducts ) {
      //const {name}=elements?.variantToproduct;
      const combination = {
            //"id":'',
            "price": 0,
            "sku": elements.sku,
            "name":elements.name,
            "branchId": item.id,
            "branchName": item.displayName,
            "barreCode":'',
            'inStock':0,
            'optimalStock':0,
            'lowStock':0,
            "isAvailable":false
        };
      data.push(combination)

   // }
    }

     }
 }

return data;
}


export const generateProductItemToBranchCombinations = (branchData:any[],productPrice:number,inStock:number,lowStock:number,optimalStock:number) => {
  const result: {

    //"id":'',
    price: number; sku: string; branchId: any; branchName: any; inStock: number; optimalStock: number; lowStock: number; isAvailable: boolean;
  }[] = [];
    branchData?.forEach(branch => {
        const combination = {
            //"id":'',
            "price": parseInt(productPrice)??0,

            //"sku": '',
            "branchId": branch.id,
            "branchName": branch.displayName,

            //'inStock':parseInt(inStock),
            'optimalStock':parseInt(optimalStock)??0,
            'lowStock':parseInt(lowStock)??0,
            "isAvailable":true
        };
        result.push(combination);
    });

return result;
};

export const generateOrUpdateProductItemToBranchCombinations = (
  branchData: any[],
  productPrice: number,
  inStock: number,
  lowStock: number,
  optimalStock: number,
  existingCombinations: any[] = []
) => {
  const result: {
    price: number;
    sku: string;
    branchId: any;
    branchName: any;
    inStock: number;
    optimalStock: number;
    lowStock: number;
    isAvailable: boolean;
  }[] = [];

  branchData?.forEach(branch => {
    const existing = existingCombinations.find(c => c.branchId === branch.id);
    alert(existing)
    const combination = {
      price: parseInt(productPrice) ?? 0,
      sku: existing?.sku || '',
      branchId: branch.id,
      branchName: branch.displayName,
      inStock: existing?.inStock ?? parseInt(inStock), // conserve inStock s'il existe
      optimalStock: parseInt(optimalStock) ?? 0,
      lowStock: parseInt(lowStock) ?? 0,
      isAvailable: existing?.isAvailable ?? true,
    };

    result.push(combination);
  });

  return result;
};




export const generateProductModifierCombinations = (modifierhData:any[]) => {
  const result: { modifierId: any; isAvailable: boolean; }[] = [];
  modifierhData?.forEach(modifier => {
        const combination = {
            "displayName":modifier.displayName,
            "modifierId": modifier.id,
            "isEnable":false
        };
        result.push(combination);
    });

return result;
};

export const generateProductDiscountCombinations = (discountData:any[]) => {
  const result: { discountId: any; isAvailable: boolean; }[] = [];
  discountData?.forEach(discount => {
        const combination = {
            "displayName":discount.displayName,
            "discountId": discount.id,
            "isEnable":false
        };
        result.push(combination);
    });

return result;
};

export const  transformEditBranchToProductData=(branches=[],dataToEdit)=>{
  const result = [];
   for (const item of branches) {
     const branchMatch = dataToEdit.find(el => el.branchId === item.id);
   if(branchMatch){
     const combination = {
             //"id":'',
             "price": parseInt(branchMatch.price),
             "sku": '',
             "branchId": branchMatch.branchId,
             "branchName": item.displayName,
             'inStock':parseInt(branchMatch.inStock),
             'optimalStock':parseInt(branchMatch.optimalStock),
             'lowStock':parseInt(branchMatch.lowStock),
             "isAvailable":branchMatch.isAvailable
         };
     result.push(combination);
   }else{
   const combination = {
             //"id":'',
             "price": 0,
             "sku": '',
             "branchId": item.id,
             "branchName": item.displayName,
             'inStock':0,
             'optimalStock':0,
             'lowStock':0,
             "isAvailable":false
         };
       result.push(combination);
   }
   }

 return result;
 }


 export const generateRoasterSettingsCombinations = (coocleaspeeds:any[],cylindertemperatures:any,directsteams:any) => {
  const result: {

    //"id":'',
    pression: number; sku: string; branchId: any;
    roasterToSettingToCoocleaSpeeds: any;
    roasterToSettingToCylinderTemperatures: any;
    roasterToSettingToDirectSteams:any
  }[] = [];

    for(let i=0;i<4;i++) {
      const roasterToSettingToCoocleaSpeeds=[]
      const roasterToSettingToCylinderTemperatures=[]
      const roasterToSettingToDirectSteams=[]



      const coocleaspeed=coocleaspeeds?.find(e=>e.displayName[0]==i+1)
      const cylindertemperature=cylindertemperatures?.find(e=>e.displayName[0]==i+1)
      const directsteam=directsteams?.find(e=>e.displayName[0]==i+1)

        const childcoocleaspeedcombination = {
          "displayName":coocleaspeed?.displayName,
          "coocleaspeedId":coocleaspeed?.id,
          "value":0
        };
        const childcylindertemperaturecombination = {
          "displayName":cylindertemperature?.displayName,
          "cylindertemperatureId":cylindertemperature?.id,
          "value":0
        };

        const childdirectsteamcombination = {
          "displayName":directsteam?.displayName,
          "directsteamId":directsteam?.id,
          "value":0
        };
        roasterToSettingToCoocleaSpeeds.push(childcoocleaspeedcombination)
        roasterToSettingToCylinderTemperatures.push(childcylindertemperaturecombination)
        roasterToSettingToDirectSteams.push(childdirectsteamcombination)

        const headcombination :any= {
            "roasterToSettingToCoocleaSpeeds":[...roasterToSettingToCoocleaSpeeds],
            "roasterToSettingToCylinderTemperatures":[...roasterToSettingToCylinderTemperatures],
            "roasterToSettingToDirectSteams":[...roasterToSettingToDirectSteams]
        };

        result.push(headcombination);
    }

return result;
};

export const generateRoasterToHumidityCombinations = (cashewstages:any[]) => {
  const result:any= [];
      const cashewstageRCN=cashewstages?.find(e=>e.displayName==enumCashewSage.RCN)
        const combination = {
          "displayName":cashewstageRCN?.displayName,
          "cashewstageId":cashewstageRCN?.id,
          "value":0
        };
        result.push(combination);

return result;
};




export const generateQashellingCombinations = (cashewstages: any[],allowedNames:any[]) => {
  const result: any[] = [];
  const filteredStages = cashewstages?.filter(
    (e) =>  allowedNames.includes(e.displayName)
  );

  filteredStages.forEach((el) => {
    const combination = {
      displayName: el.displayName,
      cashewStageId: el.id,
      value: 0
    };
    result.push(combination);
  });

  return result;
};

export const generateRoasterItemxCombinations = (roasterItems: any[],xName:string) => {
  const result: any[] = [];
  const fr :any= roasterItems?.find(e => e.displayName === xName);
    const combination = {
      displayName: fr?.displayName,
      roasteritemId: fr?.id,
      value: 0
    };
    result.push(combination);

return result;
};


export const generateEditRoasterItemxCombinations = (
  roasterItems: any[],
  roasterToSettingXs: any[] = [],
  xName:string
) => {
  const result: any[] = [];

  const roasterItem = roasterItems?.find(
    (e) => e.displayName === xName
  );


  const existingx = roasterToSettingXs.find(
    (r) => r.roasteritemId === roasterItem?.id
  );

  const combination = {
    ...existingx,
    displayName: roasterItem?.displayName,
    roasteritemId: roasterItem?.id,
    value: existingx?.value ?? 0,
    id: existingx?.id, // utile si tu veux faire un update côté backend
  };

  result.push(combination);

return result;
};


export const generateRoasterItemCylinderTemperatureCombinations = (roasterItems: any[],cylindertemperatureName:string) => {
  const result: any[] = [];
  const fr :any= roasterItems?.find(e => e.displayName === cylindertemperatureName);
    const combination = {
      displayName: fr?.displayName,
      cylindertemperatureId: fr?.id,
      value: 0
    };
    result.push(combination);

return result;
};

export const generateRoasterItemDirectSteamCombinations = (roasterItems: any[],directSteamName:string) => {
  const result: any[] = [];
  const fr :any= roasterItems?.find(e => e.displayName === directSteamName);
    const combination = {
      displayName: fr?.displayName,
      directsteamId: fr?.id,
      value: 0
    };
    result.push(combination);

return result;
};

export const generateHumidityRoasteCombinations= (cashewstages: any[],allowedNames:any[])=>{
   return generateQashellingCombinations(cashewstages,allowedNames)
}


export const generateShellingToProductionCombinationsg = (cashewstages: any[],allowedNames:any[]) => {
  return generateQashellingCombinations(cashewstages,allowedNames);
};

export const generateshellingCombinations = (sizes: any[],allowedNames:any[]) => {
  const result: any[] = [];
  const filteredSizes = sizes?.filter(
    (e) =>  allowedNames.includes(e.displayName)
  );

  filteredSizes?.forEach((el) => {
    const combination = {
      displayName: el.displayName,
      sizeId: el.id,
      bag: 0,
      quantity:0
    };
    result.push(combination);
  });

  return result;
}


export const generateShellingStaffCombinations = (genders: any[],allowedNames:any[]) => {
  const result: any[] = [];
  const filteredGenders = genders?.filter(
    (e) =>  allowedNames.includes(e.displayName)
  );
  console.log("P1111",genders,allowedNames)

  filteredGenders?.forEach((el) => {
    const combination = {
      displayName: el.displayName,
      genderId: el.id,
      value:0
    };
    result.push(combination);
  });
  console.log("P1",allowedNames,filteredGenders,genders)

  return result;
}



export const generateEditshellingCombinations = (
  sizes: any[],
  itemsToallloweds: any[] = [],
  allowedNames:any[]
) => {
  const result: any[] = [];
  const filteredSizes = sizes?.filter(
    (e) =>  allowedNames.includes(e.displayName)
  );


  filteredSizes?.forEach((el) => {
    const existingSize = itemsToallloweds.find(
      (r) => r.sizeId === el?.id
    );
    const combination = {
      displayName: existingSize?.size?.displayName,
      sizeId: existingSize?.sizeId,
      bag: existingSize?.bag??0,
      quantity:existingSize?.quantity??0
    };
    result.push(combination);
  });

  return result;
};

export const generateEditRoasterToHumidityCombinations = (
  cashewstages: any[],
  roasterToHumiditys: any[] = []
) => {
  const result: any[] = [];

  const cashewstageRCN = cashewstages?.find(
    (e) => e.displayName === enumCashewSage.RCN
  );

  const existingHumidity = roasterToHumiditys.find(
    (r) => r.cashewstageId === cashewstageRCN?.id
  );

  const combination = {
    ...existingHumidity,
    displayName: cashewstageRCN?.displayName,
    cashewstageId: cashewstageRCN?.id,
    value: existingHumidity?.value ?? 0,
    id: existingHumidity?.id, // utile si tu veux faire un update côté backend
  };

  result.push(combination);

return result;
};

export const generateEditQashellingCombinations = (
  cashewstages: any[],
  itemsToallloweds: any[] = [],
  allowedNames:any[]
) => {
  const result: any[] = [];
  const filteredStages = cashewstages?.filter(
    (e) =>  allowedNames.includes(e.displayName)
  );



  filteredStages.forEach((el) => {
    const existingKernel = itemsToallloweds.find(
      (r) => r.cashewStageId === el?.id
    );
    const combination = {
      displayName: el.displayName,
      cashewStageId: el.id,
      value: existingKernel?.value??0
    };
    result.push(combination);
  });

  return result;
};


export const generateEditShellingToStaffCombinations = (
  genders: any[],
  itemsToallloweds: any[] = [],
  allowedNames:any[]
) => {
  const result: any[] = [];
  const filteredGenders = genders?.filter(
    (e) =>  allowedNames.includes(e.displayName)
  );


  filteredGenders.forEach((el) => {
    const existing = itemsToallloweds.find(
      (r) => r.genderId === el?.id
    );
    const combination = {
      displayName: el.displayName,
      genderId: el.id,
      value: existing?.value??0
    };
    result.push(combination);
  });

  return result;
};

export const generateEditShellingToProductionCombinations = (
  cashewstages: any[],
  itemsToallloweds: any[] = [],
  allowedNames:any[]
) => {
  return generateEditQashellingCombinations(cashewstages, itemsToallloweds, allowedNames);
};


export const generateShellingToHullingCombinations = (cashewstages: any[],allowedNames:any[]) => {
  return generateQashellingCombinations(cashewstages,allowedNames);
};

export const generateEditShellingToHullingCombinations = (
  cashewstages: any[],
  itemsToallloweds: any[] = [],
  allowedNames:any[]
) => {
  return generateEditQashellingCombinations(cashewstages, itemsToallloweds, allowedNames);
};




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


 export const  transformEditModifierToProductData=(modifiers,dataToEdit)=>{
  const result = [];
   for (const item of modifiers) {
     const modifierMatch = dataToEdit.find(el => el.modifierId === item.id);
   if(modifierMatch){
     const combination = {
            "displayName":item.displayName,
            "modifierId": modifierMatch.modifierId,
            "isEnable":modifierMatch.isEnable
         };
     result.push(combination);
   }else{
   const combination = {
            "displayName":item.displayName,
            "modifierId": item?.id,
            "isEnable":false
         };
       result.push(combination);
   }
   }

 return result;
 }

 export const  transformEditDiscountToProductData=(discounts,dataToEdit)=>{
  const result = [];
   for (const item of discounts) {
     const discountMatch = dataToEdit.find(el => el.discountId === item.id);
   if(discountMatch){
     const combination = {
            "displayName":item.displayName,
            "discountId": discountMatch.discountId,
            "isEnable":discountMatch.isEnable
         };
     result.push(combination);
   }else{
   const combination = {
            "displayName":item.displayName,
            "discountId": item?.id,
            "isEnable":false
         };
       result.push(combination);
   }
   }

 return result;
 }



 export const  transformEditTaxToProductData=(dataToEdit)=>{
  const result = [];
   for (const item of dataToEdit) {
   const combination = {
            "displayName":`${item?.tax?.displayName}(${item?.tax?.taxRate??0})%`,
            "taxId": item?.taxId,
            "isEnable":item?.isEnable
         };
       result.push(combination);
   }

 return result;
 }
export const generateEntityEditToBranchCombinations = (branchData, branchData2) => {
  const result = [];
  branchData?.forEach(branch => {
      // Use find() instead of filter() since you expect only one match
      const branchMatch = branchData2.find(el => el.branchId === branch.id);

      if (branchMatch) {
          const combination = {
              branchId: branchMatch.branchId, // Use branchMatch.branchId instead of branchData2.filter(...)
              branchName: branch.displayName,
              isAvailable: branchMatch.isAvailable // Assuming isAvailable is a property of branchMatch
          };
          result.push(combination);
      }else{
        const combination = {
          branchId:branch.id, // Use branchMatch.branchId instead of branchData2.filter(...)
          branchName:branch.displayName,
          isAvailable:false // Assuming isAvailable is a property of branchMatch
      };
      result.push(combination);

      }
  });

  return result;
};

export const generateEntityBranchCombinations = (branchData:any[],isAvailable?=true) => {
  const result = [];
    branchData?.forEach(branch => {
        const combination = {
            "branchId": branch.id,
            "branchName": branch.displayName,
            "isAvailable":isAvailable
        };
        result.push(combination);
    });

return result;
};




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


export const mergeOrderSellingToProducts=(data:any)=>{
  const mergedItem = {
    productId:data.id,
    displayName:data.displayName,
    sku:data.sku,
    quantity:0,
    inStock:data.inStock,
    cost:data.price, //a changer cost par price dans la bd
    incoming:data.incoming??0,
    amount:data.amount??0,
    hasVariant:data.hasVariant,
    variantId:data?.variantId??''
  }

return mergedItem
}

export const mergeProductionToProducts=(data:any)=>{
  const mergedItem = {
    productId:data.id,
    displayName:data.displayName,
    sku:data.sku,
    quantity:0,
    cost:data.cost,
    price:data.price
  }

return mergedItem
}



export const mergeReceptionToAdditionalCosts=(orderToAdditionalCost:any)=>{
  const mergedItem = {
    orderToAdditionalCostId:orderToAdditionalCost.id,
    displayName:orderToAdditionalCost.displayName,
    amount:orderToAdditionalCost.amount,
    isChecked:true
  }

return mergedItem
}

export const mergeDeliveryToAdditionalCosts=(sellingToAdditionalCost:any)=>{
  const mergedItem = {
    sellingToAdditionalCostId:sellingToAdditionalCost.id,
    displayName:sellingToAdditionalCost.displayName,
    amount:sellingToAdditionalCost.amount,
    isChecked:true
  }

return mergedItem
}



export const mergeReceptionToProducts=(data:any)=>{
  const mergedItem = {
    productId:data.id,
    displayName:data.displayName,
    sku:data.sku,
    quantity:0,
    inStock:data.inStock,
    cost:data.cost,
    incoming:data.incoming??0,
    amount:data.amount??0,
    hasVariant:data.hasVariant,
    variantId:data?.variantId??''
  }

return mergedItem
}
