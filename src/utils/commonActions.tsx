import {ThunkAction} from 'redux-thunk';
import {AnyAction} from 'redux';
import {RootState} from '../redux/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SET_APP_THEME} from '../redux/actionTypes';
import {asyncKeys} from './asyncStorageManager';

export const setDarkTheme =
  (data: boolean): ThunkAction<void, RootState, unknown, AnyAction> =>
  async dispatch => {
    AsyncStorage.setItem(asyncKeys.is_dark_theme, JSON.stringify(data));
    dispatch({
      type: SET_APP_THEME,
      payload: data,
    });
  };
