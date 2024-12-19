/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import {SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CustomHeader from '../../components/CustomHeader';
import {useRoute, useTheme} from '@react-navigation/native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useSelector} from 'react-redux';
import MapSideList from '../../components/Home/MapSideList';
import {GOOGLE_API_KEY} from '../../utils/apiConstants';
import {bangaloreRegion} from '../../utils/globalFunctions';
import Loader from '../../components/Loader';

const MapScreen = () => {
  const {params}: any = useRoute();
  const mapCameraRef = useRef<any>(null);

  const {colors} = useTheme();
  // const {fontValue} = useSelector((state: any) => state.common);
  // const styles = React.useMemo(
  //   () => getGlobalStyles({colors, fontValue}),
  //   [colors, fontValue],
  // );
  const [markerList, setMarkerList] = useState<any>([]);

  const [isMapLoaded, setIsMapLoaded] = useState(true);

  useEffect(() => {
    if (params?.listData?.length > 0) {
      setTimeout(() => {
        setIsMapLoaded(false);
      }, 200);

      const newList = params?.listData?.map((item: any) => {
        return {
          latitude: Number(item?.value?.split(',')[0] || 0),
          longitude: Number(item?.value?.split(',')[1] || 0),
        };
      });
      setMarkerList(newList);
      if (mapCameraRef?.current) {
        mapCameraRef?.current?.setCamera({
          center: {
            latitude: Number(newList[0]?.latitude || 0),
            longitude: Number(newList[0]?.longitude || 0),
          },
          zoom: 11, // Adjust zoom level
          animation: {
            duration: 1000, // Duration of the animation
            easing: () => {},
          },
        });
      }
    }
  }, [params?.listData, mapCameraRef?.current]);

  const onMapLoad = () => {
    console.log('onMapLoad');
    setIsMapLoaded(false);

    const newList = params?.listData?.map((item: any) => {
      return {
        latitude: Number(item?.value?.split(',')[0] || 0),
        longitude: Number(item?.value?.split(',')[1] || 0),
      };
    });
    setMarkerList(newList);
    if (mapCameraRef?.current) {
      mapCameraRef?.current?.setCamera({
        center: {
          latitude: Number(newList[0]?.latitude || 0),
          longitude: Number(newList[0]?.longitude || 0),
        },
        zoom: 11, // Adjust zoom level
        animation: {
          duration: 1000, // Duration of the animation
          easing: () => {},
        },
      });
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <CustomHeader
        title={params?.headerTitle}
        subTitle={'SSC KR Circle'}
        downloadIcon
        listIcon
        refreshIcon
      />
      <View style={{flex: 1}}>
        {isMapLoaded ? (
          <Loader />
        ) : (
          <MapView
            ref={map => (mapCameraRef.current = map)}
            // initialRegion={region}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={{flex: 1}}
            zoomControlEnabled
            showsUserLocation
            onMapReady={onMapLoad}
            key={'AIzaSyBBixSdj8L9FYlqMmiBFzj89WaZnzK4etY'}>
            {markerList.map((item: any) => {
              return (
                <Marker
                  coordinate={{
                    latitude: Number(item?.latitude) || 0,
                    longitude: Number(item?.longitude) || 0,
                  }}></Marker>
              );
            })}
          </MapView>
        )}

        {/* <MapSideList /> */}
      </View>
    </SafeAreaView>
  );
};

export default MapScreen;

// const getGlobalStyles = (props: any) => {
//   const {colors, fontValue} = props;
//   return StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: colors.background,
//     },
//     map: {
//       ...StyleSheet.absoluteFillObject,
//       flex: 1,
//     },
//   });
// };
