// Ancienne route conservée : la création se fait désormais dans une modale de la liste
export const getServerSideProps = async () => ({ redirect: { destination: '/station/list?new=1', permanent: false } })

const Redirect = () => null
export default Redirect
