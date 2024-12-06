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

const fontSizes = {
  small: -2,
  default: 0,
  medium: 2,
  large: 4,
};

const HelpScreen = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const {colors} = useTheme();
  const {goBack} = useNavigation();
  const {fontValue} = useSelector(state => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );
  const [incNotifiaction, setIncNotifiaction] = useState(false);
  const [label, setLabel] = useState(t('Default'));
  const [fontSize, setFontSize] = useState(fontSizes.default);

  const Item = ({icon, title, greenText, onPress, renderRight}) => {
    return (
      <View style={styles.rowStyle} onPress={onPress}>
        <View style={styles.innerRowStyle}>
          <Text style={styles.itemTextStyle}>{title}</Text>
        </View>
        {renderRight && renderRight()}
      </View>
    );
  };

  const trackColor = incNotifiaction ? colors.mainBlue : colors.gray_DF;

  const onPressPlay = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title={'Help'} />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}></View>
    </SafeAreaView>
  );
};

export default HelpScreen;

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
      ...commonFontStyle(500, 14 + fontValue, colors.textColor),
      marginLeft: wp(1),
    },
  });
};
