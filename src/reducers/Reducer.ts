import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import userReducer from './UserSlice';
import accessReducer from './AccessSlice';
import threadReducer from './ThreadSlice'
import countriesReducer from './CountriesSlice'


const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  access: accessReducer,
  thread: threadReducer,
  countries: countriesReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;