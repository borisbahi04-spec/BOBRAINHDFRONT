import { Box, Divider, IconButton, LinearProgress, Menu, MenuItem, Typography } from "@mui/material"
import React from "react"
import Icon from 'src/@core/components/icon'
import { OrderStatusEnum, SellingStatusEnum, statusColorMap , sstatusColorSMap, ProductionStatusEnum} from "src/definitions/enum"

type StockMovementIconProps = {
  type: 'input' | 'output';
};
export const bottomBorderStyle = {
  borderBottom: '1px solid lightgray',
};

export const MyDivider=({sectionTitle})=>{
             return(
             <Divider textAlign="center"  sx={{
              border: "1px solid #E6E6E6",
              color: "#666",
              my: 2, // margin top/bottom
            }}>
             <Typography variant="body1" sx={{display: "flex",justifyContent: "center",width: "100%", height: "100%",alignItems: "center"}}> {sectionTitle?sectionTitle:''}</Typography>
            </Divider>
            )
}





export const StockMovementIcon: React.FC<StockMovementIconProps> = ({ type }) => {
  const iconName = type === 'input' ? 'mdi:inbox-arrow-down' : 'mdi:inbox-arrow-up';
  const color = type === 'input' ? 'green' : 'red';

  return (
    <Box>
      <Icon icon={iconName} color={color} width="24" height="24" />
      {/*<span className="text-sm font-medium">
        {type === 'input' ? 'Entrée de stock' : 'Sortie de stock'}
      </span>*/}
    </Box>
  );
};
export const MyDividerForIn=({sectionTitle})=>{
  return(
  <Divider textAlign="center" sx={{ border: "1px solid #E6E6E" }}>
  <Typography variant="body1" sx={{display: "flex",justifyContent: "center",width: "100%", height: "100%",alignItems: "center"}}> {sectionTitle?sectionTitle:''}</Typography>
 </Divider>
 )
}


export const RequiredLabel = ({ text }: { text: string }) => (
  <span>
    {text} <span style={{ color: 'red' }}>*</span>
  </span>
);




interface StatusColorProps {
  status: OrderStatusEnum;
}

interface SStatusColorProps {
  status: SellingStatusEnum;
}

export const getStatusColor = (status: OrderStatusEnum): string => {
  return statusColorMap[status] || '#000'; // noir par défaut
};

export const getSStatusColor = (status: SellingStatusEnum): string => {
  return sstatusColorSMap[status] || '#000'; // noir par défaut
};

export const SStatusColor: React.FC<SStatusColorProps> = ({ status }) => {
  const color = getSStatusColor(status);

return <span style={{ color }}>{status}</span>;
};

export const StatusColor: React.FC<StatusColorProps> = ({ status }) => {
  const color = getStatusColor(status);

return <span style={{ color }}>{status}</span>;
};


export const BasicMenu=(props:any)=>{
  const {filter,onFilterDate,filterValue}=props
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (value) => {
    if(filterValue){
      filterValue(value)
    }
    onFilterDate(value)
    handleClose();
  };

  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Icon icon='mdi:dots-vertical'/>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {filter?.map((dt)=>{
          return (
            <MenuItem onClick={()=>handleSelect(dt)}>{dt}</MenuItem>)}
          )
        }

      </Menu>
    </div>
  );
}


export const BasicYearMenu=(props:any)=>{
  const {filter,onFilterDate,filterValue}=props
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (value) => {
    if(filterValue){
      filterValue(value)
    }
    onFilterDate(value)
    handleClose();
  };

  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Icon icon='mdi:dots-vertical'/>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {filter?.map((dt)=>{
          return (
            <MenuItem onClick={()=>handleSelect(dt.id)}>{dt.value}</MenuItem>)}
          )
        }

      </Menu>
    </div>
  );
}
export const  getProductionStatusLabel=(type: ProductionStatusEnum): string =>{
  return type === ProductionStatusEnum.production ? 'PRODUCTION' : 'DESASSEMBLAGE';
}

export const ReceiveOrderSellingProgressBar = (data) => {
  const { input, output,isForOrder }=data;
  const progress = (parseInt(output)/parseInt(input)) * 100;
  const mes=isForOrder==true?`Récu`:'livré'

return (
    <Box sx={{ width: '40%', mt: 2 }}>
      <LinearProgress variant="determinate" value={progress} />
      <Typography variant="body2" gutterBottom>
        {`${mes} ${output??0} de ${input??0} / ${Math.round(progress)??0}%`}
      </Typography>
    </Box>
  );
};


export const ReceiveOrderSellingProgressBarList = ({ input, output }) => {
  const progress = input > 0 ? (output / input) * 100 : 0;

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <LinearProgress variant="determinate" value={progress} />
      <Typography variant="body2" gutterBottom>
        {`${output} sur ${input}`}
      </Typography>
    </Box>
  );
};
