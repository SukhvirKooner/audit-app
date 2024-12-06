import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {commonFontStyle, wp, wps} from '../../theme/fonts';
import CustomHeader from '../../components/CustomHeader';
import CustomImage from '../../components/CustomImage';

const SettingScreen = () => {
  const {colors} = useTheme();
  const {goBack} = useNavigation();
  const {fontValue} = useSelector(state => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title={'Settings'} />
      <CustomImage
        uri="https://picsum.photos/200"
        size={wps(90)}
        imageStyle={{borderRadius: wps(90)}}
        containerStyle={{alignSelf: 'center', marginTop: 40}}
      />
    </SafeAreaView>
  );
};

export default SettingScreen;

const getGlobalStyles = props => {
  const {colors, fontValue} = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    text: {
      ...commonFontStyle(600, 18 + fontValue, colors.black_B23),
    },
    text1: {
      ...commonFontStyle(400, 12 + fontValue, colors.gray_7B),
      marginTop: 2,
    },
  });
};
