/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import { GridRowId } from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/redux/store'
import toast from 'react-hot-toast'
import { useContext, useState } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import Icon from 'src/@core/components/icon'
import { ProductDto } from 'src/dto/productDto'
import { EntityAbility, UserAction } from 'src/configs/Action'
import { useRouter } from 'next/router'

interface TableHeaderProps {
  value?: string
  handleFilter: (val: string) => void
  action:string
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value, handleFilter ,action} = props
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter();
  const ability = useContext(AbilityContext)

  const handleAdd = () => {
    // Navigate to a new route with query parameters
    router.push({
      pathname: '/branch/add',
      query: { action: action },
    });
  };


  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <>
      {ability.can(UserAction.Create, EntityAbility.BRANCH) && (
        <Button sx={{ mb: 2 }} variant='contained'  onClick={handleAdd}>
          <Icon icon='mdi:plus' fontSize={20} />
            Ajouter une Surccusale
         </Button>
         )}

      </>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          value={value}
          sx={{ mr: 4, mb: 2 }}
          placeholder='Rechercher'
          onChange={e => handleFilter(e.target.value)}
        />
      </Box>
    </Box>
  )
}

export default TableHeader
