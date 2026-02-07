import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from '../reducers/Auth/AuthReducer'
import BranchReducer from "../reducers/Branch/BranchReducer";
import RoleReducer from '../reducers/Role/RoleReducer'

import UserReducer from '../reducers/User/UserReducer'
import AccessReducer from "../reducers/Access/AccessReducer";
import stationReducer from "../reducers/station/station-reducer";
import requesttypeReducer from "../reducers/requesttype/requesttype-reducer";
import departmentReducer from "../reducers/department/department-reducer";
import requesterReducer from "../reducers/requester/requester-reducer";
import statReducer from "../reducers/stat/stat-reducer";





export const store=configureStore({
  reducer: {
    auth: AuthReducer,
    role:RoleReducer,
    access:AccessReducer,
    branch:BranchReducer,
    user:UserReducer,
    station:stationReducer,
    requesttype:requesttypeReducer,
    department:departmentReducer,
    requester:requesterReducer,
    stat:statReducer
  },
})





// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

 //Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch




