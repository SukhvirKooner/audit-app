import {IS_LOADING, SET_APP_THEME} from '../actionTypes';

interface CommonState {
  isLoading: boolean;
  isDarkTheme: boolean;
}

const initialState: CommonState = {
  isLoading: false,
  isDarkTheme: false,
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case IS_LOADING: {
      return {...state, isLoading: action.payload};
    }
    case SET_APP_THEME: {
      return {...state, isDarkTheme: action.payload};
    }
    default:
      return state;
  }
}
