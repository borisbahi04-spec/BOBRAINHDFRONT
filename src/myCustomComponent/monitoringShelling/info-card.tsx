import { Box, Typography } from "@mui/material";

export function InfoCard({ icon, title, metrics = [], statusColor = "default" }) {
  return (
      <Box>
        <Typography variant="body2">{icon} {title}</Typography>
        {metrics.map((item, index) => (
          <Typography key={index} variant="body2">{item}</Typography>
        ))}
      </Box>
  );
}
