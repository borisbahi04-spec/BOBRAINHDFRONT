import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from '../reducers/Auth/AuthReducer'
import BranchReducer from "../reducers/Branch/BranchReducer";
import RoleReducer from '../reducers/Role/RoleReducer'
import flashReducer from '../reducers/flash/flash-reducer'

import UserReducer from '../reducers/User/UserReducer'





export const store=configureStore({
  reducer: {
    auth: AuthReducer,
    role:RoleReducer,

    flash:flashReducer,
    branch:BranchReducer,
    user:UserReducer,
  },
})





// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

 //Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch




