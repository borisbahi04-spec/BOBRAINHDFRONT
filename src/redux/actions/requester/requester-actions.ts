/* eslint-disable newline-before-return */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { AnyAction } from '@reduxjs/toolkit';
import { getSession, useSession } from 'next-auth/react';
import { Dispatch } from 'redux';
import { createrequesterService, deleterequesterService, getSearchrequestersService, updaterequesterService, requestersService, postStatusrequesterService, getByIdrequestersService } from 'src/myservices/requester/requester-service';
import { createrequester, deleterequester, getsearchrequesters, getrequesters, updaterequester, getSingledatarequester } from 'src/redux/reducers/requester/requester-reducer';

export const requestersAction = (onSuccess?:(res?:any)=>void, onError?:(res?:any)=>void)=>{

  return (dispatch:Dispatch)=>{
          requestersService().then((res:any)=>{
          if(res.errors){
            if(onError){
              onError(res);
            }
          return false;
          }else{
            dispatch(getrequesters(res));
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
export const getByIdrequestersAction = (id:string, onSuccess?:(res?:any)=>void, onError?:(res?:any)=>void)=>{

  return (dispatch:Dispatch)=>{
          getByIdrequestersService(id).then((res:any)=>{
          if(res.errors){
            if(onError){
              onError(res);
            }
          return false;
          }else{
            dispatch(getSingledatarequester(res));
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




export const postStatusrequesterAction = (requesterId:string,status:string,onSuccess:(res:any)=>void, onError:(res:any)=>void)=>{
  return (dispatch:Dispatch)=>{
    postStatusrequesterService(requesterId,status).then((res:any)=>{
          if(res.errors){
              onError(res);
              return false
          }else{
            dispatch(updaterequester(res))
            onSuccess(res)
          }
      },
        (error: any)=>{
          dispatch({type:'CODE_ERROR',error});
        });
      }
}



export  const  getSearchrequestersAction = (value:any,pgquery?:any,onSuccess?:(res:any)=>void, onError?:(res:any)=>void)=>{
return (dispatch:Dispatch)=>{
      getSearchrequestersService(value,pgquery).then((res:any)=>{
          if(res.errors){
            if(onError){
              onError(res)
               return false
            }
          }else{
              dispatch(getsearchrequesters(res));
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

export const createrequesterAction= (credentials:any,onSuccess:(res:any)=>void, onError:(res:any)=>void)=>{
  return (dispatch:Dispatch)=>{
      createrequesterService(credentials).then((res:any)=>{
          if(res.errors){
              onError(res);
              return false
          }else{
              dispatch(createrequester(res))
              onSuccess(res)
          }
      },
        (error:any)=>{
          dispatch({type:'CODE_ERROR',error});
      });

  }
}

//
export const updaterequesterAction = (id:string,data:any,onSuccess:(res:any)=>void,onError:(res:any)=>void) =>{
  return async (dispatch:Dispatch)=>{
      await updaterequesterService(id,data).then((res:any)=>{
          if(res.errors){
              onError(res);
              return false
          }else{
            dispatch(updaterequester(res))
            onSuccess(res)
          }
      },
        (error: any)=>{
          dispatch({type:'CODE_ERROR',error});
        });
      }
}

export const deleterequesterAction= (id:string,onSuccess:(res:any)=>void,onError:(res:any)=>void)=>{
  return (dispatch: Dispatch<AnyAction>)=>{
    deleterequesterService(id).then((res:any)=>{
            dispatch(deleterequester(res))
            onSuccess(res)
      },
      (error: any)=>{
        dispatch({type:'CODE_ERROR',error});
      });

  }
}




