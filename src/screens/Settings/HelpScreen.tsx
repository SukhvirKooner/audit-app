/* eslint-disable react-native/no-inline-styles */
import {SafeAreaView, StyleSheet, View} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {commonFontStyle, hp, wp} from '../../theme/fonts';
import CustomHeader from '../../components/CustomHeader';
import {useAppSelector} from '../../redux/hooks';

const HelpScreen = () => {
  const {colors} = useTheme();
  const {fontValue} = useAppSelector(state => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title={'Help'} />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <></>
      </View>
    </SafeAreaView>
  );
};

export default HelpScreen;

const getGlobalStyles = ({colors, fontValue}: any) => {
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
