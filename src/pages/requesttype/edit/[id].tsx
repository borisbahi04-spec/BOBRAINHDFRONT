// Ancienne route conservée : la modification se fait désormais dans une modale de la liste
export const getServerSideProps = async (context: any) => ({
  redirect: { destination: `/requesttype/list?edit=${encodeURIComponent(String(context.query?.id ?? ''))}`, permanent: false }
})

const Redirect = () => null
export default Redirect
