import {
  Image,
  StyleSheet,
  Text,
  ViewStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
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
import {IS_LOADING} from '../redux/actionTypes';
import SingleDropDownView from './SingleDropDownView';
import MultiDropDownView from './MultiDropDownView';

type Props = {
  title: string;
  extraStyle?: ViewStyle;
  onPress?: () => void;
  titleColor?: any;
  type?: 'blue' | 'gray';
  disabled?: boolean;
  leftIcon?: any;
};

const CustomDropDownView = ({
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

  if (field?.options?.options_from_api) {
    return (
      <>
        {field.options?.selection_type === 'multiple' ? (
          <MultiDropDownView
            isEdit={isEdit}
            field={field}
            formValues={formValues}
            handleInputChangeMultiple={handleInputChangeMultiple}
            currentLocationNew={currentLocationNew}
          />
        ) : (
          <SingleDropDownView
            isEdit={isEdit}
            field={field}
            formValues={formValues}
            handleInputChange={handleInputChange}
            handlesConditionalFieldsss={handlesConditionalFieldsss}
            handlesConditionalFieldsRemove={handlesConditionalFieldsRemove}
            currentLocationNew={currentLocationNew}
          />
        )}
      </>
    );
  }

  return (
    <>
      {field.options?.selection_type === 'multiple' ? (
        <MultiDropDownView
          isEdit={isEdit}
          field={field}
          formValues={formValues}
          handleInputChangeMultiple={handleInputChangeMultiple}
        />
      ) : (
        <SingleDropDownView
          isEdit={isEdit}
          field={field}
          formValues={formValues}
          handleInputChange={handleInputChange}
          handlesConditionalFieldsss={handlesConditionalFieldsss}
          handlesConditionalFieldsRemove={handlesConditionalFieldsRemove}
        />
      )}
    </>
  );
};

export default CustomDropDownView;

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
