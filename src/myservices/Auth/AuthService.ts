/* eslint-disable newline-before-return */

import { returnResponse } from 'src/myCustomFunctions';
import HttpService from '../HttpService';



export const RST_LoginService = async(credentials:any)=>{
    const http = new HttpService();
    const loginUrl = "auth/login";
    return await returnResponse(http.postDatalogin(credentials,loginUrl))
}

export const RST_SwitchBranchService = async(branchId:string)=>{
  const http = new HttpService();
  const switchBranchnUrl = `auth/switch/${branchId}`;
  return await returnResponse(http.postData({},switchBranchnUrl))
}



export const  RST_UserProfileService = ()=>{
    const signUpUrl  = "auth/user";
    const http = new HttpService();
    return returnResponse(http.getData(signUpUrl))
}



export const RST_ChangeMyPasswordService = (data:any)=>{
    const http = new HttpService();
    const uri = "auth/change-password";
    return returnResponse(http.postData(data,uri))
}

