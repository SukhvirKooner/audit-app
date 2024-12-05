// import thunk from 'redux-thunk';
import {combineReducers} from 'redux';
import {configureStore} from '@reduxjs/toolkit';
import setting from './reducer/setting';
import common from './reducer/common';

// const middleware = [thunk];

const reducers = combineReducers({
  setting: setting,
  common: common,
});

// const rootReducer = (state: any, action: any) => {
//   if (action.type === USER_LOGOUT) {
//     return reducers(undefined, action);
//   }
//   return reducers(state, action);
// };

const store = configureStore({reducer: reducers});

export default store;
