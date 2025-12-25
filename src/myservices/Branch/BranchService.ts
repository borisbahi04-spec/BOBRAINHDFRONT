/* eslint-disable newline-before-return */
import { returnResponse } from "src/myCustomFunctions";
import HttpService from "../HttpService";

const branchUri='branch';

export const  RST_branchsService = ()=>{
const http = new HttpService();
return returnResponse(http.getData(branchUri))
}


export const RST_getSearchbranchsService = (value:string,pgquery:any)=>{
  const Url=`${branchUri}?where[0][value]=${value}&page=${pgquery.page}&per_page=${pgquery.per_page}`

  const http = new HttpService();
  return returnResponse(http.getData(Url))
}

export const RST_CreatebranchService = (credentials: object)=>{
  const http = new HttpService();
return returnResponse(http.postData(credentials,branchUri))
}

export const RST_UpdatebranchService = (id:string, data:any)=>{
  const http = new HttpService();
  return returnResponse(http.patchDataBy(id,data,branchUri))
}


export const RST_DeletebranchService = (id:string)=>{
  const http = new HttpService();
  return returnResponse(http.deleteData(id,branchUri))
}

