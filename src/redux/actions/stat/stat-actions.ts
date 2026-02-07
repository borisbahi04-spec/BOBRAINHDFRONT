/* eslint-disable newline-before-return */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Dispatch } from 'redux';
import { getSearchstatsService, statsService} from 'src/myservices/stat/stat-service';
import {  getsearchstats, getstats} from 'src/redux/reducers/stat/stat-reducer';

export const statsAction = (onSuccess?:(res?:any)=>void, onError?:(res?:any)=>void)=>{

  return (dispatch:Dispatch)=>{
          statsService().then((res:any)=>{
          if(res.errors){
            if(onError){
              onError(res);
            }
          return false;
          }else{
            dispatch(getstats(res));
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



export  const  getSearchstatsAction = (query:any,onSuccess?:(res:any)=>void, onError?:(res:any)=>void)=>{
return (dispatch:Dispatch)=>{
      getSearchstatsService(query).then((res:any)=>{
          if(res.errors){
            if(onError){
              onError(res)
               return false
            }
          }else{
              dispatch(getsearchstats(res));
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



