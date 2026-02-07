/* eslint-disable newline-before-return */
import { returnResponse } from "src/myCustomFunctions";
import HttpService from "../HttpService";

const departmentUri='department';
const relations='requester';

export const  departmentsService = ()=>{
  const Url  = `${departmentUri}?relations=${relations}`;

const http = new HttpService();
return returnResponse(http.getData(Url))
}


export const getSearchdepartmentsService = (value:string,pgquery:any)=>{
  const Url  = `${departmentUri}?relations=${relations}&where[0][value]=${value}&page=${pgquery.page}&per_page=${pgquery.per_page}`;
  const http = new HttpService();
  return returnResponse(http.getData(Url))
}


export const createdepartmentService = (credentials: object)=>{
  const http = new HttpService();
return returnResponse(http.postData(credentials,departmentUri))
}

export const updatedepartmentService = (id:string, data:any)=>{
  const http = new HttpService();
  return returnResponse(http.patchDataBy(id,data,departmentUri))
}


export const deletedepartmentService = (id:string)=>{
  const http = new HttpService();
  return returnResponse(http.deleteData(id,departmentUri))
}

