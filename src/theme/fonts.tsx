export function getFontType(fontWeight: any) {
  if (fontWeight === 300) {
    return 'WorkSans-Light';
  } else if (fontWeight === 400) {
    return 'WorkSans-Regular';
  } else if (fontWeight === 500) {
    return 'WorkSans-Medium';
  } else if (fontWeight === 600) {
    return 'WorkSans-SemiBold';
  } else if (fontWeight === 700) {
    return 'WorkSans-Bold';
  } else if (fontWeight === 800) {
    return 'WorkSans-Black';
  } else {
    return 'WorkSans-Regular';
  }
}

export const commonFontStyle = (fontWeight: any, fontSize: any, color: any) => {
  return {
    fontFamily: getFontType(fontWeight),
    fontSize: fontSize,
    color: color,
    includeFontPadding: false,
  };
};

import {Dimensions, Platform, PixelRatio} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

export const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} =
  Dimensions.get('window');

export const hp = (i: any) => {
  return heightPercentageToDP(i);
};

export const wp = (i: any) => {
  return widthPercentageToDP(i);
};
const scale = SCREEN_WIDTH / 320;

export function actuatedNormalize(size: any) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export const Fonts = {
  WorkSans_300: 'WorkSans-Light',
  WorkSans_400: 'WorkSans-Regular',
  WorkSans_500: 'WorkSans-Medium',
  WorkSans_600: 'WorkSans-SemiBold',
  WorkSans_700: 'WorkSans-Bold',
  WorkSans_800: 'WorkSans-Black',
};
