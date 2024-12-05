import {CommonActions} from '@react-navigation/native';
import {navigationRef} from '../navigation/RootContainer';

export const dispatchNavigation = (name: string) => {
  navigationRef.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [{name: name}],
    }),
  );
};
