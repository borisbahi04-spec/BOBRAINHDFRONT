import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EnhancedTable from './tableStoreList';
import { useEffect } from 'react';


export default function BasicAccordion(props:any) {
  const {selectedBranchs,branchs,data}=props;
  const [rowss, setRowss] = React.useState([]);
  const [userEditBranch, setUserEditBranch] = React.useState([]);




  useEffect(()=>{
    setRowss(branchs?.data)
    if(data){
      setUserEditBranch(data?.branchToUsers)
    }
  },[branchs?.data,data])


return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Surccusarles</Typography>
        </AccordionSummary>
        <AccordionDetails>
              <EnhancedTable selectedBranchs={selectedBranchs} rowss={rowss} userEditBranch={userEditBranch}/>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
