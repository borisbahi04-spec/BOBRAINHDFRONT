import { Chip } from "@mui/material";
import Icon from 'src/@core/components/icon'

type ChipColor = 'success' | 'error' | 'warning' | 'info' | 'default'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const STATUS_MAP: Record<
  string,
  { label: string; color: ChipColor ,  icon?: string // nom de l’icône MDI
     }
> = {
  SERIAL_CONNECTED: {
    label: 'Port Série connectée',
    color: 'success',
    icon: 'mdi:lan-connect'
  },
  SERIAL_DISCONNECTED: {
    label: 'Port Série déconnectée',
    color: 'error',
    icon: 'mdi:lan-disconnect'
  },
  DISPLAY_ON: {
    label: 'Affichage ON',
    color: 'info',
    icon: 'mdi:monitor'
  },
  DISPLAY_OFF: {
    label: 'Afficheur éteint',
    color: 'error',
    icon: 'mdi:monitor-off'
  },
  SERVICE_SHUTDOWN: {
    label: 'Service arrêté',
    color: 'error',
    icon: 'mdi:power'
  },
  WEIGHT_OK: {
    label: 'Poids valide',
    color: 'success',
    icon: 'mdi:scale'
  },
  WEIGHT_NOT_OK: {
    label: 'Poids non valide',
    color: 'warning',
    icon: 'mdi:scale'
  }
}

interface StatusChipProps {
  value?: string
}



export const StatusFlashChip = ({ value }: StatusChipProps) => {
  const status = STATUS_MAP[value ?? '']

  return (
      <Chip
      size="small"
      label={status?.label ?? value ?? '—'}
      color={status?.color ?? 'default'}
      icon={status?.icon ? <Icon icon={status.icon} /> : undefined}
      sx={{ fontWeight: 600 }}
    />
  )
}
