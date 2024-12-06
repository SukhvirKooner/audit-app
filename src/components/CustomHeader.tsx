/* eslint-disable react-native/no-inline-styles */
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import {Icons} from '../theme/images';
import CustomImage from './CustomImage';
import {commonFontStyle, hp, hps, wps} from '../theme/fonts';
import CustomText from './CustomText';
import {useSelector} from 'react-redux';

interface Props {
  title: string;
  subTitle?: string;
  showAdd?: boolean;
  showMap?: boolean;
  onSearchPress?: () => void;
  onMapPress?: () => void;
  onShowAddPress?: () => void;
  searchIcon?: any;
  notificationIcon?: any;
  onNotificationPress?: () => void;
  type?: 'home' | 'other';
}

const CustomHeader = ({
  title,
  subTitle,
  showAdd,
  showMap,
  onSearchPress,
  onMapPress,
  onShowAddPress,
  searchIcon,
  notificationIcon,
  onNotificationPress,
  type = 'other',
}: Props) => {
  const {colors} = useTheme();
  const {goBack} = useNavigation();
  const {fontValue} = useSelector(state => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  return (
    <View style={[styles.container, {marginHorizontal: wps(16), marginTop: 5}]}>
      <View style={styles.container}>
        {type === 'home' ? (
          <>
            <CustomImage
              uri="https://picsum.photos/200"
              size={wps(45)}
              imageStyle={{borderRadius: wps(45)}}
            />
          </>
        ) : (
          <CustomImage source={Icons.ic_back} size={hps(24)} onPress={goBack} />
        )}
        {type === 'home' ? (
          <View style={{flex: 1, marginLeft: 8}}>
            {subTitle && <CustomText text={subTitle} style={styles.text1} />}
            <CustomText numberOfLines={1} text={title} style={styles.text} />
          </View>
        ) : (
          <View style={{flex: 1, marginLeft: 8}}>
            <CustomText numberOfLines={1} text={title} style={styles.text} />
            {subTitle && <CustomText text={subTitle} style={styles.text1} />}
          </View>
        )}
        {notificationIcon && (
          <CustomImage
            source={Icons.ic_notification}
            size={hps(45)}
            containerStyle={{marginRight: 10}}
            onPress={onNotificationPress}
          />
        )}
        {searchIcon && (
          <CustomImage
            source={Icons.ic_search}
            size={hps(45)}
            containerStyle={{marginRight: 10}}
            onPress={onSearchPress}
          />
        )}
        {showMap && (
          <CustomImage
            onPress={onMapPress}
            source={Icons.ic_map}
            size={hps(45)}
          />
        )}
        {showAdd && (
          <CustomImage
            onPress={onShowAddPress}
            source={Icons.ic_add}
            size={hps(45)}
          />
        )}
      </View>
    </View>
  );
};

export default CustomHeader;

const getGlobalStyles = props => {
  const {colors, fontValue} = props;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
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
