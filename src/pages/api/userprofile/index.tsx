import { getBackendUrl } from "src/utils/backendUrl";

export default async function handler(req:any,res:any) {
  const token = req.headers['x-user-claims'];
  const response = await fetch(`${getBackendUrl()}/auth/user`,{
    headers: {
      'x-user-claims': `${token}`,
    }});
    console.log("userprofile")
    console.log(response)

  const userprofile = await response.json();
  res.status(200).json(userprofile);

}
