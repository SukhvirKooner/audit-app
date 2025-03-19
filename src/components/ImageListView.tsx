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
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {
  getDropDownListAction,
  getUploadImage,
  tokenDropDownListAction,
} from '../service/AuditService';
import {requestLocationPer} from '../utils/locationHandler';
import {
  IS_LOADING,
  IS_LOADING_MULTI,
  IS_LOADING_NEW,
} from '../redux/actionTypes';
import CustomImage from './CustomImage';
import ImageAPINew from './ImageAPINew';

type Props = {
  title: string;
  extraStyle?: ViewStyle;
  onPress?: () => void;
  titleColor?: any;
  type?: 'blue' | 'gray';
  disabled?: boolean;
  leftIcon?: any;
};

const ImageListView = ({
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
  handlesConditionalFieldsRemove,
  handlesConditionalFieldsss,
  handlesConditionalFieldDropDown,
  handleInputChangeMultiple,
  currentLocationNew,
  repeatable,

  listData,
  apiData,
}: Props) => {
  const {fontValue, userInfo} = useAppSelector(state => state.common);

  const {colors}: any = useTheme();
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );
  const dispatch = useAppDispatch();

  const [updateList, setUpdateList] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(currentLocationNew);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const {multiIsLoading, isLoading} = useAppSelector(state => state.common);

  console.log('listData', listData);

  if (apiData) {
    return (
      <FlatList
        horizontal
        contentContainerStyle={{
          gap: 10,
          overflow: 'visible',
          paddingRight: 20,
        }}
        data={listData}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({item}: any) => {
          return (
            <View style={styles.imageContainer}>
              <CustomImage
                uri={api.BASE_URL_VIEW + item.url}
                size={hp(14)}
                // disabled={!isEdit}
                containerStyle={{borderRadius: 10, overflow: 'hidden'}}
                onPress={() => {
                  onPress(item);
                }}
              />
              {isEdit && (
                <CustomImage
                  source={Icons.plus}
                  disabled={!isEdit}
                  size={hps(35)}
                  onPress={() => {
                    handleDeleteImag(item.id);
                  }}
                  containerStyle={{
                    position: 'absolute',
                    top: -0,
                    right: -10,
                  }}
                  imageStyle={{transform: [{rotate: '45deg'}]}}
                />
              )}
            </View>
          );
        }}
      />
    );
  }

  return (
    <FlatList
      horizontal
      contentContainerStyle={{
        gap: 10,
        overflow: 'visible',
        paddingRight: 20,
      }}
      data={listData?.split(',')?.map(Number)}
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item.id}
      renderItem={({item}: any) => {
        return (
          <View style={styles.imageContainer}>
            <ImageAPINew item={item} onPress={onPress} />
            {isEdit && (
              <CustomImage
                source={Icons.plus}
                disabled={!isEdit}
                size={hps(35)}
                onPress={() => {
                  handleDeleteImag(item.id);
                }}
                containerStyle={{
                  position: 'absolute',
                  top: -0,
                  right: -10,
                }}
                imageStyle={{transform: [{rotate: '45deg'}]}}
              />
            )}
          </View>
        );
      }}
    />
  );
};

export default ImageListView;

const getGlobalStyles = ({colors, fontValue}: any) => {
  return StyleSheet.create({
    dropdown: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
    },
    remarkText: {
      ...commonFontStyle(400, fontValue + 15, colors.black),
      marginTop: 12,
    },
    textStyle: {
      ...commonFontStyle(400, 16, colors.black),
      flex: 1,
    },
    imageContainer: {
      height: hp(15),
      width: hp(15),
      borderWidth: 1,
      borderColor: colors.gray_E7,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageText: {
      ...commonFontStyle(400, fontValue + 16, colors.black_T37),
      textAlign: 'center',
    },
  });
};
