/* eslint-disable react/no-unstable-nested-components */
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {commonFontStyle, hp, hps, wp, wps} from '../../theme/fonts';
import CustomHeader from '../../components/CustomHeader';
import CustomImage from '../../components/CustomImage';
import CustomText from '../../components/CustomText';
import {useTranslation} from 'react-i18next';
import ShowModal from '../../components/ShowModal';
import Input from '../../components/Input';
import ToggleComponent from '../../components/ToggleComponent';
import {Icons} from '../../theme/images';
import {setAsyncFontSize} from '../../utils/asyncStorageManager';
import {SET_FONT_VALUE} from '../../redux/actionTypes';
import SizeSlider from '../../components/SizeSlider';
import {setDarkTheme} from '../../utils/commonActions';

const fontSizes = {
  small: -2,
  default: 0,
  medium: 2,
  large: 4,
};

const SettingNotification = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {isDarkTheme} = useSelector(state => state.common);

  const {colors}: any = useTheme();
  const {goBack} = useNavigation();
  const {fontValue} = useSelector(state => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );
  const [incNotification, setIncNotification] = useState(false);
  const [themeValue, setThemeValue] = useState(false);
  const [label, setLabel] = useState(t('Default'));
  const [fontSize, setFontSize] = useState(fontSizes.default);

  const Item = ({title, renderRight}: any) => {
    return (
      <View style={styles.rowStyle}>
        <View style={styles.innerRowStyle}>
          <Text style={styles.itemTextStyle}>{title}</Text>
        </View>
        {renderRight && renderRight()}
      </View>
    );
  };

  const onPressPlay = () => {};

  const onPressThemeChange = () => {
    if (isDarkTheme) {
      dispatch(setDarkTheme(false));
    } else {
      dispatch(setDarkTheme(true));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title={'Notifications'} />
      <View style={{flex: 1, marginHorizontal: wps(16), marginTop: 20}}>
        <Item
          title={t('Font size')}
          onPress={onPressPlay}
          renderRight={() => {
            return <Text style={styles.default}>{label}</Text>;
          }}
        />
        <SizeSlider
          onPress={option => {
            console.log('option', option);
            setFontSize(option.size);
            setLabel(option.label);
            dispatch({type: SET_FONT_VALUE, payload: option.size});
            setAsyncFontSize(option.size);
          }}
        />
        <Item
          icon={Icons.notification}
          title={t('Notifications')}
          onPress={onPressPlay}
          renderRight={() => {
            return (
              <View style={styles.rowStyle1}>
                <ToggleComponent
                  isToggleOn={incNotification}
                  onToggleSwitch={() => {
                    setIncNotification(!incNotification);
                  }}
                />
              </View>
            );
          }}
        />
        {/* <Item
          icon={Icons.notification}
          title={t('Theme')}
          onPress={onPressPlay}
          renderRight={() => {
            return (
              <View style={styles.rowStyle1}>
                <ToggleComponent
                  isToggleOn={themeValue}
                  onToggleSwitch={() => {
                    setThemeValue(!themeValue);
                  }}
                  trackColor={trackColor1}
                />
              </View>
            );
          }}
        /> */}
      </View>
    </SafeAreaView>
  );
};

export default SettingNotification;

const getGlobalStyles = props => {
  const {colors, fontValue} = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    text: {
      ...commonFontStyle(400, 16 + fontValue, colors.gray_7B),
      textAlign: 'center',
    },

    rowStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: hp(1),
      justifyContent: 'space-between',
    },
    innerRowStyle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    itemTextStyle: {
      ...commonFontStyle(500, 14 + fontValue, colors.black),
      marginLeft: wp(1),
    },
  });
};
