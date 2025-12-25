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

export const accessSlice = createSlice({
  name: 'access',
  initialState,
  reducers: {
    getaccess:(state, action: PayloadAction<any>) => {
     state.data = action.payload
    },
    getsearchaccess:(state, action: PayloadAction<any>) => {
      state.data = action.payload
    },
    createaccess:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },
    updateaccess:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },
    deleteaccess:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },

  },
})

export const { getaccess,getsearchaccess,createaccess,updateaccess,deleteaccess } = accessSlice.actions

// Other code such as selectors can use the imported `RootState` type
//export const selectCount = (state: RootState) => state.counter.value

export default accessSlice.reducer
