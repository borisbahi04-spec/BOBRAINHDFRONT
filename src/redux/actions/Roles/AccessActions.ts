/* eslint-disable newline-before-return */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { AnyAction } from '@reduxjs/toolkit';
import { getSession, useSession } from 'next-auth/react';
import { Dispatch } from 'redux';
import { RST_CreateAccessService, RST_DeleteAccessService, RST_getSearchAccesssService, RST_UpdateAccessService, RST_AccesssService } from 'src/myservices/Role/AccessService';
import { createaccess, deleteaccess, getaccesss, getsearchaccesss, updateaccess } from 'src/redux/reducers/Role/AccessReducer';

export const RST_AccesssAction = (onSuccess?:(res?:any)=>void, onError?:(res?:any)=>void)=>{

  return (dispatch:Dispatch)=>{
          RST_AccesssService().then((res:any)=>{
          if(res.errors){
            if(onError){
              onError(res);
            }
          return false;
          }else{
            dispatch(getaccesss(res));
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



export  const  RST_getSearchAccesssAction = (value:string,pgquery?:any,onSuccess?:(res:any)=>void, onError?:(res:any)=>void)=>{
   return (dispatch:Dispatch)=>{
    RST_getSearchAccesssService(value,pgquery).then((res:any)=>{
          if(res.errors){
            if(onError){
              onError(res)
               return false
            }
          }else{
              dispatch(getsearchaccesss(res));
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

export const RST_CreateAccessAction= (credentials:any,onSuccess:(res:any)=>void, onError:(res:any)=>void)=>{
  return (dispatch:Dispatch)=>{
      RST_CreateAccessService(credentials).then((res:any)=>{
          if(res.errors){
              onError(res);
              return false
          }else{
              dispatch(createaccess(res))
              onSuccess(res)
          }
      },
        (error:any)=>{
          dispatch({type:'CODE_ERROR',error});
      });

  }
}

//
export const RST_UpdateAccessAction = (id:string,data:any,onSuccess:(res:any)=>void,onError:(res:any)=>void) =>{
  return async (dispatch:Dispatch)=>{
      await RST_UpdateAccessService(id,data).then((res:any)=>{
          if(res.errors){
              onError(res);
              return false
          }else{
            dispatch(updateaccess(res))
            onSuccess(res)
          }
      },
        (error: any)=>{
          dispatch({type:'CODE_ERROR',error});
        });
      }
}

export const RST_DeleteAccessAction= (id:string,onSuccess:(res:any)=>void,onError:(res:any)=>void)=>{
  return (dispatch: Dispatch<AnyAction>)=>{
    RST_DeleteAccessService(id).then((res:any)=>{

         /* if(res.errors){
              onError(res);
              return false
          }else{*/
            dispatch(deleteaccess(res))
            onSuccess(res)

          //}
      },
      (error: any)=>{
        dispatch({type:'CODE_ERROR',error});
      });

  }
}




