/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import {Icons} from '../theme/images';
import CustomImage from './CustomImage';
import {commonFontStyle, hps, wps} from '../theme/fonts';
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
  editIcon?: any;
  onEditPress?: () => void;
  crossIcon?: any;
  onCrossPress?: () => void;
  isBack?: boolean;
  shareIcon?: any;
  onSharePress?: () => void;
}

const CustomHeader = ({
  type = 'other',
  userImage,
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
  editIcon,
  onEditPress,
  crossIcon,
  onCrossPress,
  isBack = true,
  shareIcon,
  onSharePress,
}: Props) => {
  const {colors}: any = useTheme();
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
          <View style={{flex: 1}}>
            <CustomImage
              source={Icons.logo}
              size={wps(90)}
              // imageStyle={{borderRadius: wps(45)}}
            />
          </View>
        ) : isBack ? (
          <CustomImage
            source={Icons.ic_back}
            size={hps(24)}
            tintColor={colors.black}
            onPress={goBack}
            containerStyle={{
              padding: wps(10),
            }}
          />
        ) : null}
        {type === 'home' ? null : (
          <View style={{flex: 1}}>
            <CustomText numberOfLines={1} text={title} style={styles.text} />
            {subTitle && <CustomText text={subTitle} style={styles.text1} />}
          </View>
        )}
        <View style={{...styles.container, gap: wps(10)}}>
          {notificationIcon && (
            <CustomImage
              source={Icons.ic_notification}
              size={hps(45)}
              onPress={onNotificationPress}
              tintColor={colors.black}
            />
          )}
          {searchIcon && (
            <CustomImage
              source={Icons.ic_search}
              size={hps(45)}
              onPress={onSearchPress}
              tintColor={colors.black}
            />
          )}
          {showMap && (
            <CustomImage
              onPress={onMapPress}
              source={Icons.ic_map}
              size={hps(45)}
              tintColor={colors.black}
            />
          )}
          {showAdd && (
            <CustomImage
              onPress={onShowAddPress}
              source={Icons.ic_add}
              size={hps(45)}
              tintColor={colors.black}
            />
          )}
          {downloadIcon && (
            <CustomImage
              onPress={onDownloadPress}
              source={Icons.ic_download}
              size={hps(45)}
              tintColor={colors.black}
            />
          )}
          {listIcon && (
            <CustomImage
              onPress={onListPress}
              source={Icons.ic_list}
              size={hps(45)}
              tintColor={colors.black}
            />
          )}
          {refreshIcon && (
            <CustomImage
              onPress={onRefreshPress}
              source={Icons.ic_refresh}
              size={hps(45)}
              tintColor={colors.black}
            />
          )}
          {editIcon && (
            <CustomImage
              onPress={onEditPress}
              source={Icons.ic_edit}
              size={hps(45)}
              tintColor={colors.black}
            />
          )}
          {shareIcon && (
            <CustomImage
              onPress={onSharePress}
              source={Icons.ic_share}
              size={hps(45)}
              tintColor={colors.black}
            />
          )}
          {crossIcon && (
            <CustomImage
              onPress={onCrossPress}
              source={Icons.ic_add}
              size={hps(45)}
              tintColor={colors.black}
              imageStyle={{transform: [{rotate: '45deg'}]}}
            />
          )}
          {showQrCode && (
            <CustomImage
              onPress={onQrCodePress}
              source={Icons.ic_qr}
              size={hps(45)}
              tintColor={colors.black}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default CustomHeader;

const getGlobalStyles = ({colors, fontValue}: any) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 5,
      // gap: 10,
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
