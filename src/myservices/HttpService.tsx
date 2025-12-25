import { store } from "src/redux/store";
import { getBackendPublicUri, getBackendUrl } from "src/utils/backendUrl";




export const URLREFRESH='auth/refreshToken';
export const URLLOGIN="/login";
export const GLOBALTOKEN="token";
export const RELOADPAGE="reloadpage";


export const DELAYREFRESHTOKEN=5000; //3minutes;


export const apiroute=getBackendUrl();

export default class HttpService{
    baseUrl = getBackendUrl()
    publicUrl =getBackendPublicUri();

    _token = store.getState().auth._token;
     token = this._token;

    postDatalogin = async(item:any,added_url:any)=>{

        const requestOptions = this.postRequestOptionsWithoutToken(item);

return fetch(this.baseUrl+"/"+added_url,requestOptions).then(response=>
            response.json()
        )
    }

    postData = async(item:object,added_url:string)=>{
      const requestOptions = this.postRequestOptions(this.token,item);

return fetch(this.publicUrl+"/"+added_url,requestOptions).then(response=>{
        return response.json()
        } )
    }







    putDataBy = async(id:string,item:object,added_url:string)=>{
        const requestOptions = this.putRequestOptions(this.token,item);

return fetch(this.baseUrl+"/"+added_url+"/"+id,requestOptions).then(response=>response.json())
    }

    patchDataBy = async(id:string,item:object,added_url:string)=>{

        const requestOptions = this.patchRequestOptions(this.token,item);

return fetch(this.publicUrl+"/"+added_url+"/"+id,requestOptions).then(response=>response.json())
    }

    patchData = async(item:object,added_url:string)=>{
      const requestOptions = this.patchRequestOptions(this.token,item);

return fetch(this.baseUrl+"/"+added_url,requestOptions).then(response=>response.json())
  }

  patchSimple = async(added_url:string)=>{
    const requestOptions = this.patchRequestOptions(this.token,{});

return fetch(this.baseUrl+"/"+added_url,requestOptions).then(response=>response.json())
}

    patchDataByMT = async(id:string,item:object,added_url:string)=>{
        const requestOptions = this.patchRequestOptionsMT(this.token,item);

return fetch(this.publicUrl+"/"+added_url+"/"+id,requestOptions).then(response=>response.json())
    }



    getData=async(added_url?:string)=>{
        const requestOptions=this.getRequestOptions(this.token);

return fetch (`${this.publicUrl}/${added_url}`,requestOptions).then(response=>
            response.json()
         )
    }

    getDataAsBuffer = async (added_url?: string) => {
      const requestOptions = this.getRequestOptions(this.token);

      return fetch(`${this.publicUrl}/${added_url}`, requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

return response.arrayBuffer(); // ou .blob() selon ton usage
        });
    };


    getSocketData=async()=>{
      const requestOptions=this.getRequestOptions(this.token);

return await fetch (`${this.publicUrl}`,requestOptions).then(response=>
          response.json()
       )
  }




    postDataWithoutToken = async(item:object,added_url:string)=>{
        const requestOptions = this.postRequestOptionsWithoutToken(item);

return fetch(this.baseUrl+"/"+added_url,requestOptions).then(response=>
              response.json()
              )
    }

    postDataMT = async(item:FormData,added_url:string)=>{
        const requestOptions = this.postRequestOptionsMT(this.token,item);

return fetch(this.publicUrl+"/"+added_url,requestOptions).then(response=>
              response.json()
              )
    }

    deleteData = async(id:string,added_url:string)=>{
        const requestOptions = this.deleteRequestOptions(this.token);

        return fetch(this.publicUrl+"/"+added_url+"/"+id,requestOptions).then(response=>{
          return response
        })
    }

    deleteSimple = async(added_url:string)=>{
      const requestOptions = this.deleteRequestOptions(this.token);

      return fetch(this.publicUrl+"/"+added_url,requestOptions).then(response=>{
        return response
      })
  }


    postRequestOptionsWithoutToken=(item:any)=>{
        const requestOptions={
            method:'POST',
            headers:{
                'Content-type':'application/json',
            },
            body:JSON.stringify(item)
        }

return requestOptions;
    }

    getRequestOptions=(token?:any)=>{
        const requestOptions={
            method:'GET',
            headers:{
              'Content-type':'application/json',
              'x-user-claims': `${token}`,
            }
        }

return requestOptions;
    }

getDataBy=async(id:string,added_url:string)=>{
      const requestOptions=this.getRequestOptions(this.token);
      const baseUrl =`${this.publicUrl}/${added_url}/${id}`

return fetch(baseUrl,requestOptions).then(response=>
          response.json()
       )
  }

    putRequestOptions=(token:any,item:object)=>{
        const requestOptions={
            method:'PUT',
            headers:{
                 'x-user-claims': `${token}`,
                'Content-type':'application/json',

                //'Access-Control-Allow-Origin':'*',
                //"Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            },
            body:JSON.stringify(item)
        }

return requestOptions;
    }


    patchRequestOptions=(token:string,item:object)=>{
        const requestOptions={
            method:'PATCH',
            headers:{
                'x-user-claims': `${token}`,
                'Content-type':'application/json',
            },
            body:JSON.stringify(item)
        }

return requestOptions;
    }


    postRequestOptions=(token:string,item:object)=>{
        const requestOptions={
            method:'POST',
            headers:{
                'x-user-claims': `${token}`,
                'Content-type':'application/json',
                'Access-Control-Allow-Origin':'*'

            },
            body:JSON.stringify(item)
        }

return requestOptions;
    }

    postRequestOptionsMT=(token:any,item:any)=>{
        const requestOptions={
            method:'POST',
            headers:{
              'x-user-claims':`${token}`,
            },
            body:item
        }

return requestOptions;
    }

    deleteRequestOptions=(token:any)=>{
        const requestOptions={
            method:'DELETE',
            headers:{
                'x-user-claims': `${token}`,
                'Content-type':'application/json',
            }
        }

return requestOptions;
    }

    patchRequestOptionsMT=(token:any,item:any)=>{


        const requestOptions={
          method:'PATCH',
          headers:{
            'x-user-claims': `${token}`,
          },
          body:item
      }

return requestOptions;
  }










}

