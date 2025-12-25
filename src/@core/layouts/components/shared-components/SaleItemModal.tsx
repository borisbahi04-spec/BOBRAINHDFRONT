// ** React Imports
import { Ref, useState, forwardRef, ReactElement, useEffect } from 'react'

// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import Collapse from '@mui/material/Collapse'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hook Imports
import { useSettings } from 'src/@core/hooks/useSettings'
import { useDispatch, useSelector } from 'react-redux'
import { MenuItemProps } from '@mui/material/MenuItem'

// ** Tab Content Imports
import { CardContent, Grid, TextField, FormControl, FormHelperText, MenuItem, DialogTitle, CardContentProps, GridProps, SelectChangeEvent, InputLabel, Select, ListItemText, Checkbox, OutlinedInput, FormGroup, FormControlLabel, Switch } from '@mui/material'
import { MyDivider } from 'src/myCustomComponent'
import { MyTranslateProductType } from 'src/myCustomFunctions'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, useFieldArray,Controller,useWatch,Control} from 'react-hook-form'
import { styled, alpha } from '@mui/material/styles'
import { RST_getProductByIdAction } from 'src/redux/actions/product/productActions'
import { RootState } from 'src/redux/store'


const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

/*const CustomSelectItem = styled(MenuItem)<MenuItemProps>(({ theme }) => ({
  color: theme.palette.success.main,
  backgroundColor: 'transparent !important',
  '&:hover': { backgroundColor: `${alpha(theme.palette.success.main, 0.1)} !important` }
}))*/



const SaleItemModal = (props) => {
  const {open,handleOpenToggle,
    itemProduct,
    itemsaleToProducts,
    handleIsaleToProductsChange,
    products,
    suppliers,
    attributes,
    attributesvalues,
    treatments,
    glasstypes
  }=props;
  //const products = useSelector((state: RootState) => state.product?.data)
  //const suppliers = useSelector((state: RootState) => state.supplier?.data)

 //const suppliers=supplierstore.data;
 //const glasstypestore = useSelector((state: RootState) => state.glasstype)
 //const glasstypes=glasstypestore.data;
  // ** States
  const [itemPrd, setItemPrd] = useState<boolean>(itemProduct)
  const [hideCharacteristic, setHideCharacteristic] = useState<boolean>(false)
  const [hasOrderchecked, sethasOrderchecked] = useState<boolean>(false)
  const [hidesupplierRef, sethidesupplierRef] = useState<boolean>(false);

  const dispatch=useDispatch()


  // ** Hook
  const { settings } = useSettings()

  // ** Var
  const { direction } = settings

  const handleClose = () => {
    handleOpenToggle(0)
    setHideCharacteristic(false)
    reset()
  }
  yup.addMethod(yup.array, 'unique', function (field, message) {
      return this.test('unique', message, function (array:any) {
        console.log("array000000")
        console.log(array)
        if(!array){
          return true
        }


      const uniqueData = Array.from(
        new Set(array.map((row:any) => row[field]?.toLowerCase())),
      );
      const isUnique = array.length === uniqueData.length;
      if (isUnique) {
        return true;
      }
      const index = array.findIndex(
        (row:any, i:number) => row[field]?.toLowerCase() !== uniqueData[i],
      );
      if (array[index][field] === '') {
        return true;
      }

return this.createError({
        path: `${this.path}.${index}.${field}`,
        message,
      });
    });
  });

  const handleAttributeValueChange = (i:number,event: SelectChangeEvent) => {
    if (event.target.value !=='') {
      setValue(`saleProductToAttributes.${i}.valueId`,event.target.value,{shouldValidate:true})
    }
  }

 const handleTreatmentValueChange = (i:number,event: SelectChangeEvent) => {
    if (event.target.value !==''){
      setValue(`prescription.treatments.${i}.id`,event.target.value,{shouldValidate:true})
    }


  }


  const handleAttributeChange = (i:number,event: SelectChangeEvent) => {
    if (event.target.value !==''){
      setValue(`saleProductToAttributes.${i}.valueId`,'',{shouldValidate:true})
      setValue(`saleProductToAttributes.${i}.attributeId`,event.target.value,{shouldValidate:true})
    }
  }



 const schema = yup.object().shape({
  productId: yup.string().required('Ce champ est obligatoire'),
  price: yup.number().typeError('Vous devez specifier un nombre').min(0, 'Valeur minimum 5 '),
  quantity: yup.number().typeError('vous devez specifier un nombre').min(1,'Valeur minimum 1 '),
  prescription: yup.object().shape({
    glassTypeId:yup.string(),
    note: yup.string(),
    treatments: yup.array().of(
    yup.object().shape({
      id: yup.string().required('Ce champ est obligatoire')
    })).unique('id', 'Cet Traitement est déja présent dans la liste')
    .nullable(),
  }).nullable(),
  hasOrder:yup.boolean(),
  orderSupplierId: yup.string()
  .when('hasOrder', {
      is: true,
      then: yup.string().required('Ce champ est obligatoire')
  }),
  saleProductToAttributes: yup.array().of(
    yup.object().shape({
      attributeId: yup.string().required('Ce champ est obligatoire'),
      valueId: yup.string().required('Ce champ est obligatoire')
    }))
   .unique('attributeId', 'Cet attribut est déja présent dans la liste').nullable(),
})

/*
glassCharacteristics:yup.array().of(
      yup.object().shape({
      id:yup.string(),
      title:yup.string(),
      axis:yup.string().required('Ce champ est obligatoire'),
      cylindricalGlass:yup.string(),
      sphericalGlass:yup.string()
    }) )
*/

const RepeatingContent = styled(Grid)<GridProps>(({ theme }) => ({
  paddingRight: 0,
  display: 'flex',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '& .col-title': {
    top: '-1.5rem',
    position: 'absolute'
  },
  [theme.breakpoints.down('lg')]: {
    '& .col-title': {
      top: '0',
      position: 'relative'
    }
  }
}))




const RepeaterWrapper = styled(CardContent)<CardContentProps>(({ theme }) => ({
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(12),
  '& .repeater-wrapper + .repeater-wrapper': {
    marginTop: theme.spacing(12)
  }
}))

const InvoiceAction = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: theme.spacing(2, 1),
  borderLeft: `1px solid ${theme.palette.divider}`
}))

  const defaultValues = {
      productId:'',
      price:0,
      quantity:0,
      hasOrder:false,
      orderSupplierId:'',
      prescription:{
        glassTypeId:'',
        note: '',
        glassCharacteristics:[{
          //id:'',
          title:'',
          axis:'',
          cylindricalGlass:'',
          sphericalGlass:'',
          add:''

        }],
        treatments:[]
      },

      saleProductToAttributes:[{
        valueId:'',
        attributeId:''
      }]

  }

  /*glassCharacteristics:[{
    id:'',
    title:'',
    axis:'',
    cylindricalGlass:'',
    sphericalGlass:''
  }]*/

/*
 saleProductToAttributes:[{
        valueId:'',
        attributeId:''
      }]
*/
  const {
      handleSubmit,
      reset,
     register,
     control,
     setValue,
     getValues,
     formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const { fields, append, remove } = useFieldArray({
    name: "saleProductToAttributes",
    control
  },)

  const {
    fields: treatmentFields,
    append: treatmentAppend,
    remove: treatmentRemove
  } = useFieldArray({ control, name: "prescription.treatments" });


  const deleteItem = (i: any) => {
    remove(i)
};

const deleteTreatments = (i: any) => {
  treatmentRemove(i)
};


const addNewItem=()=>{
   append({ attributeId:'',valueId:''})
}

const addNewTreatments=()=>{
  treatmentAppend({ id:''})
}

const getProductPrice=(productId:string)=>{
   const _onSuccess=(res)=>{
       console.log("res20236555")
       console.log(res)
       setValue('price',res?.price)
  }
    const _onError=()=>{
      console.log('dfd')
   }
  dispatch(RST_getProductByIdAction(productId,_onSuccess,_onError))

}

const handleProductChange=(e:SelectChangeEvent)=>{
  e.preventDefault()
  setValue('productId',e.target.value,{shouldValidate:true})
  //setValue('saleProductToAttributes',[])
  getProductPrice(e.target.value)
  handleHideCharacteristicProduct(e.target.value)
}


const handleHideCharacteristicProduct=(productId:string)=>{
       if(getSelectedProductType(productId)=='eyeglass_lens'){
        setValue(`prescription.glassCharacteristics.${0}.title`,'OG')
        setValue(`prescription.glassCharacteristics.${1}.title`,'OD')
        setValue('prescription',getValues(`prescription`))
        setValue(`prescription.treatments`,getValues(`prescription.treatments`)?getValues(`prescription.treatments`):[])
        setValue(`saleProductToAttributes`,[])
        setHideCharacteristic(true)
       }else{
        //setValue('prescription',getValues(`prescription`))
        setValue('prescription','')
        setValue(`saleProductToAttributes`,[])
        setHideCharacteristic(false)
       }
}

const handleHideCharacteristicProduct2=(item:any)=>{
  if(getSelectedProductType(item.productId)=='eyeglass_lens'){
   setValue(`prescription.glassCharacteristics.${0}.title`,'OG')
   setValue(`prescription.glassCharacteristics.${1}.title`,'OD')
   setValue('prescription',getValues(`prescription`))
   setValue(`prescription.treatments`,getValues(`prescription.treatments`)?getValues(`prescription.treatments`):[])
   setValue(`saleProductToAttributes`,item.saleProductToAttributes?item.saleProductToAttributes:[])
   setHideCharacteristic(true)
  }else{
   setValue('prescription','')
   setValue(`saleProductToAttributes`,item.saleProductToAttributes?item.saleProductToAttributes:[])
   setHideCharacteristic(false)
  }
}



const getSelectedProductType=(productId:string)=>{
  const filteredObject = products?.find(obj => obj.id === productId);
const type = filteredObject ? filteredObject.type : null;

return type

}


const handlehasOrderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  sethasOrderchecked(event.target.checked);
  setValue('hasOrder', event.target.checked)
  if(hasOrderchecked==false){
    setValue('orderSupplierId',itemsaleToProducts?.orderSupplierId?itemsaleToProducts.orderSupplierId:"");
      sethidesupplierRef(true)
  }else{
    setValue('orderSupplierId','');

    sethidesupplierRef(false)
  }
}



const filteredproductAttributeIds:any = products && products.filter(obj => obj.id === getValues('productId')).reduce(function(acc, curr) {
  return acc.concat(curr.attributes);
}, []).map(obj => obj.id);


  const onSubmit = (submitdata:any,e:any) =>{
    e.preventDefault()
    if(!submitdata.orderSupplierId)submitdata.orderSupplierId= null
    if(!submitdata.glassTypeId)submitdata.glassTypeId= null


    handleIsaleToProductsChange(itemProduct,submitdata)
    handleClose()
   }



   useEffect(()=>{

    if(itemsaleToProducts){

        setValue('productId',itemsaleToProducts?.productId)
        setValue('price',itemsaleToProducts?.price)
        setValue('quantity',itemsaleToProducts?.quantity)
        //if(itemsaleToProducts?.prescription){
          setValue('prescription',itemsaleToProducts?.prescription)
        //}
      setValue('hasOrder',itemsaleToProducts?.hasOrder)

     if(itemsaleToProducts.hasOrder){
      sethasOrderchecked(true)
      sethidesupplierRef(true)
      }
      else{
        sethasOrderchecked(false)
        sethidesupplierRef(false)
      }
        setValue('orderSupplierId',itemsaleToProducts?.orderSupplierId??'')
        handleHideCharacteristicProduct2(itemsaleToProducts)
    }
    setValue(`prescription.glassCharacteristics.${0}.title`,'OG')
    setValue(`prescription.glassCharacteristics.${1}.title`,'OD')
    setItemPrd(itemProduct+1)
   },[itemProduct, itemsaleToProducts, setValue])
     console.log("products2020")
     console.log(products)

  return (
    <Card>

      <Dialog
        fullWidth
        open={open}
        sx={{overflowY: 'scroll'}} disableScrollLock={false}
        maxWidth='md'
        onClose={handleClose}
        onBackdropClick={handleClose}
        TransitionComponent={Transition}
      >
        <DialogTitle>
         <IconButton size='small' onClick={handleClose} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
            <Icon icon='mdi:close' />
          </IconButton>
            <Typography variant='h5' sx={{ mb: 3 }}>
              Produit {itemPrd}
            </Typography>
            <Typography variant='body2'>Detail produit {`${itemPrd}`}</Typography>
        </DialogTitle>
      <DialogContent sx={{ px: { xs: 8, sm: 15 }, py: { xs: 8, sm: 12.5 }, position: 'relative' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <Grid container>
                <Grid item  lg={6} xs={12} md={4} sm={12} sx={{ mb: { lg: 0, xs: 4 } }}>
                  <FormControl fullWidth sx={{ mb: 2 }} >
                      <Controller
                          name={`productId`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onBlur } }) => (
                          <TextField
                            fullWidth
                            select
                            label='Produit'
                            size='small'
                            sx={{ m: 2, }}
                            value={value}
                            onBlur={onBlur}
                            onChange={(e)=>handleProductChange(e)}>
                              {products !== undefined &&
                              products && products.map((data:any,index:any) =>{
                              return  <MenuItem value={data.id} key={index}>{`${data.displayName}(${MyTranslateProductType(data.type)})`}</MenuItem>
                                })
                              }
                        </TextField>
                        )}
                      />
                      {errors?.productId && <FormHelperText sx={{ color: 'error.main' }}>{errors?.productId?.message}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item lg={4} xs={12} md={4} sm={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                          <TextField
                            size='small'
                            label='Prix Unitaire'
                            type='number'
                            {...register('price')}
                            placeholder='0'
                            InputProps={{ inputProps: { min: 0 } }}
                            error={errors?.price?true :false}
                            helperText={errors?.price?.message}
                            sx={{ m: 2, }}
                            />
                </Grid>
                <Grid item lg={2} xs={12} md={4} sm={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Quantité'
                    type='number'
                    {...register('quantity')}
                    placeholder='0'
                    InputProps={{ inputProps: { min: 0 } }}
                    error={errors?.quantity?true :false}
                    helperText={errors?.quantity?.message}
                    sx={{ m: 2, }}
                    />
                </Grid>
              </Grid>


              {hideCharacteristic?
               <>
                  <MyDivider sectionTitle=""/>
                  <Grid container>
                    <Grid item xs={12} lg={12} md={12} sm={12} sx={{ mb: { lg: 0, xs: 4 } }}>
                      <Grid container  direction="column" alignItems="center" justifyContent="center">
                      <FormGroup>
                        <FormControlLabel  control={
                        <Switch
                        name="hasOrder"
                        size="medium"
                        checked={hasOrderchecked}
                        onChange={handlehasOrderChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                        />} label="Verre de commande" />
                      </FormGroup>
                      </Grid>
                    </Grid>
                   <Grid item xs={hidesupplierRef?6:12} md={hidesupplierRef?6:12} sm={12} sx={{ mb: { lg: 0, xs: 4 } }}>
                    <Grid container>
                        <Grid item xs={12} md={12} sm={12} >
                          <FormControl fullWidth sx={{ mb: 2 }}>
                            <Controller
                                name='prescription.glassTypeId'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onBlur,onChange } }) => (
                                <TextField
                                  select
                                  sx={{ m:4}}
                                  value={value}
                                  label='Type de verre'
                                  size='small'
                                  onBlur={onBlur}
                                  onChange={onChange}
                                >
                                    {glasstypes !== undefined &&
                                      glasstypes && glasstypes?.map((data:any,index:any) =>(
                                        <MenuItem value={data.id}  key={index}>{`${data.displayName} `}</MenuItem>
                                      ))
                                    }
                              </TextField>
                              )}
                            />
                            {errors.prescription?.glassTypeId && <FormHelperText sx={{ color: 'error.main' }}>{errors.prescription?.glassTypeId.message}</FormHelperText>}
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                  {hidesupplierRef?
                    <>
                      <Grid item xs={6} md={6} sm={12} sx={{ mb: { lg: 0, xs: 4 } }}>
                      <Grid container>
                          <Grid item xs={12} md={12} sm={12} >
                            <FormControl fullWidth sx={{ mb: 2 }}>
                              <Controller
                                  name='orderSupplierId'
                                  control={control}
                                  rules={{ required: true }}
                                  render={({ field: { value, onBlur,onChange } }) => (
                                  <TextField
                                    select
                                    sx={{ m:4}}
                                    value={value}
                                    label='Fournisseur'
                                    size='small'
                                    onBlur={onBlur}
                                    onChange={onChange}
                                  >
                                      {suppliers !== undefined &&
                                        suppliers && suppliers?.map((data:any,index:any) =>(
                                          <MenuItem value={data.id}  key={index}>{`${data.displayName} `}</MenuItem>
                                        ))
                                      }
                                </TextField>
                                )}
                              />
                              {errors.orderSupplierId && <FormHelperText sx={{ color: 'error.main' }}>{errors.orderSupplierId.message}</FormHelperText>}
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                    </>:null
                  }
                 </Grid>
                <MyDivider sectionTitle="Prescription"/>
                <Grid container>
                  <Grid item  lg={12} md={12} xs={12} >
                      <Grid container sx={{ py: 4, width: '100%', pr: { lg: 0, xs: 4 } }}>
                        <Grid item lg={2} md={2} xs={6} sx={{ px: 2, my: { lg: 0, xs: 4 } }}>
                        <Typography sx={{m:4}}>
                              OD
                        </Typography>
                        </Grid>
                        <Grid item lg={2} xs={6} md={2} sm={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                          <TextField
                            fullWidth
                            size='small'
                            label='Axe'
                            //type='number'
                            {...register(`prescription.glassCharacteristics.${1}.axis`)}
                            error={errors?.prescription?.glassCharacteristics?.[1]?.axis?true :false}
                            helperText={errors?.prescription?.glassCharacteristics?.[1]?.axis?.message}
                            sx={{ m: 2, }}
                            />
                        </Grid>
                        <Grid item lg={3} xs={6} md={3} sm={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                            <TextField
                              fullWidth
                              size='small'
                              label='Verre cylindrique'
                              {...register(`prescription.glassCharacteristics.${1}.cylindricalGlass`)}
                              error={errors?.prescription?.glassCharacteristics?.[1]?.cylindricalGlass?true :false}
                              helperText={errors?.prescription?.glassCharacteristics?.[1]?.cylindricalGlass?.message}
                              sx={{ m: 2, }}
                              />
                        </Grid>
                        <Grid item lg={3} xs={6} md={3} sm={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                            <TextField
                              fullWidth
                              size='small'
                              label='Verre sphérique'
                              {...register(`prescription.glassCharacteristics.${1}.sphericalGlass`)}
                              error={errors?.prescription?.glassCharacteristics?.[1]?.sphericalGlass?true :false}
                              helperText={errors?.prescription?.glassCharacteristics?.[1]?.sphericalGlass?.message}
                              sx={{ m: 2, }}
                              />
                        </Grid>
                        <Grid item lg={2} xs={6} md={2} sm={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                            <TextField
                              fullWidth
                              size='small'
                              label='Add'
                              {...register(`prescription.glassCharacteristics.${1}.add`)}
                              error={errors?.prescription?.glassCharacteristics?.[1]?.add?true :false}
                              helperText={errors?.prescription?.glassCharacteristics?.[1]?.add?.message}
                              sx={{ m: 2, }}
                              />
                        </Grid>
                      </Grid>
                    </Grid>
                  <Grid item  lg={12} md={12} xs={12} >
                      <Grid container sx={{ py: 4, width: '100%', pr: { lg: 0, xs: 4 } }}>
                        <Grid item lg={2} md={2} xs={6} sx={{ px: 2, my: { lg: 0, xs: 4 } }}>
                        <Typography sx={{m:4}}>
                              OG
                        </Typography>
                        </Grid>
                        <Grid item lg={2} xs={6} md={2} sm={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                          <TextField
                            fullWidth
                            size='small'
                            label='Axe'
                            //type='number'
                            {...register(`prescription.glassCharacteristics.${0}.axis`)}
                            error={errors?.prescription?.glassCharacteristics?.[0]?.axis?true :false}
                            helperText={errors?.prescription?.glassCharacteristics?.[0]?.axis?.message}
                            sx={{ m: 2, }}
                            />
                        </Grid>
                        <Grid item lg={3} xs={6} md={3} sm={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                            <TextField
                              fullWidth
                              size='small'
                              label='Verre cylindrique'
                              {...register(`prescription.glassCharacteristics.${0}.cylindricalGlass`)}
                              error={errors?.prescription?.glassCharacteristics?.[0]?.cylindricalGlass?true :false}
                              helperText={errors?.prescription?.glassCharacteristics?.[0]?.cylindricalGlass?.message}
                              sx={{ m: 2, }}
                              />
                        </Grid>
                        <Grid item lg={3} xs={6} md={3} sm={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                            <TextField
                              fullWidth
                              size='small'
                              label='Verre sphérique'
                              {...register(`prescription.glassCharacteristics.${0}.sphericalGlass`)}
                              error={errors?.prescription?.glassCharacteristics?.[0]?.sphericalGlass?true :false}
                              helperText={errors?.prescription?.glassCharacteristics?.[0]?.sphericalGlass?.message}
                              sx={{ m: 2, }}
                              />
                        </Grid>
                        <Grid item lg={2} xs={6} md={2} sm={12} sx={{ px: 4, my: { lg: 0, xs: 4 } }}>
                            <TextField
                              fullWidth
                              size='small'
                              label='Add'
                              {...register(`prescription.glassCharacteristics.${0}.add`)}
                              error={errors?.prescription?.glassCharacteristics?.[0]?.add?true :false}
                              helperText={errors?.prescription?.glassCharacteristics?.[0]?.add?.message}
                              sx={{ m: 2, }}
                              />
                        </Grid>
                      </Grid>
                  </Grid>

                </Grid>
                <MyDivider sectionTitle="Traitements"/>
                <RepeaterWrapper >
                {treatmentFields?.map((field, i) => {
                const Tag = i === 0 ? Box : Collapse

                return(
                    <Tag key={field.id} className='repeater-wrapper' {...(i !== 0 ? { in: true } : {})}>
                      <Grid container  >
                        <RepeatingContent item xs={12}>
                          <Grid container sx={{ py: 4, width: '100%', pr: { lg: 0, xs: 4 } }}>
                            <Grid item lg={12} md={12} xs={12} sx={{ px: 2, my: { lg: 0, xs: 4 } }}>
                              <Typography
                                variant='body2'
                                className='col-title'
                                sx={{ fontWeight: '600', mb: { md: 2, xs: 0 } }}
                              >
                                {`Traitement ${i+1}`}
                              </Typography>
                              <FormControl fullWidth sx={{ mb: 2 }} >
                                <Controller
                                    name={`prescription.treatments.${i}.id`}
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onBlur } }) => (
                                    <TextField
                                      fullWidth
                                      select
                                      size='small'
                                      sx={{ m: 2, }}
                                      value={value}
                                      onBlur={onBlur}
                                      onChange={(e)=>handleTreatmentValueChange(i,e)}>
                                        {treatments !== undefined &&
                                          treatments.map((data:any,index:any) =>{
                                          return  <MenuItem value={data.id} key={index}>{`${data.displayName}`}</MenuItem>
                                        })
                                    }
                                  </TextField>
                                  )}
                                />
                                {errors?.prescription?.treatments?.[i]?.id && <FormHelperText sx={{ color: 'error.main' }}>{errors?.prescription?.treatments?.[i]?.id?.message}</FormHelperText>}
                              </FormControl>
                            </Grid>

                          </Grid>
                          <InvoiceAction>
                            <IconButton  size='small' onClick={()=>deleteTreatments(i)}>
                              <Icon icon='mdi:close' fontSize={20} />
                            </IconButton>
                          </InvoiceAction>
                        </RepeatingContent>
                      </Grid>
                    </Tag>
                  )
                })}

              <Grid item xl={12} xs={12}>
                  <Typography variant='body2' color='red' textAlign='center' sx={{ mb: 1,mt:1 }}>
                        {errors && errors?.prescription?.treatments?.message}
                  </Typography>
              </Grid>
                 { treatmentFields.length < 2 &&
                  <Grid container sx={{ mt: 4 }}>
                    <Grid item xs={12} sx={{ px: 0 }}>
                      <Button
                        size='small'
                        variant='contained'
                        startIcon={<Icon icon='mdi:plus' fontSize={20} />}
                        onClick={addNewTreatments}>
                        Ajouter un nouveau Traitement
                      </Button>
                    </Grid>
                  </Grid>
                }
                </RepeaterWrapper>
                </>
                :null
                }












              <MyDivider sectionTitle="Attributs du produit associés à des valeurs"/>
              <RepeaterWrapper >
              {fields?.map((field, i) => {

              const Tag = i === 0 ? Box : Collapse

               return(
                  <Tag key={field.id} className='repeater-wrapper' {...(i !== 0 ? { in: true } : {})}>
                    <Grid container  >
                      <RepeatingContent item xs={12}>
                        <Grid container sx={{ py: 4, width: '100%', pr: { lg: 0, xs: 4 } }}>
                          <Grid item lg={6} md={6} xs={12} sx={{ px: 2, my: { lg: 0, xs: 4 } }}>
                            <Typography
                              variant='body2'
                              className='col-title'
                              sx={{ fontWeight: '600', mb: { md: 2, xs: 0 } }}
                            >
                              {`Attribut ${i+1}`}
                            </Typography>
                            <FormControl fullWidth sx={{ mb: 2 }} >
                              <Controller
                                  name={`saleProductToAttributes.${i}.attributeId`}
                                  control={control}
                                  rules={{ required: true }}
                                  render={({ field: { value, onBlur } }) => (
                                  <TextField
                                    fullWidth
                                    select
                                    size='small'
                                    sx={{ m: 2, }}
                                    value={value}
                                    onBlur={onBlur}
                                    onChange={(e)=>handleAttributeChange(i,e)}>
                                      {attributes !== undefined &&
                                        attributes && attributes.filter(obj => {
                                          return filteredproductAttributeIds.includes(obj.id);
                                        }).map((data:any,index:any) =>{
                                        return  <MenuItem value={data.id} key={index}>{`${data.displayName}`}</MenuItem>
                                      })
                                  }
                                </TextField>
                                )}
                              />
                              {errors?.saleProductToAttributes?.[i]?.attributeId && <FormHelperText sx={{ color: 'error.main' }}>{errors?.saleProductToAttributes?.[i]?.attributeId?.message}</FormHelperText>}
                            </FormControl>
                          </Grid>
                          <Grid item lg={6} md={6} xs={12} sx={{ px: 2, my: { lg: 0, xs: 4 } }}>
                            <Typography
                              variant='body2'
                              className='col-title'
                              sx={{ fontWeight: '600', mb: { md: 2, xs: 0 } }}
                            >
                              {`Valeur ${i+1}`}
                            </Typography>
                            <FormControl fullWidth sx={{ mb: 2 }} >
                              <Controller
                                  name={`saleProductToAttributes.${i}.valueId`}
                                  control={control}
                                  rules={{ required: true }}
                                  render={({ field: { value, onBlur } }) => (
                                  <TextField
                                    fullWidth
                                    select
                                    size='small'
                                    sx={{ m: 2, }}
                                    value={value}
                                    onBlur={onBlur}
                                    onChange={(e)=>handleAttributeValueChange(i,e)}>
                                     {
                                     attributesvalues !== undefined &&
                                     attributesvalues.map((data:any,index:any) =>{
                                        if(getValues(`saleProductToAttributes.${i}.attributeId`)==data.attributeId){
                                          return  <MenuItem value={data.id} key={index}>{`${data.value}`}</MenuItem>
                                        }
                                     })
                                    }
                                </TextField>
                                )}
                              />
                              {errors?.saleProductToAttributes?.[i]?.valueId && <FormHelperText sx={{ color: 'error.main' }}>{errors?.saleProductToAttributes?.[i]?.valueId?.message}</FormHelperText>}
                            </FormControl>
                          </Grid>
                        </Grid>
                        <InvoiceAction>
                          <IconButton  size='small' onClick={()=>deleteItem(i)}>
                            <Icon icon='mdi:close' fontSize={20} />
                          </IconButton>
                        </InvoiceAction>
                      </RepeatingContent>
                    </Grid>
                  </Tag>
                )
              })}

             <Grid item xl={12} xs={12}>
                <Typography variant='body2' color='red' textAlign='center' sx={{ mb: 1,mt:1 }}>
                       {errors && errors?.saleProductToAttributes?.message}
                </Typography>
             </Grid>
                  <Grid container sx={{ mt: 4 }}>
                    <Grid item xs={12} sx={{ px: 0 }}>
                      <Button
                        size='small'
                        variant='contained'
                        startIcon={<Icon icon='mdi:plus' fontSize={20} />}
                        onClick={addNewItem}>
                        Ajouter un nouvel attribut
                      </Button>
                    </Grid>
                  </Grid>
              </RepeaterWrapper>
            </CardContent>
            <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Button fullWidth variant='contained' type='submit' sx={{ mb: 3.5 }} >
                    Valider
                  </Button>
                </CardContent>
              </Card>
           </Grid>

             </Grid>
            </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default SaleItemModal

