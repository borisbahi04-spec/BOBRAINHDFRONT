import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface AuthState {
  actionResponse: any
  data:any
  destinationbranchdata:any
}

// Define the initial state using that type
const initialState: AuthState = {
  actionResponse:'',
  data:'',
  destinationbranchdata:''
}

export const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    getbranchs:(state, action: PayloadAction<any>) => {
     state.data = action.payload
    },
    getdestinationbranchs:(state, action: PayloadAction<any>) => {
      state.destinationbranchdata = action.payload
     },

    getsearchbranchs:(state, action: PayloadAction<any>) => {
      state.data = action.payload
    },
    createbranch:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },
    updatebranch:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },
    deletebranch:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },

  },
})

export const { getbranchs,getdestinationbranchs,getsearchbranchs,createbranch,updatebranch,deletebranch } = branchSlice.actions

// Other code such as selectors can use the imported `RootState` type
//export const selectCount = (state: RootState) => state.counter.value

export default branchSlice.reducer
