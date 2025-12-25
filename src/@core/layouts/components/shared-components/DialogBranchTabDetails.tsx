/* eslint-disable react/jsx-key */
// ** React Imports
import { useState, ChangeEvent, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Radio from '@mui/material/Radio'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Avatar Component
import CustomAvatar from 'src/@core/components/mui/avatar'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux/store'

let sBranch:any={value:''};
const DialogBranchTabDetails = (props:any) => {

  const authuser = useSelector((state: RootState) => state.auth.getuserprofile)
  const auth=authuser?.session;
  const [value, setValue] = useState<string>('')
  const [branchs,setBranchs]=useState<any>('')
  const {setBranchId,setdesableSubmit}=props

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
    setBranchId(event.target.value)
    setdesableSubmit(false)

  }


  const branchsList:any= props?.branchs && props.branchs.filter((branch: { id: any })=>branch.id!=auth.targetBranchId);

  useEffect(()=>{
    //if(props?.branchs){
      setBranchs(branchsList);
   // }
  },[])


  const handleFilter=(val:any)=>{
    const {value}=val.target;
    sBranch={...sBranch,value:value}
    setValue('')
    setBranchId('')
    setdesableSubmit(true)
    const matchingBranchs = branchsList && branchsList.filter(function(branch:any) {
      const regex = new RegExp(sBranch?.value, "i");

return regex.test(branch.displayName);
    })
      setBranchs(matchingBranchs)
  }


  return (
    <div>
      <TextField fullWidth sx={{ mb: 4 }} label='Rechercher Surccusale' placeholder='Rechercher Surccusale' onKeyUp={handleFilter}/>
      {/*<Typography variant='h6' sx={{ mb: 4 }}>
        Category
      </Typography>*/}
      <Box sx={{ mb: 8 }}>
        {
          branchs && branchs.slice(0,4).map((item:any,i:any)=>{
             return(
              <Box key={i}
                /*onClick={() => {
                  setValue(item.id)
                  setdesableSubmit(false)
                }*/
                sx={{ mb: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin='light' color='info' variant='rounded' sx={{ mr: 3, width: 48, height: 48 }}>
                    <Icon icon='mdi:briefcase-outline' />
                  </CustomAvatar>
                  <div>
                    <Typography>{item?.displayName}</Typography>
                    <Typography variant='caption'>{item?.description}</Typography>
                  </div>
                </Box>
                <Radio value={item.id} onChange={handleChange} checked={value === item.id} />
              </Box>
             )
          })
        }

      </Box>
    </div>
  )
}

export default DialogBranchTabDetails
