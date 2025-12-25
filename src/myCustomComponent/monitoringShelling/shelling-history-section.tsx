import { useEffect, useState } from 'react';
import HistoryTable from './history-table-card';

export default function ShellingHistorySection(props) {
  const {socket,shellinghistoryData}=props;
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
    title="Décorticage"
    rows={shellinghistoryData}
    statusColor={shellinghistoryData > 0 ? 'orange' : 'green'}
  />
  );
}
