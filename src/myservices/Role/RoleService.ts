/* eslint-disable newline-before-return */
import { returnResponse } from "src/myCustomFunctions";
import HttpService from "../HttpService";

const roleUri='role';
const relations='accessToRoles';

export const  RST_RolesService = ()=>{
  const Url  = `${roleUri}?relations=${relations}`;

const http = new HttpService();
return returnResponse(http.getData(Url))
}


export const RST_getSearchRolesService = (value:string,pgquery:any)=>{
  const Url  = `${roleUri}?relations=${relations}&where[0][value]=${value}&page=${pgquery.page}&per_page=${pgquery.per_page}`;
  const http = new HttpService();
  return returnResponse(http.getData(Url))
}


export const RST_CreateRoleService = (credentials: object)=>{
  const http = new HttpService();
return returnResponse(http.postData(credentials,roleUri))
}

export const RST_UpdateRoleService = (id:string, data:any)=>{
  const http = new HttpService();
  return returnResponse(http.patchDataBy(id,data,roleUri))
}


export const RST_DeleteRoleService = (id:string)=>{
  const http = new HttpService();
  return returnResponse(http.deleteData(id,roleUri))
}

