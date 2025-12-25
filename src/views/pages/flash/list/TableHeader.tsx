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

interface TableHeaderProps {
  value?: string
  data:any
  selectedRows: GridRowId[]
  handleFilter: (val: string) => void
  handleAddFlash:(val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { data,value, selectedRows, handleFilter,handleAddFlash } = props
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
      <>

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
