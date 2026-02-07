import { getBackendUrl } from "src/utils/backendUrl";

export default async function handler(req:any,res:any) {
  const token = req.headers['x-user-claims'];
  const relations="role,branch,department,branchToUsers";

  const response = await fetch(`${getBackendUrl()}/${process.env.ENTITYUSER}/${req.query?.id}?relations=${relations}`,{
    headers: {
      'x-user-claims': `${token}`,
    }});



  if (response.status === 401) {
    // Handle the 401 response here
    res.status(200).json({ data:null });
  } else if (response.ok) {
    const user = await response.json();
    res.status(200).json(user);
  } else {
    // Handle other response status codes (e.g., 404, 500) here
  }
}

