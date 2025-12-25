import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export const requireAuthentication = (handler) => {
  return async (req, res) => {
    // Check if the user is authenticated here
    const session = await getSession( req );

    const isAuthenticated = false;

   /* if (!isAuthenticated) {
      return {
        redirect: {
          destination: '/login',
          permanent: true,
        },
      }
    }*/

    if(!session ||!isAuthenticated){
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      }
    }else{

    return handler(req, res);
  };
};
}
