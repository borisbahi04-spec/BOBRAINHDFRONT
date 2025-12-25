// ** MUI Imports
import { Typography, IconButton, Box } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types Import
import { Settings } from 'src/@core/context/settingsContext'

interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
}

const TitlePage = ({ settings }: Props) => {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      {settings.iconPage && (
        <IconButton color="inherit" aria-label="Page Icon">
          <Icon icon={settings.iconPage} />
        </IconButton>
      )}
      {settings.titlePage && (
        <Typography variant="body1" fontSize={25} fontWeight={600}>
          {settings.titlePage}
        </Typography>
      )}
    </Box>
  )
}

export default TitlePage
