import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import CustomText from '../CustomText';
import {commonFontStyle} from '../../theme/fonts';
import {useTranslation} from 'react-i18next';

interface Props {
  data: any;
  onPress?: () => void;
}

const HomeListView = ({data, onPress}: Props) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <CustomText text={data.title} style={styles.titleStyle} />
      <CustomText text={data.subtitle} style={styles.subTitleStyle} />
      <View style={styles.line} />
      <CustomText style={styles.subTitleStyle}>
        {data?.progress} {t('Complete')}
      </CustomText>
    </TouchableOpacity>
  );
};

export default HomeListView;

const styles = StyleSheet.create({});

const getGlobalStyles = (props: any) => {
  const {colors} = props;
  return StyleSheet.create({
    container: {
      padding: 15,
      backgroundColor: colors.white,
      borderRadius: 10,
      marginTop: 10,
      // flex: 1,
      gap: 8,
      paddingVertical: 25,
    },
    titleStyle: {
      ...commonFontStyle(600, 20, colors.black),
    },
    subTitleStyle: {
      ...commonFontStyle(400, 14, colors.gray_7B),
    },
    line: {
      height: 1,
      backgroundColor: colors.gray_DF,
      marginVertical: 10,
    },
  });
};
