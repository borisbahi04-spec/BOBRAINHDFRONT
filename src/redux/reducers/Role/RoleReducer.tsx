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

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    getroles:(state, action: PayloadAction<any>) => {
      console.log("action2023")
      console.log(action)

     state.data = action.payload
    },
    getsearchroles:(state, action: PayloadAction<any>) => {
      state.data = action.payload
    },
    createrole:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },
    updaterole:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },
    deleterole:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },

  },
})

export const { getroles,getsearchroles,createrole,updaterole,deleterole } = roleSlice.actions

// Other code such as selectors can use the imported `RootState` type
//export const selectCount = (state: RootState) => state.counter.value

export default roleSlice.reducer
