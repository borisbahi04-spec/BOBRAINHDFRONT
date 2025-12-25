/* eslint-disable newline-before-return */
import { returnResponse } from "src/myCustomFunctions";
import HttpService from "../HttpService";
import { CreateUserDto, UpdateUserDto } from "src/dto/user/user.dto";
import queryString from "query-string";

const userUri='user';
const relations='role,branch';

export const  RST_UsersService = ()=>{
const http = new HttpService();
const Url  = `${userUri}?relations=${relations}`;
return returnResponse(http.getData(Url))
}


/*
export const RST_getSearchUsersService = (value:string,pgquery:any)=>{
  const Url  = `${userUri}?relations=${relations}&where[0][value]=${value}&page=${pgquery.page}&per_page=${pgquery.per_page}`;
  const http = new HttpService();
  return returnResponse(http.getData(Url))
}*/

export const RST_getSearchUsersService = (sUser:any,pgquery:any)=>{
   const query=queryString.stringify({
    relations:relations,
    where:JSON.stringify([
      ...(sUser.value ?[{value:sUser.value}]:[]),
      ...(sUser.branchId ?[{value:sUser.branchId,attribute:'branch.id'}]:[]),
      ...(sUser.roleId ?[{value:sUser.roleId,attribute:'role.id'}]:[]),
    ])
  },{arrayFormat: 'index',skipNull:true,skipEmptyString:true})
  const Url=`${userUri}?${query}&page=${pgquery.page}&per_page=${pgquery.per_page}`
  const http = new HttpService();
  return returnResponse(http.getData(Url))
}

export const RST_CreateUserService = (data: CreateUserDto)=>{
  const http = new HttpService();
return returnResponse(http.postData(data,userUri))
}

export const RST_UpdateUserService = (id:string, data:UpdateUserDto)=>{
  const http = new HttpService();
  return returnResponse(http.patchDataBy(id,data,userUri))
}


export const RST_DeleteUserService = (id:string)=>{
  const http = new HttpService();
  return returnResponse(http.deleteData(id,userUri))
}

