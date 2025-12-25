/* eslint-disable newline-before-return */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { AnyAction } from '@reduxjs/toolkit';
import { getSession, useSession } from 'next-auth/react';
import { Dispatch } from 'redux';
import { RST_CreateRoleService, RST_DeleteRoleService, RST_getSearchRolesService, RST_UpdateRoleService, RST_RolesService } from 'src/myservices/Role/RoleService';
import { createrole, deleterole, getroles, getsearchroles, updaterole } from 'src/redux/reducers/Role/RoleReducer';

export const RST_RolesAction = (onSuccess?:(res?:any)=>void, onError?:(res?:any)=>void)=>{

  return (dispatch:Dispatch)=>{
          RST_RolesService().then((res:any)=>{
          if(res.errors){
            if(onError){
              onError(res);
            }
          return false;
          }else{
            dispatch(getroles(res));
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



export  const  RST_getSearchRolesAction = (value:string,pgquery?:any,onSuccess?:(res:any)=>void, onError?:(res:any)=>void)=>{
   return (dispatch:Dispatch)=>{
    RST_getSearchRolesService(value,pgquery).then((res:any)=>{
          if(res.errors){
            if(onError){
              onError(res)
               return false
            }
          }else{
              dispatch(getsearchroles(res));
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

export const RST_CreateRoleAction= (credentials:any,onSuccess:(res:any)=>void, onError:(res:any)=>void)=>{
  return (dispatch:Dispatch)=>{
      RST_CreateRoleService(credentials).then((res:any)=>{
          if(res.errors){
              onError(res);
              return false
          }else{
              dispatch(createrole(res))
              onSuccess(res)
          }
      },
        (error:any)=>{
          dispatch({type:'CODE_ERROR',error});
      });

  }
}

//
export const RST_UpdateRoleAction = (id:string,data:any,onSuccess:(res:any)=>void,onError:(res:any)=>void) =>{
  return async (dispatch:Dispatch)=>{
      await RST_UpdateRoleService(id,data).then((res:any)=>{
          if(res.errors){
              onError(res);
              return false
          }else{
            dispatch(updaterole(res))
            onSuccess(res)
          }
      },
        (error: any)=>{
          dispatch({type:'CODE_ERROR',error});
        });
      }
}

export const RST_DeleteRoleAction= (id:string,onSuccess:(res:any)=>void,onError:(res:any)=>void)=>{
  return (dispatch: Dispatch<AnyAction>)=>{
    RST_DeleteRoleService(id).then((res:any)=>{

         /* if(res.errors){
              onError(res);
              return false
          }else{*/
            dispatch(deleterole(res))
            onSuccess(res)

          //}
      },
      (error: any)=>{
        dispatch({type:'CODE_ERROR',error});
      });

  }
}




