import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface AuthState {
  actionResponse: any
  getuserprofile:any
  _token:any
}

// Define the initial state using that type
const initialState: AuthState = {
  actionResponse:'',
  getuserprofile:'',
  _token:''
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    _token:(state, action: PayloadAction<any>) => {
      state._token = action.payload
    },
    login:(state, action: PayloadAction<any>) => {
      state.actionResponse = action.payload
    },
    userProfile:(state, action: PayloadAction<any>) => {
      state.getuserprofile = action.payload
    },
  },
})

export const {_token, login,userProfile } = authSlice.actions

// Other code such as selectors can use the imported `RootState` type
//export const selectCount = (state: RootState) => state.counter.value

export default authSlice.reducer
