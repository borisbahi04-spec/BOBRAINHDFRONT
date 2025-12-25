// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useContext } from 'react'

// ** Icon Imports
import { EntityAbility, UserAction } from 'src/configs/Action'
import { AbilityContext } from 'src/layouts/components/acl/Can'

interface TableHeaderProps {
  value?: string
  toggle: () => void
  handleFilter: (val: any) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, toggle} = props
  const ability = useContext(AbilityContext)

  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <span >
      </span>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      {ability.can(UserAction.Create, EntityAbility.BRANCH) && (
        <Button sx={{ mb: 2 }} onClick={toggle} variant='contained'>
             Ajouter une surccusale
        </Button>
        )}
        <TextField
          size='small'
          sx={{ ml: 4, mb: 2 }}
          placeholder='Rechercher une surccusale'
          onChange={e => handleFilter(e.target.value)}
        />

      </Box>
    </Box>
  )
}

export default TableHeader
