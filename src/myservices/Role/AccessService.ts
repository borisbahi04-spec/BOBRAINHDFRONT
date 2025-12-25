/* eslint-disable newline-before-return */
import { returnResponse } from "src/myCustomFunctions";
import HttpService from "../HttpService";

const accessUri=`access`;
const relations="";
export const  RST_AccesssService = ()=>{
  const Url  = accessUri;
const http = new HttpService();
return returnResponse(http.getData(Url))
}


export const RST_getSearchAccesssService = (value:string,pgquery:any)=>{
  const Url  = `${accessUri}?relations=${relations}&where[0][value]=${value}&page=${pgquery.page}&per_page=${pgquery.per_page}`;

  const http = new HttpService();
  return returnResponse(http.getData(Url))
}

export const RST_CreateAccessService = (credentials: object)=>{
  const http = new HttpService();
return returnResponse(http.postData(credentials,accessUri))
}

export const RST_UpdateAccessService = (id:string, data:any)=>{
  const http = new HttpService();
  return returnResponse(http.patchDataBy(id,data,accessUri))
}


export const RST_DeleteAccessService = (id:string)=>{
  const http = new HttpService();
  return returnResponse(http.deleteData(id,accessUri))
}

