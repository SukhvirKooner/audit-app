import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import store from '.';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const dispatchAction = (dispatch: any, action: any, data: any) => {
  dispatch({type: action, payload: data});
};
