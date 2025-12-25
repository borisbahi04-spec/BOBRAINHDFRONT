import { useEffect, useState } from 'react';
import HistoryTable, { SectionTableWithColumns } from './history-table-card';

export default function ShellingAlertSection(props) {
  let {socket,shellingalertData}=props;
  const [data, setData] = useState({
    machines: 0,
    alerts: 0,
    volume: 0,
  });

  useEffect(() => {
    socket?.on('shelling_update', (incoming) => {
      setData(incoming);
    });

    return () => {
      socket?.off('shelling_update');
    };
  }, []);

  return (
    <HistoryTable
    icon="⚙️"
    title="Alert"
    rows={shellingalertData}
    statusColor={shellingalertData > 0 ? 'orange' : 'green'}
  />
  );
}
