// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2 }}>
        {`© ${new Date().getFullYear()}, Developpé `}
        <Box component='span' sx={{ color: 'error.main' }}>
          ❤️
        </Box>
        {` par `}
        <Link target='_blank' href='https://www.linkedin.com/in/boris-bahi-6782139a/'>
          Bahi Boris
        </Link>

      </Typography>
 
    </Box>
  )
}

export default FooterContent
