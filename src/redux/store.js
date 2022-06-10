import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux'
import { authReducer } from './auth';

export default configureStore({
    reducer: combineReducers({
        auth: authReducer
    })
});