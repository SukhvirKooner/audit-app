import {
  Image,
  StyleSheet,
  Text,
  ViewStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {light_theme} from '../theme/colors';
import {commonFontStyle, hp, SCREEN_WIDTH, wp} from '../theme/fonts';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {GOOGLE_API_KEY} from '../utils/apiConstants';
import Loader from './Loader';
import {useIsFocused, useTheme} from '@react-navigation/native';
import MapplsGL from 'mappls-map-react-native';
import {Icons} from '../theme/images';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {
  getDropDownListAction,
  tokenDropDownListAction,
} from '../service/AuditService';
import {requestLocationPer} from '../utils/locationHandler';
import {
  IS_LOADING,
  IS_LOADING_MULTI,
  IS_LOADING_SINGLE,
} from '../redux/actionTypes';

type Props = {
  title: string;
  extraStyle?: ViewStyle;
  onPress?: () => void;
  titleColor?: any;
  type?: 'blue' | 'gray';
  disabled?: boolean;
  leftIcon?: any;
};

const MultiDropDownView = ({
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
  handleInputChangeMultiple,
  currentLocationNew,
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

  let newAPi = field?.options?.options_json?.dataApi;
  let authenticationAPi = field.options?.options_json?.authentication;
  const {singleIsLoading, isLoading} = useAppSelector(state => state.common);

  console.log('field?.options ', field?.options);
  console.log('field?.options currentLocation', currentLocation);
  const getAddress = async (id: any) => {
    try {
      dispatch({type: IS_LOADING, payload: true});
      await requestLocationPer(
        async (response: any) => {
          const {latitude, longitude} = response;
          setCurrentLocation({
            latitude: latitude,
            longitude: longitude,
          });
          dispatch({type: IS_LOADING, payload: false});
        },
        (err: any) => {
          dispatch({type: IS_LOADING, payload: false});
          setCurrentLocation(null);
          console.log('<---current location error --->\n', err);
        },
      );
    } catch (error) {
      console.log('error', error);
    }
  };
  const fetchDropdownList = useCallback(() => {
    if (!field?.options?.options_from_api) return;

    if (!loading) {
      // dispatch({type: IS_LOADING, payload: true});
    }

    if (!currentLocation) {
      getAddress();
      return;
    }

    const handleSuccess = res => {
      let newApi = res?.suggestedLocations?.map(item => ({
        label: `${item?.placeName},${item?.placeAddress}`,
        value: `${item?.placeName},${item?.placeAddress}`,
      }));

      setUpdateList(newApi);
      dispatch({type: IS_LOADING, payload: false});
      dispatch({type: IS_LOADING_SINGLE, payload: false});
    };

    const handleFailure = () => {
      dispatch({type: IS_LOADING, payload: false});
    };

    if (field.options?.options_json?.authentication?.is_token_generated) {
      const authObj = {
        data: field.options?.options_json?.authentication,
        onSuccess: res => {
          const requestObj = {
            data: newAPi,
            params: {
              ...newAPi?.body,
              access_token: res?.access_token,
              ...(newAPi?.is_contain_location_field && {
                [newAPi?.location_field_key]: `${currentLocation?.latitude},${currentLocation?.longitude}`,
              }),
            },
            onSuccess: handleSuccess,
            onFailure: handleFailure,
          };
          dispatch(getDropDownListAction(requestObj));
        },
        onFailure: handleFailure,
      };
      dispatch(tokenDropDownListAction(authObj));
    } else {
      const requestObj = {
        data: newAPi,
        params: {
          ...newAPi?.body,
          ...(newAPi?.is_contain_location_field && {
            [newAPi?.location_field_key]: `${currentLocation?.latitude},${currentLocation?.longitude}`,
          }),
        },
        onSuccess: handleSuccess,
        onFailure: handleFailure,
      };
      dispatch(getDropDownListAction(requestObj));
    }
  }, [currentLocation, field?.options?.options_from_api]);

  useEffect(() => {
    dispatch({type: IS_LOADING_SINGLE, payload: true});
    if (isFocused) {
      setTimeout(() => {
        fetchDropdownList();
      }, 100);
    }
  }, [field?.options?.options_from_api, loading, isFocused, currentLocation]);

  const onMultiSelectPress = () => {};

  console.log('formValues[field.id]', formValues[field.id]);

  if (!isEdit) {
    return (
      <>
        <View
          style={[
            styles?.dropdown,
            {flexDirection: 'row', alignItems: 'center'},
          ]}>
          <Text
            style={formValues[field.id] ? styles.textStyle : styles.textStyle1}>
            {field.label}
          </Text>
          <Image
            source={Icons.down}
            style={{
              width: 18,
              height: 16,
              resizeMode: 'contain',
              tintColor: colors.gray,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 6,
            flexWrap: 'wrap',
          }}>
          {formValues[field.id]?.map(item => {
            return (
              <View
                style={[
                  styles?.dropdown,
                  {
                    marginRight: 6,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 5,
                  },
                ]}>
                <Text style={styles.textStyle2}>{item}</Text>
                <Image
                  source={Icons.close}
                  style={{
                    width: 10,
                    height: 10,
                    resizeMode: 'contain',
                    tintColor: colors.gray,
                    marginLeft: 8,
                  }}
                />
              </View>
            );
          })}
        </View>
      </>
    );
  }

  console.log('formValues[field.id]', formValues[field.id]);

  if (field?.options?.options_from_api) {
    return (
      <MultiSelect
        disable={!isEdit}
        onFocus={() => {
          setLoading(true);
        }}
        onBlur={() => {
          setLoading(false);
        }}
        style={{
          ...styles.dropdown,
          backgroundColor: isEdit ? colors.gray_ea : 'transparent',
        }}
        data={updateList}
        labelField="label"
        valueField="value"
        dropdownPosition="auto"
        placeholder={field.label}
        value={formValues[field.id] ?? []}
        onChange={item => handleInputChangeMultiple(field.id, item, 'multiple')}
        itemContainerStyle={{backgroundColor: colors.modalBg}}
        placeholderStyle={{
          opacity: 0.8,
          ...commonFontStyle(400, 16, colors.black),
        }}
        itemTextStyle={{
          ...commonFontStyle(400, 16, colors.black),
        }}
        selectedTextStyle={{
          ...commonFontStyle(400, 16, colors.black),
        }}
        activeColor={colors.naveBg}
        renderItem={res => {
          return (
            <View style={styles.rowStyle}>
              <Text
                style={[
                  styles.inputStyle,
                  {
                    color:
                      Array.isArray(formValues[field.id]) &&
                      formValues[field.id].includes(res?.label)
                        ? '#fff'
                        : colors.black,
                  },
                ]}>
                {res?.label}
              </Text>
            </View>
          );
        }}
      />
    );
  }

  return (
    <MultiSelect
      disable={!isEdit}
      style={{
        ...styles.dropdown,
        backgroundColor: isEdit ? colors.gray_ea : 'transparent',
      }}
      data={
        field.options?.choices?.map((choice: any) => ({
          label: choice,
          value: choice,
        })) || []
      }
      labelField="label"
      valueField="value"
      dropdownPosition="auto"
      placeholder={field.label}
      value={formValues[field.id] ?? []}
      onChange={item => handleInputChangeMultiple(field.id, item, 'multiple')}
      itemContainerStyle={{backgroundColor: colors.modalBg}}
      placeholderStyle={{
        opacity: 0.8,
        ...commonFontStyle(400, 16, colors.black),
      }}
      itemTextStyle={{
        ...commonFontStyle(400, 16, colors.black),
      }}
      selectedTextStyle={{
        ...commonFontStyle(400, 16, colors.black),
      }}
      activeColor={colors.naveBg}
      renderItem={res => {
        return (
          <View style={styles.rowStyle}>
            <Text
              style={[
                styles.inputStyle,
                {
                  color:
                    Array.isArray(formValues[field.id]) &&
                    formValues[field.id].includes(res?.label)
                      ? '#fff'
                      : colors.black,
                },
              ]}>
              {res?.label}
            </Text>
          </View>
        );
      }}
    />
  );
};

export default MultiDropDownView;

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
    textStyle2: {
      ...commonFontStyle(400, 16, colors.black),
    },
    textStyle1: {
      opacity: 0.7,
      ...commonFontStyle(400, 16, colors.black),
    },
    rowStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      height: hp(5),
      marginHorizontal: wp(2.5),
    },
    inputStyle: {
      flex: 1,
      margin: 0,
      padding: 0,
      marginHorizontal: wp(3),
      ...commonFontStyle(400, 16, colors.black),
    },
  });
};
