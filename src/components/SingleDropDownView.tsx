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
  IS_LOADING_NEW,
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

const SingleDropDownView = ({
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

  let newAPi = field?.options?.options_json?.dataApi;
  let authenticationAPi = field.options?.options_json?.authentication;

  console.log('field?.options ', field?.options);
  console.log('field?.options currentLocation', currentLocation);
  const getAddress = async (id: any) => {
    try {
      dispatch({type: IS_LOADING_NEW, payload: true});
      await requestLocationPer(
        async (response: any) => {
          const {latitude, longitude} = response;
          setCurrentLocation({
            latitude: latitude,
            longitude: longitude,
          });
          dispatch({type: IS_LOADING_NEW, payload: false});
        },
        (err: any) => {
          dispatch({type: IS_LOADING_NEW, payload: false});
          setCurrentLocation(null);
          console.log('<---current location error --->\n', err);
        },
      );
    } catch (error) {
      console.log('error', error);
    }
  };

  console.log('isFocused', isFocused);

  const fetchDropdownList = useCallback(() => {
    if (!field?.options?.options_from_api) return;

    if (!loading) {
      dispatch({type: IS_LOADING_NEW, payload: true});
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
      dispatch({type: IS_LOADING_MULTI, payload: false});
      dispatch({type: IS_LOADING_NEW, payload: false});
      dispatch({type: IS_LOADING, payload: false});
    };

    const handleFailure = () => {
      dispatch({type: IS_LOADING_MULTI, payload: false});
      dispatch({type: IS_LOADING_NEW, payload: false});
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
  }, [currentLocation, field]);

  useEffect(() => {
    if (isFocused) {
      fetchDropdownList();
    }
  }, [field, loading, isFocused, currentLocation]);

  const onMultiSelectPress = () => {};

  if (field?.options?.options_from_api) {
    return (
      <>
        <Dropdown
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
          containerStyle={{
            borderRadius: 10,
            marginTop: 10,
          }}
          dropdownPosition="auto"
          labelField="label"
          valueField="value"
          placeholder={field.label}
          value={formValues[field.id]}
          itemContainerStyle={{backgroundColor: colors.modalBg}}
          itemTextStyle={{
            ...commonFontStyle(400, 16, colors.black),
          }}
          onChange={item => {
            if (
              formValues[field.id] == undefined ||
              formValues[field.id] !== item.value
            ) {
              handleInputChange(field.id, item.value);
              const matchedCondition = field.conditional_fields.find(
                condition => condition.condition_value === item.value,
              );
              if (matchedCondition) {
                const updatedShowFields = matchedCondition.show_fields.filter(
                  fieldId => fieldId !== item.value,
                );
                handlesConditionalFieldDropDown(
                  `${field.id}-${updatedShowFields}`,
                  updatedShowFields,
                );
              } else {
                const allConditionalFields = field.conditional_fields.flatMap(
                  cf => cf.show_fields,
                );
                const filteredFields = allConditionalFields.filter(
                  fieldId => fieldId !== item.value,
                );

                handlesConditionalFieldsRemove(
                  `${field.id}-${filteredFields}`,
                  filteredFields,
                );
              }
              // handleInputChange(field.id, item.value);
              // if (field.conditional_fields[0]?.condition_value == item.value) {
              //   handlesConditionalFieldsss(
              //     `${field.id}-${matchedCondition?.show_fields}`,
              //     field.conditional_fields[0]?.show_fields,
              //   );
              // } else {
              //   handlesConditionalFieldsRemove(
              //     `${field.id}-${matchedCondition?.show_fields}`,
              //     field.conditional_fields[0]?.show_fields,
              //   );
              // }
            }
          }}
          placeholderStyle={{
            ...commonFontStyle(400, 16, colors.black),
          }}
          selectedTextStyle={{
            ...commonFontStyle(400, 16, colors.black),
          }}
        />
      </>
    );
  }

  return (
    <Dropdown
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
      containerStyle={{
        borderRadius: 10,
        marginTop: 10,
      }}
      dropdownPosition="auto"
      labelField="label"
      valueField="value"
      placeholder={field.label}
      value={formValues[field.id]}
      itemContainerStyle={{backgroundColor: colors.modalBg}}
      itemTextStyle={{
        ...commonFontStyle(400, 16, colors.black),
      }}
      onChange={item => {
        if (
          formValues[field.id] == undefined ||
          formValues[field.id] !== item.value
        ) {
          handleInputChange(field.id, item.value);
          const matchedCondition = field.conditional_fields.find(
            condition => condition.condition_value === item.value,
          );
          if (matchedCondition) {
            const updatedShowFields = matchedCondition.show_fields.filter(
              fieldId => fieldId !== item.value,
            );
            handlesConditionalFieldDropDown(
              `${field.id}-${updatedShowFields}`,
              updatedShowFields,
            );
          } else {
            const allConditionalFields = field.conditional_fields.flatMap(
              cf => cf.show_fields,
            );
            const filteredFields = allConditionalFields.filter(
              fieldId => fieldId !== item.value,
            );

            handlesConditionalFieldsRemove(
              `${field.id}-${filteredFields}`,
              filteredFields,
            );
          }
          // handleInputChange(field.id, item.value);
          // if (field.conditional_fields[0]?.condition_value == item.value) {
          //   handlesConditionalFieldsss(
          //     field.id,
          //     field.conditional_fields[0]?.show_fields,
          //   );
          // } else {
          //   handlesConditionalFieldsRemove(
          //     field.id,
          //     field.conditional_fields[0]?.show_fields,
          //   );
          // }
        }
      }}
      placeholderStyle={{
        ...commonFontStyle(400, 16, colors.black),
      }}
      selectedTextStyle={{
        ...commonFontStyle(400, 16, colors.black),
      }}
    />
  );
};

export default SingleDropDownView;

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
  });
};
