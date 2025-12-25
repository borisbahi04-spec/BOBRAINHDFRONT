// ** React Imports
import { SyntheticEvent } from 'react'

// ** Next Imports

// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ConnectionsTabType } from 'src/@fake-db/types'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import OptionsMenu from 'src/@core/components/option-menu'
import {useRouter } from 'next/router'
import Link from 'next/link'

const Surcussales=(item:any)=>{
  const router = useRouter()

  return(
      <Card sx={{ position: 'relative' }}>
        <OptionsMenu
          iconButtonProps={{ size: 'small', sx: { top: 12, right: 12, position: 'absolute' } }}
          options={[
            'Share Connection',
            'Block Connection',
            { divider: true },
            { text: 'Delete', menuItemProps: { sx: { color: 'error.main' } } }
          ]}
        />
        <CardContent>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <Avatar src={item.avatar} sx={{ mb: 6, width: 100, height: 100 }} />
            <Typography variant='h6'>Netvions1</Typography>
            <Typography sx={{ mb: 6, color: 'text.secondary' }}>{item.designation}</Typography>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              {item.chips &&
                item.chips.map((chip, index) => (
                  <Box
                    href='/second-page'
                    key={index}
                    component={Link}
                    onClick={(e: SyntheticEvent) => e.preventDefault()}
                    sx={{
                      textDecoration: 'none',
                      '&:not(:last-of-type)': { mr: 4 },
                      '& .MuiChip-root': { cursor: 'pointer' }
                    }}
                  >
                    <CustomChip size='small' skin='light' color={chip.color} label={chip.title} />
                  </Box>
                ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button onClick={()=>router.replace('/home')}
                sx={{ mr: 4 }}
                variant={item.isConnected ? 'contained' : 'outlined'}
                startIcon={
                  <Icon
                    fontSize={20}
                    icon={item.isConnected ? 'mdi:account-check-outline' : 'mdi:account-plus-outline'}
                  />
                }
              >
                {item.isConnected ? 'Connected' : 'Connect'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
  )
}

const AddSurcussale=()=>{
  return(
      <Card sx={{ position: 'relative' }}>
        <CardContent>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant={'contained'}
                endIcon={
                  <Icon
                    fontSize={30}
                    icon={'mdi:plus-outline'}
                  />
                }
              >
                Ajouter une Surcussale
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
  )
}

const Connections=({ data }: { data: ConnectionsTabType[] }) => {
  const dt=[{name:'one1'},{name:'one2'},{name:'one3'},{name:'one4'},{name:'one5'},{name:'one6'},{name:'one4'},{name:'one5'},{name:'one6'}]

return (
    <Grid container spacing={6}>
      {dt &&
        Array.isArray(dt) &&
        dt.map((item, index) => {
          return (
            <Grid key={index} item xs={12} sm={4} md={2}>
              <Surcussales item={item}/>
            </Grid>
          )
        })}
        <Grid item xs={12} sm={4} md={2}>
           <AddSurcussale/>
        </Grid>
    </Grid>
  )
}

export default Connections
