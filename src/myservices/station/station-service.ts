/* eslint-disable newline-before-return */
import { returnResponse } from "src/myCustomFunctions";
import HttpService from "../HttpService";

const stationUri='station';
const relations='requester';

export const  stationsService = ()=>{
  const Url  = `${stationUri}?relations=${relations}`;

const http = new HttpService();
return returnResponse(http.getData(Url))
}


export const getSearchstationsService = (value:string,pgquery:any)=>{
  const Url  = `${stationUri}?relations=${relations}&where[0][value]=${value}&page=${pgquery.page}&per_page=${pgquery.per_page}`;
  const http = new HttpService();
  return returnResponse(http.getData(Url))
}


export const createstationService = (credentials: object)=>{
  const http = new HttpService();
return returnResponse(http.postData(credentials,stationUri))
}

export const updatestationService = (id:string, data:any)=>{
  const http = new HttpService();
  return returnResponse(http.patchDataBy(id,data,stationUri))
}


export const deletestationService = (id:string)=>{
  const http = new HttpService();
  return returnResponse(http.deleteData(id,stationUri))
}

