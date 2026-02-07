/* eslint-disable newline-before-return */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { AnyAction } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { createdepartmentService, deletedepartmentService, getSearchdepartmentsService, updatedepartmentService, departmentsService } from 'src/myservices/department/department-service';
import { createdepartment, deletedepartment, getsearchdepartments, getdepartments, updatedepartment } from 'src/redux/reducers/department/department-reducer';

export const departmentsAction = (onSuccess?:(res?:any)=>void, onError?:(res?:any)=>void)=>{

  return (dispatch:Dispatch)=>{
          departmentsService().then((res:any)=>{
          if(res.errors){
            if(onError){
              onError(res);
            }
          return false;
          }else{
            dispatch(getdepartments(res));
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



export  const  getSearchdepartmentsAction = (value:string,pgquery?:any,onSuccess?:(res:any)=>void, onError?:(res:any)=>void)=>{
   return (dispatch:Dispatch)=>{
    getSearchdepartmentsService(value,pgquery).then((res:any)=>{
          if(res.errors){
            if(onError){
              onError(res)
               return false
            }
          }else{
              dispatch(getsearchdepartments(res));
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

export const createdepartmentAction= (credentials:any,onSuccess:(res:any)=>void, onError:(res:any)=>void)=>{
  return (dispatch:Dispatch)=>{
      createdepartmentService(credentials).then((res:any)=>{
          if(res.errors){
              onError(res);
              return false
          }else{
              dispatch(createdepartment(res))
              onSuccess(res)
          }
      },
        (error:any)=>{
          dispatch({type:'CODE_ERROR',error});
      });

  }
}

//
export const updatedepartmentAction = (id:string,data:any,onSuccess:(res:any)=>void,onError:(res:any)=>void) =>{
  return async (dispatch:Dispatch)=>{
      await updatedepartmentService(id,data).then((res:any)=>{
          if(res.errors){
              onError(res);
              return false
          }else{
            dispatch(updatedepartment(res))
            onSuccess(res)
          }
      },
        (error: any)=>{
          dispatch({type:'CODE_ERROR',error});
        });
      }
}

export const deletedepartmentAction= (id:string,onSuccess:(res:any)=>void,onError:(res:any)=>void)=>{
  return (dispatch: Dispatch<AnyAction>)=>{
    deletedepartmentService(id).then((res:any)=>{
            dispatch(deletedepartment(res))
            onSuccess(res)
      },
      (error: any)=>{
        dispatch({type:'CODE_ERROR',error});
      });

  }
}




