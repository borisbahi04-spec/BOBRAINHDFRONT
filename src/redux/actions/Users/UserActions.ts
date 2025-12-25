/* eslint-disable newline-before-return */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { AnyAction } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { CreateUserDto, UpdateUserDto } from 'src/dto/user/user.dto';
import { RST_UsersService, RST_CreateUserService, RST_DeleteUserService, RST_getSearchUsersService, RST_UpdateUserService } from 'src/myservices/User/UserService';
import { createuser, deleteuser, getsearchusers, getusers, updateuser } from 'src/redux/reducers/User/UserReducer';
import { store } from 'src/redux/store';



export const RST_UsersAction = (onSuccess?:(res?:any)=>void, onError?:(res?:any)=>void)=>{

  return (dispatch:Dispatch)=>{
          RST_UsersService().then((res:any)=>{
          if(res.errors){
            if(onError){
              onError(res);
            }
          return false;
          }else{
            dispatch(getusers(res));
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



export  const  RST_getSearchUsersAction = (value:any,pgquery:any,onSuccess?:(res:any)=>void, onError?:(res:any)=>void)=>{
   return (dispatch:Dispatch)=>{
    RST_getSearchUsersService(value,pgquery).then((res:any)=>{
          if(res.errors){
            if(onError){
              onError(res)
               return false
            }
          }else{
              dispatch(getsearchusers(res));
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

export const RST_CreateUserAction= (data:CreateUserDto,onSuccess:(res:any)=>void, onError:(res:any)=>void)=>{
  return (dispatch:Dispatch)=>{
      RST_CreateUserService(data).then((res:any)=>{
          if(res.errors){
              onError(res);
              return false
          }else{
              dispatch(createuser(res))
              onSuccess(res)
          }
      },
        (error:any)=>{
          dispatch({type:'CODE_ERROR',error});
      });

  }
}

//
export const RST_UpdateUserAction = (id:string,data:UpdateUserDto,onSuccess:(res:any)=>void,onError:(res:any)=>void) =>{
  return async (dispatch:Dispatch)=>{
      await RST_UpdateUserService(id,data).then((res:any)=>{
          if(res.errors){
              onError(res);
              return false
          }else{
            dispatch(updateuser(res))
            onSuccess(res)
          }
      },
        (error: any)=>{
          dispatch({type:'CODE_ERROR',error});
        });
      }
}



export const RST_DeleteUserAction= (id:string,onSuccess:(res:any)=>void,onError:(res:any)=>void)=>{
  return (dispatch: Dispatch<AnyAction>)=>{
    RST_DeleteUserService(id).then((res:any)=>{
          if(res.errors){
              onError(res);
              return false
          }else{
            dispatch(deleteuser(res))
            onSuccess(res)
          }
      },
      (error: any)=>{
        dispatch({type:'CODE_ERROR',error});
      });

  }
}




