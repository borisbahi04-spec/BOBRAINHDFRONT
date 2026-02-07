/* eslint-disable newline-before-return */
import { returnResponse } from "src/myCustomFunctions";
import HttpService from "../HttpService";
import queryString from "query-string";

const requesterUri='requester';
const relations="station,requesttype,branch,createdBy,approvedBy,rejectedBy,closedBy,cancelledBy,treatedBy,user";

export const  requestersService = ()=>{
  const Url  = `${requesterUri}?relations=${relations}`;

const http = new HttpService();
return returnResponse(http.getData(Url))
}




export const getSearchrequestersService = (requester:any,pgquery:any)=>{
 const query=queryString.stringify({
    relations:relations,
    where:JSON.stringify([
      ...(requester.value ?[{value:requester.value}]:[]),
      ...(requester.requesttypeId ?[{value:requester.requesttypeId,attribute:'requesttype.id'}]:[]),
      ...(requester.stationId ?[{value:requester.stationId,attribute:'station.id'}]:[]),
      ...(requester.createdById ?[{value:requester.createdById,attribute:'createdBy.userId'}]:[]),
      ...(requester.status ?[{value:requester.status,attribute:'status'}]:[]),
      ...(requester.priority ?[{value:requester.priority,attribute:'priority'}]:[]),
      ...(requester.startdate ?[{value:requester.startdate,attribute:'createdAt',type :'greaterThanOrEquals'}]:[]),
      ...(requester.enddate ?[{value:[requester.startdate,requester.enddate],attribute:'createdAt',type :'between'}]:[]),

    ])
  },{arrayFormat: 'index',skipNull:true,skipEmptyString:true})
  const Url=`${requesterUri}?${query}&page=${pgquery.page}&per_page=${pgquery.per_page}`
  const http = new HttpService();
  return returnResponse(http.getData(Url))
}


export const getByIdrequestersService = (id:string)=>{
  const Url  = `${requesterUri}/${id}?relations=${relations}`;
  const http = new HttpService();
  return returnResponse(http.getData(Url))
}

export const postStatusrequesterService = (requesterId:string,status:string)=>{
  const http = new HttpService();
  const added_url=`${requesterUri}/${requesterId}/statusupdate/${status}`
return returnResponse(http.postData({remark:'ras'},added_url))
}


export const createrequesterService = (credentials: object)=>{
  const http = new HttpService();
return returnResponse(http.postData(credentials,requesterUri))
}

export const updaterequesterService = (id:string, data:any)=>{
  const http = new HttpService();
  return returnResponse(http.patchDataBy(id,data,requesterUri))
}


export const deleterequesterService = (id:string)=>{
  const http = new HttpService();
  return returnResponse(http.deleteData(id,requesterUri))
}

