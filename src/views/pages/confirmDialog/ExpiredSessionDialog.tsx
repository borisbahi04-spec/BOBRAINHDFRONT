import React, { useState } from 'react';
import { Modal, Box, Card, CardContent, Typography, Button } from '@mui/material';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

const ExpiredSessionDialog = () => {
  const [open, setOpen] = useState<boolean>(true);
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
  };

  const submitAction = async () => {
    const loginRoute = '/login';
    await signOut({ redirect: false, callbackUrl: loginRoute });
    handleClose();
    router.push(loginRoute);
  };

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          handleClose();
        }
      }}
      aria-labelledby="session-expired-title"
      aria-describedby="session-expired-description"
      closeAfterTransition
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)',
      }}
    >
      <Card
        sx={{
          width: { xs: '90%', sm: 400 },
          p: 3,
          borderRadius: 2,
          boxShadow: 6,
          textAlign: 'center',
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Session Expirée
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Votre session a expiré. Veuillez vous reconnecter.
          </Typography>
          <Box mt={3} display="flex" justifyContent="center">
            <Button variant="contained" color="primary" onClick={submitAction}>
              Se reconnecter
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default ExpiredSessionDialog;
