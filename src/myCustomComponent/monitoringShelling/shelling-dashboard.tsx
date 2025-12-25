// ✅ Composant principal : ProductionDashboard.tsx
import { Card, CardContent, Divider, Grid, List, ListItem, Table, TableBody, TableHead, Typography } from "@mui/material";
import ShellingHistorySection from "./shelling-history-section";
import ShellingAlertSection from "./shelling-alert-section";

/*import CookingSection from "./CookingSection";
import ShellingSection from "./ShellingSection";
import PeelingSection from "./PeelingSection";
import GradingSection from "./GradingSection";
import PackingSection from "./PackingSection";*/

export default function ShellingDashboard(props) {
  const {socket,shellinghistoryData,shellingalertData}=props
  {/*<Grid container spacing={2} padding={2}>
      <Grid item xs={12} sm={12} md={12}><ShellingAlertSection socket={socket} shellingalertData={shellingalertData} /></Grid>
      <Grid item xs={12} sm={12} md={12}><ShellingHistorySection socket={socket} shellinghistoryData={shellinghistoryData} /></Grid>
    </Grid>*/}

return (

    <Grid container spacing={2}>
      {/* Partie gauche : détails */}
      <Grid item xs={12} md={5}>
        <Card>
          <CardContent>
            <Typography variant="h6">Détails de l’activité Shelling</Typography>
            <Divider />
            {/* Infos générales */}
            <List>
              <ListItem>🕒 Date : {}</ListItem>
              <ListItem>🏭 Machine : {}</ListItem>
              <ListItem>🔁 Ligne : {}</ListItem>
              <ListItem>🧱 Branche : {}</ListItem>
            </List>
            <Divider />
            {/* Tableau de performances */}
            <Table size="small">
              <TableHead>FFF</TableHead>
              <TableBody>FFF</TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
