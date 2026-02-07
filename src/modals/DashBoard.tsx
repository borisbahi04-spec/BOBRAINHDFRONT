import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import DashboardComponent from 'src/myCustomComponent/dashboardComponent2';
import { Box } from '@mui/material';
import {useTranslate } from "react-translate"
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DashBoardDialog=(props)=> {
  let {open,handleOpenToggle,t}=props
  const handleClose = () => {
    handleOpenToggle(false);
  };
  const translate= useTranslate("common");


  return (
    <div>
      <Dialog
        //fullScreen
        maxWidth={'xl'}
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'fixed'}}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h4" component="div" >
               Tableau de Bord Général
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{marginTop:18}}>
            <DashboardComponent t={translate} />
        </Box>
      </Dialog>
    </div>
  );
}
export default DashBoardDialog;
