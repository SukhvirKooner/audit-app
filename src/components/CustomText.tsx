import {StyleSheet, Text, TextStyle} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {commonFontStyle} from '../theme/fonts';
import {light_theme} from '../theme/colors';

interface Props {
  text: string;
  style?: TextStyle;
}

const CustomText = ({text, style}: Props) => {
  const {t} = useTranslation();

  return <Text style={[styles.textStyle, style]}>{t(text)}</Text>;
};

export default CustomText;

const styles = StyleSheet.create({
  textStyle: {
    ...commonFontStyle(400, 16, light_theme.black),
  },
});
