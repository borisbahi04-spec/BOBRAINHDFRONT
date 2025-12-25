// ** Demo Components Imports
import { getSession } from 'next-auth/react';
import { EntityAbility, UserAction } from 'src/configs/Action';
import ExpiredSessionDialog from 'src/views/pages/confirmDialog/ExpiredSessionDialog';
import Preview from 'src/views/pages/flash/preview/Preview';
// ** Styled Component

const FlashPreview = (props: { data:any}) => {

  const {data}=props;

  return (
    data?
    <Preview data={data}/>
    :
    <ExpiredSessionDialog/>
   )

}


FlashPreview.acl = {
  action:UserAction.Read,
  subject:EntityAbility.ORDER
}

FlashPreview.authGuard = true


export async function getServerSideProps(context: {req?: any; }) {
  const { req} = context;
  const { id } = context.query;


 const session = await getSession({ req });
  try{
  const {token}=session?.user;

    //const targetBranchId=session?.user.session.targetBranchId;
    const flashedit = await fetch(`${process.env.PUBLIC_URL}/${process.env.ENTITYFLASH}/${id}`, {
      headers: {
        'x-user-claims': `${token}`,
      },
    });

    const flasheditResponse:any = await flashedit.json();

  if(!flasheditResponse || flasheditResponse.errors){
      return {redirect: {
        destination: '/login',
        permanent: false,
    }
  }}


return {
    props: {
      data:flasheditResponse
    },
  }
} catch (e) {
  return {
      redirect: {
          destination: '/login',
          permanent: false,
      }
  };
}
}
export default FlashPreview
