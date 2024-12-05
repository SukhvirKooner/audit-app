import {
  Image,
  StyleSheet,
  Text,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {light_theme} from '../theme/colors';
import {commonFontStyle, hp} from '../theme/fonts';

type Props = {
  title: string;
  extraStyle?: ViewStyle;
  onPress?: () => void;
  titleColor?: any;
  type?: 'blue' | 'gray';
  disabled?: boolean;
  leftIcon?: any;
};

const CustomButton = ({
  titleColor,
  title,
  extraStyle,
  onPress,
  type = 'blue',
  leftIcon,
  disabled = false,
}: Props) => {
  return (
    <TouchableOpacity
      onPress={() => (onPress ? onPress() : {})}
      disabled={disabled}
      style={[
        type === 'blue' ? styles.btnContainer : styles.grayBtnContainer,
        extraStyle,
      ]}>
      {leftIcon && <Image source={leftIcon} style={styles.rightArrow} />}
      <Text
        style={[
          styles.titleText,
          {
            color: titleColor ? titleColor : light_theme.white,
          },
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  btnContainer: {
    height: 40,
    backgroundColor: light_theme.mainBlue,
    borderRadius: 10,
    paddingHorizontal: hp(3),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  grayBtnContainer: {
    height: 40,
    backgroundColor: light_theme.gray,
    borderRadius: 10,
    paddingHorizontal: hp(3),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  rightArrow: {
    height: 19,
    width: 19,
    resizeMode: 'contain',
  },
  titleText: {
    ...commonFontStyle(500, 16, light_theme.white),
    textAlign: 'center',
  },
});
