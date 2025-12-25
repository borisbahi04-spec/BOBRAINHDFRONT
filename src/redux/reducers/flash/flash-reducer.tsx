import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface AuthState {
  actionResponse: any
  data:any
}

// Define the initial state using that type
const initialState: AuthState = {
  actionResponse:'',
  data:''
}

export const flashSlice = createSlice({
  name: 'flash',
  initialState,
  reducers: {
    getflashs:(state, action: PayloadAction<any>) => {
     state.data = action.payload
    },
    getsearchflashs:(state, action: PayloadAction<any>) => {
      state.data = action.payload
    },
    createflash:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },
    updateflash:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },
    deleteflash:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },

  },
})

export const { getflashs,getsearchflashs,createflash,updateflash,deleteflash } = flashSlice.actions

// Other code such as selectors can use the imported `RootState` type
//export const selectCount = (state: RootState) => state.counter.value

export default flashSlice.reducer
