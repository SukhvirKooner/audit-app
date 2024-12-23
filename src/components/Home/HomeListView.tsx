import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import CustomText from '../CustomText';
import {commonFontStyle} from '../../theme/fonts';
import {useTranslation} from 'react-i18next';
import PieChart from 'react-native-pie-chart';
import {light_theme} from '../../theme/colors';
import {useSelector} from 'react-redux';

interface Props {
  title: string;
  subtitle: string;
  progress: any;
  data: any;
  onPress?: () => void;
}

const HomeListView = ({data, onPress, subtitle, title, progress}: Props) => {
  const {t} = useTranslation();

  const {colors}: any = useTheme();
  const {fontValue} = useSelector((state: any) => state.common);

  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  // const widthAndHeight = 30;
  // const value = 100 - Number(progress);
  // const series = [Number(progress), value];
  // const sliceColor = [colors.naveBg, colors.white];

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <CustomText text={title} style={styles.titleStyle} />
      <CustomText text={subtitle} style={styles.subTitleStyle} />
      {/* <View style={styles.line} />
      <View style={styles.row}>
        <View style={styles.pieStyle}>
          <PieChart
            widthAndHeight={widthAndHeight}
            series={series}
            sliceColor={sliceColor}
            coverFill={'#FFF'}
          />
        </View>

        <CustomText style={styles.subTitleStyle}>
          {progress}% {t('Complete')}
        </CustomText>
      </View> */}
    </TouchableOpacity>
  );
};

export default HomeListView;

const getGlobalStyles = (props: any) => {
  const {colors, fontValue} = props;
  return StyleSheet.create({
    container: {
      padding: 15,
      backgroundColor: colors.white,
      borderRadius: 10,
      // marginTop: 10,
      // flex: 1,
      gap: 8,
      paddingVertical: 25,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    titleStyle: {
      ...commonFontStyle(600, fontValue + 20, colors.black),
    },
    subTitleStyle: {
      ...commonFontStyle(400, fontValue + 14, colors.gray_7B),
    },
    line: {
      height: 1,
      backgroundColor: colors.gray_DF,
      marginVertical: 10,
    },
    pieStyle: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.naveBg,
      borderRadius: 25,
    },
  });
};
