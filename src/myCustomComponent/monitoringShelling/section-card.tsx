import { Card, CardContent, Typography } from "@mui/material";

export function SectionCard({ icon, title, metrics = [], statusColor = "default" }) {
  return (
    <Card sx={{ borderTop: `6px solid ${statusColor}`, minHeight: 140 }}>
      <CardContent>
        <Typography variant="h6">{icon} {title}</Typography>
        {metrics.map((item, index) => (
          <Typography key={index} variant="body2">{item}</Typography>
        ))}
      </CardContent>
    </Card>
  );
}
