import {IS_LOADING, SET_APP_THEME, SET_FONT_VALUE} from '../actionTypes';

interface CommonState {
  isLoading: boolean;
  isDarkTheme: boolean;
}

const initialState: CommonState = {
  isLoading: false,
  isDarkTheme: true,
  fontValue: 0,
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
    default:
      return state;
  }
}
