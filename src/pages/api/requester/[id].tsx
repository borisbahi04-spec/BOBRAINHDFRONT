import { getBackendUrl } from "src/utils/backendUrl";

export default async function handler(req:any,res:any) {
  const token = req.headers[`${process.env.XUSERCLAIMS}`];
const relations="station,requesttype,branch,labAgent,operator,createdBy,approvedBy,rejectedBy,closedBy,cancelledBy,treatedBy";

  const response = await fetch(`${getBackendUrl()}/${process.env.ENTITYREQUESTER}/${req.query?.id}?relations=${relations}`,{
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
    // toujours répondre (sinon la requête reste pendante)
    const body = await response.json().catch(() => ({}))
    res.status(response.status).json({ errors: body?.errors ?? [body?.message ?? 'Erreur'], ...body })
  }
}

