import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface AuthState {
  actionResponse: any
  data:any
  previewdata:any
}

// Define the initial state using that type
const initialState: AuthState = {
  actionResponse:'',
  data:'',
  previewdata:''
}

export const requesterSlice = createSlice({
  name: 'requester',
  initialState,
  reducers: {
    getrequesters:(state, action: PayloadAction<any>) => {
     state.data = action.payload
    },
    getSingledatarequester:(state, action: PayloadAction<any>) => {
      state.previewdata = action.payload
    },
    getsearchrequesters:(state, action: PayloadAction<any>) => {
      state.data = action.payload
    },
    createrequester:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },
    updaterequester:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },
    deleterequester:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },

  },
})

export const { getrequesters,getsearchrequesters,createrequester,updaterequester,deleterequester ,getSingledatarequester} = requesterSlice.actions

export default requesterSlice.reducer
