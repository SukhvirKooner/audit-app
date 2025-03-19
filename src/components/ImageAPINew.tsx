import {
  Image,
  StyleSheet,
  Text,
  ViewStyle,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {light_theme} from '../theme/colors';
import {commonFontStyle, hp, hps, SCREEN_WIDTH, wp} from '../theme/fonts';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {api, GOOGLE_API_KEY} from '../utils/apiConstants';
import Loader from './Loader';
import {useIsFocused, useTheme} from '@react-navigation/native';
import MapplsGL from 'mappls-map-react-native';
import {Icons} from '../theme/images';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import {
  getDropDownListAction,
  getUploadImage,
  imageDataAction,
  tokenDropDownListAction,
  uploadImageDataAction,
} from '../service/AuditService';
import {requestLocationPer} from '../utils/locationHandler';
import {
  IS_LOADING,
  IS_LOADING_MULTI,
  IS_LOADING_NEW,
} from '../redux/actionTypes';
import CustomImage from './CustomImage';
import {useAppDispatch} from '../redux/hooks';

type Props = {};

const ImageAPINew = ({
  onPress,

  item,
}: Props) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  console.log('dsasdadsadsadsasd', item);

  const [imageData, setImageData] = useState('');
  console.log('dsasdadsadsadsasd', imageData);

  useEffect(() => {
    let obj = {
      data: Number(item),
      onSuccess: res => {
        setImageData(res?.image_url);
      },
      onFailure: () => {},
    };
    dispatch(imageDataAction(obj));
  }, []);

  return (
    <CustomImage
      uri={api.BASE_URL_VIEW + imageData}
      size={hp(14)}
      // disabled={!isEdit}
      containerStyle={{borderRadius: 10, overflow: 'hidden'}}
      onPress={() => {
        onPress({id: item, url: imageData});
      }}
    />
  );
};

export default ImageAPINew;
