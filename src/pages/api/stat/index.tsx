import { getBackendUrl } from "src/utils/backendUrl";

export default async function handler(req:any,res:any) {
  const token = req.headers[`${process.env.XUSERCLAIMS}`];
      console.log('testborisapi',token);

  const response = await fetch(`${getBackendUrl()}/${process.env.ENTYTYSTATISTIC}/interventions`,{
    headers: {
      'x-user-claims': `${token}`,
    }});

    console.log('testborisapi',response.status);

  if (response.status === 401) {
    // Handle the 401 response here
    res.status(200).json({ data:null });
  } else if (response.ok) {
    const requester = await response.json();
    res.status(200).json(requester);
  } else {
    // Handle other response status codes (e.g., 404, 500) here
  }

}


/*
/*


*/
