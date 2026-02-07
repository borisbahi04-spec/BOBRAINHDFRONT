import { getBackendUrl } from "src/utils/backendUrl";

export default async function handler(req:any,res:any) {
  const token = req.headers[`${process.env.XUSERCLAIMS}`];
  const relations="requester";
  const response = await fetch(`${getBackendUrl()}/${process.env.ENTITYREQUESTTYPE}?relations=${relations}&page=${1}&per_page=${25}`,{
    headers: {
      'x-user-claims': `${token}`,
    }});

  if (response.status === 401) {
    // Handle the 401 response here
    res.status(200).json({ data:null });
  } else if (response.ok) {
    const roles = await response.json();
    res.status(200).json(roles);
  } else {
    // Handle other response status codes (e.g., 404, 500) here
  }

}


/*
/*


*/
