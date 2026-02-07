// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import { useRouter } from 'next/router'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useContext } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'


const PreviewActions = ({data,handlePrint}) => {
  const router = useRouter()
  const ability = useContext(AbilityContext)


  return (
    <Card>
      <CardContent>
      {/*data?
          <Button  fullWidth  target='_blank' sx={{ mb: 3.5 }}
            variant='contained'
            startIcon={<Icon icon='mdi:printer-eye'/>}
            onClick={handlePrint}>
            Imprimer le reçu
          </Button>
       :"" */}
        <Button  fullWidth color='error' target='_blank' sx={{ mb: 3.5 }} variant='contained' onClick={() => router.back()} startIcon={<Icon icon='mdi:back' />} >
          Retour
        </Button>
      </CardContent>
    </Card>
  )
}

export default PreviewActions
