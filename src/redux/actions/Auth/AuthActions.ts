/* eslint-disable newline-before-return */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Dispatch } from 'redux';
import {RST_ChangeMyPasswordService, RST_LoginService, RST_SwitchBranchService, RST_UserProfileService} from '../../../myservices/Auth/AuthService';
import {login,userProfile,_token} from '../../reducers/Auth/AuthReducer';

export const SessionAction =(token:any,onSuccess?:any,)=>{
    return (dispatch :Dispatch)=>{
      dispatch(_token(token));
      if(onSuccess){
        onSuccess()
       }
    }
}

export const RST_LoginAction =  (credentials:any,onSuccess:any,onError:any="")=>{
  return (dispatch :Dispatch)=>{
    RST_LoginService(credentials).then((res)=>{
          if(res.errors){
              if(onError!="") onError(res);
              return false
          }
          if(!res.accessToken){
              if(onError!="")
              onError({message:"Erreur Technique"});
              return false
          }
              dispatch(login(res));
              setTimeout(()=>{
                  onSuccess(res);
              })
      },
      error=>{
          dispatch({type:'CODE_ERROR',error});
      })
  }
}


export const RST_SwitchBranchAction =  (branchId:string,onSuccess:any,onError:any="")=>{
  return (dispatch :Dispatch)=>{
    RST_SwitchBranchService(branchId).then((res)=>{
          if(res.errors){
              if(onError!="") onError(res);
              return false
          }
              dispatch(userProfile(res));
              setTimeout(()=>{
                  onSuccess(res);
              })
      },
      error=>{
          dispatch({type:'CODE_ERROR',error});
      })
  }
}

export const RST_UserProfileAction = (onSuccess?:(res?:any)=>void, onError?:(res?:any)=>void)=>{
  return (dispatch:Dispatch)=>{
         RST_UserProfileService().then((res:any)=>{
          if(res.errors){
            if(onError){
              onError(res);
            }
          return false;
          }else{
          dispatch(userProfile(res));
          if(onSuccess){
            onSuccess(res)
          }
          }
      },
      error=>{
          dispatch({type:'CODE_ERROR',error});
      });

  }
}





export const RST_ChangeMyPasswordAction = (data:any,onSuccess:(res:any)=>void,onError?:(res?:any)=>void) =>{
    return async (dispatch:Dispatch)=>{
        await RST_ChangeMyPasswordService(data).then((res)=>{
            if(res.errors){
              if(onError){
                onError(res);
              }
              return false
            }
            onSuccess(res)
        },
        error=>{
        dispatch({type:'CODE_ERROR',error});
        });
        }
}





