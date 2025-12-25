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
import { EntityAbility, UserAction } from 'src/configs/Action'
import { Typography } from '@mui/material'

interface StockTableHeaderProps {
  value?: string
  data:any
  selectedRows: GridRowId[]
  handleFilter: (val: string) => void
}

const StockTableHeader = (props: StockTableHeaderProps) => {
  // ** Props
 const [nvalue,setNValue]=useState('Actions')
  const { data,value, selectedRows, handleFilter } = props
  const dispatch = useDispatch<AppDispatch>()
  const ability = useContext(AbilityContext)

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
      <strong variant='body1'>Etat de stock</strong>
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

export default StockTableHeader
