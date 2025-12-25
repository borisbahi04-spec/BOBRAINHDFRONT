// ✅ Exemple pour CalibrationSection.tsx
import { useEffect, useState } from "react";
import { SectionCard } from "./section-card";

export default function CalibrationSection(props: { socket: any; }) {
  const [data, setData] = useState({ volume: 0, yield: 0 });
 let {socket}=props;
  useEffect(() => {
    socket?.on("calibration_update", (incoming) => setData(incoming));

return () => socket?.off("calibration_update");
  }, []);

  return (
    <SectionCard
      icon="📏"
      title="Calibration"
      metrics={[
        `Volume : ${data.volume} kg`,
        `Rendement : ${data.yield}%`
      ]}
      statusColor="green"
    />
  );
}
