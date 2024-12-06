import {StyleSheet, Text, TextStyle} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {commonFontStyle} from '../theme/fonts';
import {light_theme} from '../theme/colors';
import {useTheme} from '@react-navigation/native';
import {useSelector} from 'react-redux';

interface Props {
  text?: string;
  style?: TextStyle;
  children?: any;
  numberOfLines?: Number;
}

const CustomText = ({text, style, children, numberOfLines}: Props) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {fontValue} = useSelector(state => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  return (
    <Text numberOfLines={numberOfLines} style={[styles.textStyle, style]}>
      {children ? children : t(text)}
    </Text>
  );
};

export default CustomText;

const getGlobalStyles = props => {
  const {colors, fontValue} = props;
  return StyleSheet.create({
    textStyle: {
      ...commonFontStyle(400, 16 + fontValue, colors.black),
    },
  });
};
