/* eslint-disable newline-before-return */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { AnyAction } from '@reduxjs/toolkit';
import { getSession, useSession } from 'next-auth/react';
import { Dispatch } from 'redux';
import { createstationService, deletestationService, getSearchstationsService, updatestationService, stationsService } from 'src/myservices/station/station-service';
import { createstation, deletestation, getsearchstations, getstations, updatestation } from 'src/redux/reducers/station/station-reducer';

export const stationsAction = (onSuccess?:(res?:any)=>void, onError?:(res?:any)=>void)=>{

  return (dispatch:Dispatch)=>{
          stationsService().then((res:any)=>{
          if(res.errors){
            if(onError){
              onError(res);
            }
          return false;
          }else{
            dispatch(getstations(res));
            if(onSuccess){
              onSuccess(res)
            }
          }
      },
            (error: any)=>{
          dispatch({type:'CODE_ERROR',error});
      });

  }
}



export  const  getSearchstationsAction = (value:string,pgquery?:any,onSuccess?:(res:any)=>void, onError?:(res:any)=>void)=>{
   return (dispatch:Dispatch)=>{
    getSearchstationsService(value,pgquery).then((res:any)=>{
          if(res.errors){
            if(onError){
              onError(res)
               return false
            }
          }else{
              dispatch(getsearchstations(res));
              if(onSuccess){
              onSuccess(res);
              }
        }
  },
      (  error: any)=>{
  dispatch({type:'CODE_ERROR',error});
  });

  }
}

export const createstationAction= (credentials:any,onSuccess:(res:any)=>void, onError:(res:any)=>void)=>{
  return (dispatch:Dispatch)=>{
      createstationService(credentials).then((res:any)=>{
          if(res.errors){
              onError(res);
              return false
          }else{
              dispatch(createstation(res))
              onSuccess(res)
          }
      },
        (error:any)=>{
          dispatch({type:'CODE_ERROR',error});
      });

  }
}

//
export const updatestationAction = (id:string,data:any,onSuccess:(res:any)=>void,onError:(res:any)=>void) =>{
  return async (dispatch:Dispatch)=>{
      await updatestationService(id,data).then((res:any)=>{
          if(res.errors){
              onError(res);
              return false
          }else{
            dispatch(updatestation(res))
            onSuccess(res)
          }
      },
        (error: any)=>{
          dispatch({type:'CODE_ERROR',error});
        });
      }
}

export const deletestationAction= (id:string,onSuccess:(res:any)=>void,onError:(res:any)=>void)=>{
  return (dispatch: Dispatch<AnyAction>)=>{
    deletestationService(id).then((res:any)=>{
            dispatch(deletestation(res))
            onSuccess(res)
      },
      (error: any)=>{
        dispatch({type:'CODE_ERROR',error});
      });

  }
}




