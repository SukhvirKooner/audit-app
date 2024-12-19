import {
  IS_LOADING,
  SET_APP_THEME,
  SET_FONT_VALUE,
  SET_GROUP_LIST,
  SET_USER_INFO,
} from '../actionTypes';

interface CommonState {
  isLoading: boolean;
  isDarkTheme: boolean;
  fontValue: number;
  userInfo: any;
  groupList: any;
}

const initialState: CommonState = {
  isLoading: false,
  isDarkTheme: true,
  fontValue: 0,
  userInfo: undefined,
  groupList: [],
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case IS_LOADING: {
      return {...state, isLoading: action.payload};
    }
    case SET_APP_THEME: {
      return {...state, isDarkTheme: action.payload};
    }
    case SET_FONT_VALUE: {
      return {...state, fontValue: action.payload};
    }
    case SET_USER_INFO: {
      return {...state, userInfo: action.payload};
    }
    case SET_GROUP_LIST: {
      return {...state, groupList: action.payload};
    }
    default:
      return state;
  }
}
