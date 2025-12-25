/* eslint-disable newline-before-return */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { AnyAction } from '@reduxjs/toolkit';
import { getSession, useSession } from 'next-auth/react';
import { Dispatch } from 'redux';
import { RST_CreateFlashService, RST_DeleteFlashService, RST_getSearchFlashsService, RST_UpdateFlashService, RST_FlashsService, RST_getUniqueFlashService } from 'src/myservices/flash/flash-service';
import { createflash, deleteflash, getflashs, getsearchflashs, updateflash } from 'src/redux/reducers/flash/flash-reducer';

export const RST_FlashsAction = (onSuccess?:(res?:any)=>void, onError?:(res?:any)=>void)=>{

  return (dispatch:Dispatch)=>{
          RST_FlashsService().then((res:any)=>{
          if(res.errors){
            if(onError){
              onError(res);
            }
          return false;
          }else{
            dispatch(getflashs(res));
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



export  const  RST_getSearchFlashsAction = (value:string,pgquery:any,onSuccess?:(res:any)=>void, onError?:(res:any)=>void)=>{
   return (dispatch:Dispatch)=>{
    RST_getSearchFlashsService(value,pgquery).then((res:any)=>{
          if(res.errors){
            if(onError){
              onError(res)
               return false
            }
          }else{
              dispatch(getsearchflashs(res));
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

export  const  RST_getUniqueFlashAction = (value:any,onSuccess?:(res:any)=>void, onError?:(res:any)=>void)=>{
  return (dispatch:Dispatch)=>{
    RST_getUniqueFlashService(value).then((res:any)=>{
         if(res.errors){
           if(onError){
             onError(res)

return false
           }
         }else{
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


export const RST_CreateFlashAction= (credentials:any,onSuccess:(res:any)=>void, onError:(res:any)=>void)=>{
  return (dispatch:Dispatch)=>{
      RST_CreateFlashService(credentials).then((res:any)=>{
          if(res.errors){
              onError(res);
              return false
          }else{
              dispatch(createflash(res))
              onSuccess(res)
          }
      },
        (error:any)=>{
          dispatch({type:'CODE_ERROR',error});
      });

  }
}

//
export const RST_UpdateFlashAction = (id:string,data:any,onSuccess:(res:any)=>void,onError:(res:any)=>void) =>{
  return async (dispatch:Dispatch)=>{
      await RST_UpdateFlashService(id,data).then((res:any)=>{
          if(res.errors){
              onError(res);
              return false
          }else{
            dispatch(updateflash(res))
            onSuccess(res)
          }
      },
        (error: any)=>{
          dispatch({type:'CODE_ERROR',error});
        });
      }
}

export const RST_DeleteFlashAction= (id:string,onSuccess:(res:any)=>void,onError:(res:any)=>void)=>{
  return (dispatch: Dispatch<AnyAction>)=>{
    RST_DeleteFlashService(id).then((res:any)=>{

         /* if(res.errors){
              onError(res);
              return false
          }else{*/
            dispatch(deleteflash(res))
            onSuccess(res)

          //}
      },
      (error: any)=>{
        dispatch({type:'CODE_ERROR',error});
      });

  }
}




