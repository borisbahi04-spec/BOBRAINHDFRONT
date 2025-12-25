/* eslint-disable newline-before-return */
import { returnResponse } from "src/myCustomFunctions";
import HttpService from "../HttpService";

const flashUri='flash';

export const  RST_FlashsService = ()=>{
const http = new HttpService();
return returnResponse(http.getData(flashUri))
}


export const RST_getSearchFlashsService = (value:string,pgquery:any)=>{
  const Url=`${flashUri}?where[0][value]=${value}&page=${pgquery.page}&per_page=${pgquery.per_page}`

  const http = new HttpService();
  return returnResponse(http.getData(Url))
}

export const RST_CreateFlashService = (credentials: object)=>{
  const http = new HttpService();
return returnResponse(http.postData(credentials,flashUri))
}

export const RST_UpdateFlashService = (id:string, data:any)=>{
  const http = new HttpService();
  return returnResponse(http.patchDataBy(id,data,flashUri))
}

export const RST_getUniqueFlashService = (sflash:any)=>{
  const Url=`${flashUri}/getunique?firstName=${sflash?.firstName}&phoneNumber=${sflash?.phoneNumber??null}`
  const http = new HttpService();
  return returnResponse(http.getData(Url))
}

export const RST_DeleteFlashService = (id:string)=>{
  const http = new HttpService();
  return returnResponse(http.deleteData(id,flashUri))
}

