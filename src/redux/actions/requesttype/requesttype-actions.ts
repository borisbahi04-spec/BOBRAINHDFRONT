
import { AnyAction } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { createrequesttypeService, deleterequesttypeService, getSearchrequesttypesService, updaterequesttypeService, requesttypesService } from 'src/myservices/requesttype/requesttype-service';
import { createrequesttype, deleterequesttype, getsearchrequesttypes, getrequesttypes, updaterequesttype } from 'src/redux/reducers/requesttype/requesttype-reducer';

export const requesttypesAction = (onSuccess?:(res?:any)=>void, onError?:(res?:any)=>void)=>{

  return (dispatch:Dispatch)=>{
          requesttypesService().then((res:any)=>{
          if(res.errors){
            if(onError){
              onError(res);
            }

return false;
          }else{
            dispatch(getrequesttypes(res));
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



export  const  getSearchrequesttypesAction = (value:string,pgquery?:any,onSuccess?:(res:any)=>void, onError?:(res:any)=>void)=>{
   return (dispatch:Dispatch)=>{
    getSearchrequesttypesService(value,pgquery).then((res:any)=>{
          if(res.errors){
            if(onError){
              onError(res)
               // eslint-disable-next-line newline-before-return
               return false
            }
          }else{
              dispatch(getsearchrequesttypes(res));
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

export const createrequesttypeAction= (credentials:any,onSuccess:(res:any)=>void, onError:(res:any)=>void)=>{
  return (dispatch:Dispatch)=>{
      createrequesttypeService(credentials).then((res:any)=>{
          if(res.errors){
              onError(res);
              return false
          }else{
              dispatch(createrequesttype(res))
              onSuccess(res)
          }
      },
        (error:any)=>{
          dispatch({type:'CODE_ERROR',error});
      });

  }
}

//
export const updaterequesttypeAction = (id:string,data:any,onSuccess:(res:any)=>void,onError:(res:any)=>void) =>{
  return async (dispatch:Dispatch)=>{
      await updaterequesttypeService(id,data).then((res:any)=>{
          if(res.errors){
              onError(res);
              return false
          }else{
            dispatch(updaterequesttype(res))
            onSuccess(res)
          }
      },
        (error: any)=>{
          dispatch({type:'CODE_ERROR',error});
        });
      }
}

export const deleterequesttypeAction= (id:string,onSuccess:(res:any)=>void,onError:(res:any)=>void)=>{
  return (dispatch: Dispatch<AnyAction>)=>{
    deleterequesttypeService(id).then((res:any)=>{
            dispatch(deleterequesttype(res))
            onSuccess(res)
      },
      (error: any)=>{
        dispatch({type:'CODE_ERROR',error});
      });

  }
}




