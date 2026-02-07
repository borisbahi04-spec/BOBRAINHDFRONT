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

export const requesttypeSlice = createSlice({
  name: 'requesttype',
  initialState,
  reducers: {
    getrequesttypes:(state, action: PayloadAction<any>) => {

     state.data = action.payload
    },
    getsearchrequesttypes:(state, action: PayloadAction<any>) => {
      state.data = action.payload
    },
    createrequesttype:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },
    updaterequesttype:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },
    deleterequesttype:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },

  },
})

export const { getrequesttypes,getsearchrequesttypes,createrequesttype,updaterequesttype,deleterequesttype } = requesttypeSlice.actions

export default requesttypeSlice.reducer
