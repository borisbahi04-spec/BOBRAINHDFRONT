// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TableContainer from '@mui/material/TableContainer'
import TableCell, { TableCellBaseProps } from '@mui/material/TableCell'
import { translate } from "react-translate"

// ** Configs
import moment from 'moment';

// ** Types
import { SingleInvoiceType } from 'src/types/apps/invoiceTypes'
import { ImgStyled, MyTranslateProductType } from 'src/myCustomFunctions'
import { MyDivider } from 'src/myCustomComponent'
import { useTheme } from '@emotion/react'
import themeConfig from 'src/configs/themeConfig'
import styled from '@emotion/styled'
import Box, { BoxProps } from '@mui/material/Box'

interface Props {
  data: SingleInvoiceType
}

const MUITableCell = styled(TableCell)<TableCellBaseProps>(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  paddingTop: `${theme.spacing(1)} !important`,
  paddingBottom: `${theme.spacing(1)} !important`
}))

const CalcWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const enum sourceType{
 branch="branch",
 supplier="supplier"
}

const PreviewCard = (props: Props) => {
  const theme = useTheme()

  const {data,printref,t}=props




  if (data) {
    return (
      <Card  ref={printref}>
        <CardContent>
          <Grid container>
            <Grid item sm={6} xs={12} sx={{ mb: { sm: 0, xs: 4 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                 <Box sx={{  display: 'flex', alignItems: 'left', marginLeft:-5}}>
                  <ImgStyled src='/images/monlogo.jpg' />
                </Box>
                <Box>
                  <Typography variant='h6' sx={{ mb: 1 }}>
                   {data?.branch?.displayName}
                  </Typography>
                  <Typography variant='body1' sx={{ mb: 1}}>
                    {data?.branch?.address}
                  </Typography>
                  <Typography variant='body2'>{data?.branch?.phoneNumber}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item sm={12} xs={12}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                <Table sx={{ maxWidth: '250px' }}>
                  <TableBody>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='body1'>Commande </Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='body2'> <b>{`#${data?.reference}`}</b></Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='body1'>Date facture:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                          {`${moment(data.date).format("DD/MM/YYYY")}`}
                        </Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                     <MUITableCell>
                        <Typography variant='body1'>Type:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                         <Typography variant='body2'> <b>{data?.source==sourceType.branch?`Interne`:'Externe'}</b></Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                     <MUITableCell>
                        <Typography variant='body1'>Status:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                         <Typography variant='h7'> <b>{data?.status && t(data.status)}</b></Typography>
                      </MUITableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardContent>
          <Grid container>
            <Grid item xs={6} sm={6} sx={{ mb: { lg: 0, xs: 4 } }}>
              <Typography variant='body1' sx={{ mb: 3.5, fontWeight: 600 }}>
                Fournisseur
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                {data?.source=='branch'?data?.sourceBranch?.displayName:data?.sourceSupplier?.displayName}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                {data?.customer?.firstName}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                {data?.customer?.phoneNumber}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                {data.customer?.email? data?.customer?.email:""}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} sx={{ display: 'flex', justifyContent: ['flex-start', 'flex-end'] }}>
              <div>
                <Typography variant='body1' sx={{ mb: 3.5, fontWeight: 600 }}>
                  Demandeur
                </Typography>
                <Typography variant='body2' sx={{ mb: 2 }}>
                {data?.branch && data?.branch?.displayName}
              </Typography>
              </div>
            </Grid>
            {data?.isGlassBundle?
              <Grid item xs={12} sm={12} sx={{ mb: { lg: 0, xs: 4 } }}>
                <Typography variant='body2' sx={{ mb: 2 ,textAlign:'center'}}>
                    Ensemble (verre + monture)
                </Typography>
              </Grid>:''
            }
          </Grid>
        </CardContent>
        <Divider />

        <CardContent>
          <Grid container>
            <Grid item xs={12} sm={12} sx={{ mb: { lg: 0, xs: 4 } }}>
             <Typography variant='body2' sx={{ mb: 3.5, fontWeight: 600 }}>Titre</Typography>
             <Typography variant='body1'> <b>{data?.title && data.title}</b></Typography>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
          <CardContent>
           <Grid container>
            <Grid item xs={12} sm={12} sx={{ mb: { lg: 0, xs: 4 } }}>
             <Typography variant='body2' sx={{ mb: 3.5, fontWeight: 600 }}>Description</Typography>
             <Typography variant='body1'> <b>{data?.description && data.description}</b></Typography>
            </Grid>

          </Grid>
        </CardContent>
        <Divider />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Produit</TableCell>
                <TableCell>Type </TableCell>
                <TableCell>Prix</TableCell>
                <TableCell>Qte</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {
            data?.orderToProducts?.map((item,index)=>{
              console.log("orderToProducts")
              console.log(data.isGlassBundle)

               return(
                <TableRow key={index}>
                  <TableCell>{item?.product.displayName}</TableCell>
                  <TableCell>
                        <Typography sx={{display: '-webkit-box',overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 5,}}variant="body1">
                            {`
                              ${MyTranslateProductType(item?.product?.type)}
                              ${
                                item?.prescription?
                                    '-  [ ' + item?.prescription.glassCharacteristics[0]?.title+' ( '+
                                                          'Axe= '+item?.prescription?.glassCharacteristics[0]?.axis+' ; '+
                                                          'VC= '+item?.prescription?.glassCharacteristics[0]?.cylindricalGlass+' ; '+
                                                          'VS= '+item?.prescription?.glassCharacteristics[0]?.sphericalGlass+' ; '+
                                                          'Add= '+item?.prescription?.glassCharacteristics[0]?.axis+' ) ; '+

                                                          item?.prescription.glassCharacteristics[1]?.title+' ( '+
                                                          'Axe= '+item?.prescription?.glassCharacteristics[1]?.axis+' ; '+
                                                          'VC= '+item?.prescription?.glassCharacteristics[1]?.cylindricalGlass+' ; '+
                                                          'VS= '+item?.prescription?.glassCharacteristics[1]?.sphericalGlass+' ; '+
                                                          'Add= '+item?.prescription?.glassCharacteristics[1]?.axis+' ) ] '
                                    :''
                               }

                               ${
                                item.orderProductToAttributes && item.orderProductToAttributes.length>0?
                                 '-  [' + item?.orderProductToAttributes?.map(t=>" "+t.attribute.displayName+":"+t.value.value +' ; ')+' ] '
                                :''
                                }


                            `}
                       </Typography>
                    </TableCell>

                  <TableCell>{item?.price}</TableCell>
                  <TableCell>{item?.quantity}</TableCell>
                  <TableCell>{((item?.quantity*item?.price).toFixed(0))} FCFA</TableCell>
                </TableRow>
              )})
            }
            </TableBody>
          </Table>
        </TableContainer>
        {data?.payments?.length>0?
        <>

            <MyDivider sectionTitle="Versements"/>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reference</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Montant</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {data?.payments?.map((item,index)=>{
                  return(
                    <TableRow key={index}>
                      <TableCell>{item?.reference}</TableCell>
                      <TableCell> {`${moment(data.date).format("DD/MM/YYYY")}`}</TableCell>
                      <TableCell>{item?.amount}</TableCell>
                    </TableRow>
                  )})
                }
                </TableBody>
              </Table>
            </TableContainer>
         </>:''
         }


      </Card>
    )
  } else {
    return null
  }


}

export default translate("Order")(PreviewCard)
