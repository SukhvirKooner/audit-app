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

export const bangaloreRegion = {
  latitude: 12.9716, // Latitude for Bengaluru
  longitude: 77.5946, // Longitude for Bengaluru
  latitudeDelta: 0.17, // Adjust this value for zoom level
  longitudeDelta: 0.17, // Adjust this value for zoom level
};
