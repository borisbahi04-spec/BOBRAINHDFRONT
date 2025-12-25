import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface AuthState {
  details: any
  actionResponse: any
  data:any
}

// Define the initial state using that type
const initialState: AuthState = {
  actionResponse:'',
  data:'',
  details:''
}

export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getusers:(state, action: PayloadAction<any>) => {
      state.data = action.payload
    },
    getdetails:(state, action: PayloadAction<any>) => {
      state.details = action.payload
    },
    getsearchusers:(state, action: PayloadAction<any>) => {
      state.data = action.payload
    },
    createuser:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },
    updateuser:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },
    changerStatususer:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },
    affecttorestaurantuser:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },
    removerestaurantuser:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },

    resetPassworduser:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },
    deleteuser:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },

  },
})

export const { getusers,getsearchusers,createuser,updateuser,deleteuser,getdetails,changerStatususer,resetPassworduser,
              affecttorestaurantuser,removerestaurantuser
} = authSlice.actions

// Other code such as selectors can use the imported `RootState` type
//export const selectCount = (state: RootState) => state.counter.value

export default authSlice.reducer
