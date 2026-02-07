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

export const stationSlice = createSlice({
  name: 'station',
  initialState,
  reducers: {
    getstations:(state, action: PayloadAction<any>) => {
      console.log(action)

     state.data = action.payload
    },
    getsearchstations:(state, action: PayloadAction<any>) => {
      state.data = action.payload
    },
    createstation:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },
    updatestation:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },
    deletestation:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },

  },
})

export const { getstations,getsearchstations,createstation,updatestation,deletestation } = stationSlice.actions

export default stationSlice.reducer
