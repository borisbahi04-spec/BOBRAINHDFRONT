import { getBackendUrl } from "src/utils/backendUrl";

export default async function handler(req:any,res:any) {
  const token = req.headers[`${process.env.XUSERCLAIMS}`];
  const relations="accessToRoles";
  const response = await fetch(`${getBackendUrl()}/role/${req.query?.id}?relations=${relations}`,{
    headers: {
      'x-user-claims': `${token}`,
    }});


  if (response.status === 401) {
    // Handle the 401 response here
    res.status(200).json({ data:null });
  } else if (response.ok) {
    const role = await response.json();
    res.status(200).json(role);
  } else {
    // Handle other response status codes (e.g., 404, 500) here
  }
}

