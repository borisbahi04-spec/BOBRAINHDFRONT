import { getBackendUrl } from "src/utils/backendUrl";

export default async function handler(req:any,res:any) {
  const token = req.headers[`${process.env.XUSERCLAIMS}`];
  const relations='';

  const response = await fetch(`${getBackendUrl()}/${process.env.ENTITYBRANCH}?relations=${relations}&page=${process.env.PAGE_DEFAULT}&per_page=${process.env.PERPAGE_DEFAULT}`,{
      headers: {
        'x-user-claims': `${token}`,
      }});
    if (response.status === 401) {
      // Handle the 401 response here
      res.status(200).json({ data:null });
    } else if (response.ok) {
          const branchs = await response.json();
          res.status(200).json(branchs);
    } else {
      // Handle other response status codes (e.g., 404, 500) here
    }


}
