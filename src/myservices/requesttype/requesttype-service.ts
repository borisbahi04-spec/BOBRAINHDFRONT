/* eslint-disable newline-before-return */
import { returnResponse } from "src/myCustomFunctions";
import HttpService from "../HttpService";

const requesttypeUri='requesttype';
const relations='requester';

export const  requesttypesService = ()=>{
  const Url  = `${requesttypeUri}?relations=${relations}`;

const http = new HttpService();
return returnResponse(http.getData(Url))
}


export const getSearchrequesttypesService = (value:string,pgquery:any)=>{
  const Url  = `${requesttypeUri}?relations=${relations}&where[0][value]=${value}&page=${pgquery.page}&per_page=${pgquery.per_page}`;
  const http = new HttpService();
  return returnResponse(http.getData(Url))
}


export const createrequesttypeService = (credentials: object)=>{
  const http = new HttpService();
return returnResponse(http.postData(credentials,requesttypeUri))
}

export const updaterequesttypeService = (id:string, data:any)=>{
  const http = new HttpService();
  return returnResponse(http.patchDataBy(id,data,requesttypeUri))
}


export const deleterequesttypeService = (id:string)=>{
  const http = new HttpService();
  return returnResponse(http.deleteData(id,requesttypeUri))
}

