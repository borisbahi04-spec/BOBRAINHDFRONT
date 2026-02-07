/* eslint-disable newline-before-return */
import { returnResponse } from "src/myCustomFunctions";
import HttpService from "../HttpService";
import queryString from "query-string";

const statUri='stat/interventions';
const relations="";

export const  statsService = ()=>{
  const Url  = `${statUri}`;

const http = new HttpService();
return returnResponse(http.getData(Url))
}




export const getSearchstatsService = (stat:any)=>{
 const query=queryString.stringify({
    relations:relations,
    where:JSON.stringify([
      /*...(stat.value ?[{value:stat.value}]:[]),
      ...(stat.requesttypeId ?[{value:stat.requesttypeId,attribute:'requesttype.id'}]:[]),
      ...(stat.stationId ?[{value:stat.stationId,attribute:'station.id'}]:[]),
      ...(stat.createdById ?[{value:stat.createdById,attribute:'createdBy.userId'}]:[]),
      ...(stat.status ?[{value:stat.status,attribute:'status'}]:[]),
      ...(stat.priority ?[{value:stat.priority,attribute:'priority'}]:[]),*/
      ...(stat.startdate ?[{value:stat.startdate,attribute:'createdAt',type :'greaterThanOrEquals'}]:[]),
      ...(stat.enddate ?[{value:[stat.startdate,stat.enddate],attribute:'createdAt',type :'between'}]:[]),

    ])
  },{arrayFormat: 'index',skipNull:true,skipEmptyString:true})
  const Url=`${statUri}?${query}`
  const http = new HttpService();
  console.log('URL STAT SERVICE:',Url)
  return returnResponse(http.getData(Url))
}



