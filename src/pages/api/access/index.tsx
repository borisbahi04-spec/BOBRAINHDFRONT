import { getBackendUrl } from "src/utils/backendUrl";

export default async function handler(req:any,res:any) {
  const token = req.headers['x-user-claims'];
  const response = await fetch(`${getBackendUrl()}/access`,{
    headers: {
      'x-user-claims': `${token}`,
    }});
  console.log('response status',response.status);
  if (response.status === 401) {
    // Handle the 401 response here
    res.status(200).json({ data:null });
  } else if (response.ok) {
    const access = await response.json();
    res.status(200).json(access);
  } else {
    // Handle other response status codes (e.g., 404, 500) here
  }

}


/*
/*


*/
