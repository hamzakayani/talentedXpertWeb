import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import userReducer from './UserSlice';
import accessReducer from './AccessSlice';
import threadReducer from './ThreadSlice'


const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  access: accessReducer,
  thread: threadReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;