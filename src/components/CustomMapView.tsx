import {
  Image,
  StyleSheet,
  Text,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {light_theme} from '../theme/colors';
import {commonFontStyle, hp} from '../theme/fonts';
import MapView, {Marker} from 'react-native-maps';
import {GOOGLE_API_KEY} from '../utils/apiConstants';

type Props = {
  title: string;
  extraStyle?: ViewStyle;
  onPress?: () => void;
  titleColor?: any;
  type?: 'blue' | 'gray';
  disabled?: boolean;
  leftIcon?: any;
};

const CustomMapView = ({
  titleColor,
  title,
  extraStyle,
  onPress,
  type = 'blue',
  leftIcon,
  disabled = false,
  latitude,
  longitude,
  formValues,
  field,
  handleInputChange,
  isEdit,
}: Props) => {
  const mapCameraRef = useRef<any>(null);

  useEffect(() => {
    mapCameraRef?.current?.setCamera({
      center: {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 28.679079,
        longitudeDelta: 77.06971,
      },
      zoom: 10, // Adjust zoom level
      animation: {
        duration: 1000, // Duration of the animation
        easing: () => {},
      },
    });
  }, [latitude, longitude]);

  return (
    <>
      <MapView
        ref={mapCameraRef}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 28.679079,
          longitudeDelta: 77.06971,
        }}
        provider="google"
        loadingEnabled
        zoomControlEnabled
        key={GOOGLE_API_KEY}
        showsUserLocation={true}
        moveOnMarkerPress
        // onRegionChangeComplete={onRegionDidChange}
        onPress={(e: any) => {
          if (!isEdit) return;
          const {latitude, longitude} = e.nativeEvent.coordinate;
          handleInputChange(latitude, longitude);
        }}
        style={{flex: 1}}>
        {formValues[field.id] && (
          <Marker
            coordinate={{
              latitude: latitude,
              longitude: longitude,
            }}
          />
        )}
      </MapView>
    </>
  );
};

export default CustomMapView;

const styles = StyleSheet.create({});
