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

export const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {
    getdepartments:(state, action: PayloadAction<any>) => {
      console.log(action)

     state.data = action.payload
    },
    getsearchdepartments:(state, action: PayloadAction<any>) => {
      state.data = action.payload
    },
    createdepartment:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },
    updatedepartment:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },
    deletedepartment:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },

  },
})

export const { getdepartments,getsearchdepartments,createdepartment,updatedepartment,deletedepartment } = departmentSlice.actions

export default departmentSlice.reducer
