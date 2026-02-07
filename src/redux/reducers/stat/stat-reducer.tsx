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
  data:'',
}

export const statSlice = createSlice({
  name: 'stat',
  initialState,
  reducers: {
    getstats:(state, action: PayloadAction<any>) => {
     state.data = action.payload
    },
    getsearchstats:(state, action: PayloadAction<any>) => {
      state.data = action.payload
    },

  },
})

export const { getstats,getsearchstats} = statSlice.actions

export default statSlice.reducer
