// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Custom Components Imports

// ** Custom Components Imports
import { Card, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { AppDispatch, RootState, store } from 'src/redux/store'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RST_ProductsAction, RST_getSearchProductsAction } from 'src/redux/actions/product/productActions'
import StockTableHeader from './StockTableHeader'



export type StockProduit = {
  name: string
  availableStock: number
}

interface CellType {
  row: any
}

const defaultColumns = (t)=>[
  {
    flex: 0.1,
    field: 'displayName',
    minWidth: 100,
    headerName: 'Produit',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{`${row.name}`}</Typography>
  },
  {
    flex: 0.1,
    field: 'type',
    minWidth: 100,
    headerName: 'Type',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{t(`${row?.type}`)}</Typography>
  },
  {
    flex: 0.1,
    field: 'stock',
    minWidth: 100,
    headerName: 'Stock',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{`${row?.availableStock?? 0}`}</Typography>
  }

]

const MyColumns=(t)=>{
return [
  ...defaultColumns(t),

  ]
}
const TableStock = ({t,stock,handleFilter}) => {
  const [pageSize, setPageSize] = useState<number>(3)
  const [selectedRows, setSelectedRows] = useState([])

return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <StockTableHeader data={store} selectedRows={selectedRows} handleFilter={handleFilter}/>
          <DataGrid
            autoHeight
            pagination
            rows={stock && stock}
            columns={MyColumns(t)}
            disableSelectionOnClick
            pageSize={Number(pageSize)}
            onSelectionModelChange={rows =>{ setSelectedRows(rows)}}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default TableStock;
