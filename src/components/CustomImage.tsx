import {StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {hp} from '../theme/fonts';
import {light_theme} from '../theme/colors';

interface Props {
  onPress?: () => void;
  source?: any;
  size?: number;
  containerStyle?: ViewStyle;
  imageStyle?: any;
  tintColor?: any;
  uri?: string;
  isBorder?: boolean;
  disabled?: boolean;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
}

const CustomImage = ({
  onPress,
  source,
  size,
  containerStyle,
  imageStyle,
  tintColor,
  uri,
  isBorder = false,
  disabled = false,
  resizeMode = 'contain',
}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.5 : 1}
      onPress={onPress}
      disabled={disabled}
      style={isBorder ? styles.btnContainer : {...containerStyle}}>
      <FastImage
        source={uri ? {uri: uri, cache: 'cacheOnly'} : source}
        defaultSource={source ? source : undefined}
        style={[{width: size, height: size}, imageStyle]}
        resizeMode={resizeMode}
        tintColor={tintColor}
      />
    </TouchableOpacity>
  );
};

export default CustomImage;

const styles = StyleSheet.create({
  btnContainer: {
    height: hp(4),
    width: hp(4),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderColor: light_theme.gray_E7,
  },
});
