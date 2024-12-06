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
  type?: 'home' | 'other';
  title: string;
  subTitle?: string;
  showAdd?: boolean;
  showMap?: boolean;
  onSearchPress?: () => void;
  onMapPress?: () => void;
  onShowAddPress?: () => void;
  searchIcon?: any;
  notificationIcon?: any;
  showQrCode?: any;
  onNotificationPress?: () => void;
  downloadIcon?: any;
  onDownloadPress?: () => void;
  listIcon?: any;
  onListPress?: () => void;
  refreshIcon?: any;
  onRefreshPress?: () => void;
  onQrCodePress?: () => void;
}

const CustomHeader = ({
  type = 'other',
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
  downloadIcon,
  onDownloadPress,
  listIcon,
  onListPress,
  refreshIcon,
  onRefreshPress,
  onQrCodePress,
  showQrCode,
}: Props) => {
  const {colors} = useTheme();
  const {goBack} = useNavigation();
  const {fontValue} = useSelector((state: any) => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  return (
    <View
      style={[styles.container, {marginHorizontal: wps(15), marginTop: 15}]}>
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
          <View style={{flex: 1}}>
            {subTitle && <CustomText text={subTitle} style={styles.text1} />}
            <CustomText numberOfLines={1} text={title} style={styles.text} />
          </View>
        ) : (
          <View style={{flex: 1}}>
            <CustomText numberOfLines={1} text={title} style={styles.text} />
            {subTitle && <CustomText text={subTitle} style={styles.text1} />}
          </View>
        )}
        <View style={{...styles.container}}>
          {notificationIcon && (
            <CustomImage
              source={Icons.ic_notification}
              size={hps(45)}
              onPress={onNotificationPress}
            />
          )}
          {searchIcon && (
            <CustomImage
              source={Icons.ic_search}
              size={hps(45)}
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
          {downloadIcon && (
            <CustomImage
              onPress={onDownloadPress}
              source={Icons.ic_download}
              size={hps(45)}
            />
          )}
          {listIcon && (
            <CustomImage
              onPress={onListPress}
              source={Icons.ic_list}
              size={hps(45)}
            />
          )}
          {refreshIcon && (
            <CustomImage
              onPress={onRefreshPress}
              source={Icons.ic_refresh}
              size={hps(45)}
            />
          )}
          {showQrCode && (
            <CustomImage
              onPress={onQrCodePress}
              source={Icons.ic_qr}
              size={hps(45)}
            />
          )}
        </View>
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
      paddingBottom: 5,
      gap: 10,
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
