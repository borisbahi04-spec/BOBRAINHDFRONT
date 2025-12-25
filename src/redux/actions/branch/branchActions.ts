
import { AnyAction } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { RST_branchsService, RST_CreatebranchService, RST_DeletebranchService, RST_getSearchbranchsService, RST_UpdatebranchService } from 'src/myservices/Branch/BranchService';
import { createbranch, deletebranch, getbranchs, getsearchbranchs, updatebranch } from 'src/redux/reducers/Branch/BranchReducer';


export const RST_branchsAction = (onSuccess?:(res?:any)=>void, onError?:(res?:any)=>void)=>{

  return (dispatch:Dispatch)=>{
          RST_branchsService().then((res:any)=>{
          if(res.errors){
            if(onError){
              onError(res);
            }
          return false;
          }else{
            dispatch(getbranchs(res));
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



export  const  RST_getSearchbranchsAction = (value:string,pgquery:any,onSuccess?:(res:any)=>void, onError?:(res:any)=>void)=>{
   return (dispatch:Dispatch)=>{
    RST_getSearchbranchsService(value,pgquery).then((res:any)=>{
          if(res.errors){
            if(onError){
              onError(res)
               return false
            }
          }else{
              dispatch(getsearchbranchs(res));
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

export const RST_CreatebranchAction= (credentials:any,onSuccess:(res:any)=>void, onError:(res:any)=>void)=>{
  return (dispatch:Dispatch)=>{
      RST_CreatebranchService(credentials).then((res:any)=>{
          if(res.errors){
              onError(res);
              return false
          }else{
              dispatch(createbranch(res))
              onSuccess(res)
          }
      },
        (error:any)=>{
          dispatch({type:'CODE_ERROR',error});
      });

  }
}

//
export const RST_UpdatebranchAction = (id:string,data:any,onSuccess:(res:any)=>void,onError:(res:any)=>void) =>{
  return async (dispatch:Dispatch)=>{
      await RST_UpdatebranchService(id,data).then((res:any)=>{
          if(res.errors){
              onError(res);
              return false
          }else{
            dispatch(updatebranch(res))
            onSuccess(res)
          }
      },
        (error: any)=>{
          dispatch({type:'CODE_ERROR',error});
        });
      }
}

export const RST_DeletebranchAction= (id:string,onSuccess:(res:any)=>void,onError:(res:any)=>void)=>{
  return (dispatch: Dispatch<AnyAction>)=>{
    RST_DeletebranchService(id).then((res:any)=>{
          if(res.errors){
              onError(res);
              return false
          }else{
            dispatch(deletebranch(res))
            onSuccess(res)
          }
      },
      (error: any)=>{
        dispatch({type:'CODE_ERROR',error});
      });

  }
}




