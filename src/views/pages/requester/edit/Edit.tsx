import AddCard from '../add/AddCard'

/** Modification : réutilise le formulaire de création */
const RequesterEdit = ({ data }: { data: any }) => (data ? <AddCard data={data} /> : null)

export default RequesterEdit
