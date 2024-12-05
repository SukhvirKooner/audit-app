import {SET_APP_LANGUAGE_LIST, SET_USER_APP_LANGUAGE} from '../actionTypes';

const initialState = {
  appLanguageList: undefined,
  userAppLanguage: 'en',
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case SET_APP_LANGUAGE_LIST: {
      return {...state, appLanguageList: action.payload};
    }
    case SET_USER_APP_LANGUAGE: {
      return {...state, userAppLanguage: action.payload};
    }
    default:
      return state;
  }
}
