// import thunk from 'redux-thunk';
import {combineReducers} from 'redux';
import {configureStore} from '@reduxjs/toolkit';
import setting from './reducer/setting';
import common from './reducer/common';
import home from './reducer/home';
import {thunk} from 'redux-thunk';

const middleware = [thunk];

const reducers = combineReducers({
  setting: setting,
  common: common,
  home: home,
});

// const rootReducer = (state: any, action: any) => {
//   if (action.type === USER_LOGOUT) {
//     return reducers(undefined, action);
//   }
//   return reducers(state, action);
// };

// const store = configureStore({reducer: reducers});

const store = configureStore({
  reducer: reducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      middleware: middleware,
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export default store;
