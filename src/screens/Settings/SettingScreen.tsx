/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {commonFontStyle, hp, hps, wp, wps} from '../../theme/fonts';
import CustomHeader from '../../components/CustomHeader';
import CustomImage from '../../components/CustomImage';
import CustomText from '../../components/CustomText';
import {Icons} from '../../theme/images';
import {useTranslation} from 'react-i18next';
import ShowModal from '../../components/ShowModal';
import {navigationRef} from '../../navigation/RootContainer';
import {screenNames} from '../../navigation/screenNames';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {setDarkTheme} from '../../utils/commonActions';
import {clearAsync, clearOfflineAsync} from '../../utils/asyncStorageManager';

const SettingScreen = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {colors}: any = useTheme();
  const {fontValue, isDarkTheme, userInfo} = useAppSelector(
    state => state.common,
  );

  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  console.log('fontValue', fontValue);

  const [modalVisibleLog, setModalVisibleLog] = useState(false);
  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);

  const onPressLogOut = () => {
    setModalVisibleLog(true);
  };
  console.log(modalVisibleLog);

  const onPressDeleteAccount = () => {
    setModalVisibleDelete(true);
  };

  const items = [
    {
      icon: Icons.account,
      title: 'Account',
      description: 'Privacy, security, change email or number',
      onPress: () => navigationRef.navigate(screenNames.MyAccount),
    },
    {
      icon: Icons.notification,
      title: 'Notifications',
      description: 'Network usage, auto download',
      marginVertical: hps(14),
      onPress: () => navigationRef.navigate(screenNames.SettingNotification),
    },
    {
      icon: Icons.help,
      title: 'Help',
      description: 'Theme, wallpapers, chat history',
      onPress: () => {
        navigationRef.navigate(screenNames.HelpScreen);
      },
    },
    {
      icon: Icons.theme,
      title: 'theme',
      description: '',
    },
    {
      icon: Icons.logout,
      title: 'Logout',
      onPress: () => {
        onPressLogOut();
        clearAsync();
        clearOfflineAsync();
      },
    },
  ];
  const onPressThemeChange = () => {
    if (isDarkTheme === false) {
      dispatch(setDarkTheme(true));
    } else {
      dispatch(setDarkTheme(false));
    }
  };

  const Item = ({icon, title, onPress, greenText}: any) => {
    return (
      <TouchableOpacity style={styles.rowStyle} onPress={onPress}>
        <View style={styles.innerRowStyle}>
          <CustomImage source={icon} size={hps(30)} tintColor={colors.black} />
          <Text style={styles.itemTextStyle}>{title}</Text>
        </View>
        {greenText ? (
          <Text style={styles.greenTextStyle}>{greenText}</Text>
        ) : null}
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title={'Settings'}
        showQrCode
        onQrCodePress={() => {
          Alert.alert('Open QR code');
        }}
      />
      <View style={{flex: 1}}>
        {/* <CustomImage
          uri="https://picsum.photos/200"
          size={wps(90)}
          imageStyle={{borderRadius: wps(90)}}
          containerStyle={{alignSelf: 'center', marginTop: 40}}
        /> */}
        <CustomImage
          uri={userInfo?.profile_image ?? ''}
          source={userInfo?.profile_image ?? Icons.user}
          size={wps(90)}
          imageStyle={{borderRadius: wps(90)}}
          containerStyle={{alignSelf: 'center', marginTop: 40}}
        />
        <View style={styles.profileView}>
          <CustomText
            numberOfLines={1}
            text={'Good Evening!'}
            style={styles.text}
          />
          <TouchableOpacity
            onPress={() => navigationRef.navigate(screenNames.MyAccount)}
            style={styles.profileView}>
            <Image
              source={Icons.edit}
              style={styles.imageView}
              tintColor={colors.black}
            />
          </TouchableOpacity>
        </View>
        <CustomText
          numberOfLines={1}
          text={'Riya Samuel'}
          style={styles.text2}
        />
        <View style={styles.listText}>
          {items.map((item, index) =>
            item?.title === 'theme' ? (
              <Item
                icon={Icons.theme}
                title={t('Theme')}
                greenText={isDarkTheme === false ? t('Dark') : t('Light')}
                onPress={onPressThemeChange}
              />
            ) : (
              <TouchableOpacity
                key={index}
                style={[
                  styles.boxList,
                  index !== items.length - 1 && {marginBottom: hps(18)},
                ]}
                onPress={() => item?.onPress(item.title)}>
                <CustomImage
                  source={item.icon}
                  size={hps(30)}
                  containerStyle={styles.allIconStyle}
                  imageStyle={{}}
                  tintColor={colors.black}
                />
                <View>
                  <CustomText
                    numberOfLines={1}
                    text={item.title}
                    style={styles.titleText}
                  />
                  {item.description && (
                    <CustomText
                      numberOfLines={1}
                      text={item.description}
                      style={styles.desText}
                    />
                  )}
                </View>
              </TouchableOpacity>
            ),
          )}
        </View>
      </View>

      <TouchableOpacity
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          borderRadius: 8,
          marginBottom: 15,
          paddingVertical: 8,
          paddingHorizontal: 30,
          backgroundColor: colors.red,
        }}
        onPress={onPressDeleteAccount}>
        <CustomText text="Delete Account" style={styles.deleteText} />
      </TouchableOpacity>

      {modalVisibleLog && (
        <ShowModal
          text={t('Logout')}
          subText={t('Are you sure you want to logout?')}
          isVisible={modalVisibleLog}
          onYesClose={() => {
            setModalVisibleLog(false);
            navigationRef.navigate(screenNames.LoginScreen);
          }}
          onCloseModal={() => setModalVisibleLog(false)}
        />
      )}
      {modalVisibleDelete && (
        <ShowModal
          text={t('Delete Account')}
          subText={t('Are you sure you want to Delete this Account?')}
          isVisible={modalVisibleDelete}
          onYesClose={() => {
            setModalVisibleDelete(false);
          }}
          onCloseModal={() => setModalVisibleDelete(false)}
        />
      )}
    </SafeAreaView>
  );
};

export default SettingScreen;

const getGlobalStyles = ({colors, fontValue}: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    text: {
      ...commonFontStyle(400, 16 + fontValue, colors.gray_7B),
      textAlign: 'center',
    },
    text2: {
      ...commonFontStyle(600, 26 + fontValue, colors.black_B23),
      textAlign: 'center',
      marginTop: 5,
    },
    text1: {
      ...commonFontStyle(400, 12 + fontValue, colors.gray_7B),
      marginTop: 2,
    },
    profileView: {
      flexDirection: 'row',
      alignSelf: 'center',
      marginTop: 6,
    },
    imageView: {
      width: 24,
      height: 24,
      resizeMode: 'contain',
      marginLeft: 5,
    },
    allIconStyle: {
      width: 32,
      height: 32,
      resizeMode: 'contain',
      marginRight: wps(18),
    },
    listText: {
      paddingHorizontal: wps(20),
      marginTop: hps(49),
    },
    boxList: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleText: {
      ...commonFontStyle(600, 18 + fontValue, colors.black_T37),
    },
    desText: {
      ...commonFontStyle(400, 12 + fontValue, colors.black),
    },
    logoutText: {
      ...commonFontStyle(600, 18 + fontValue, colors.black),
    },
    deleteText: {
      ...commonFontStyle(500, 18 + fontValue, '#fff'),
      textAlign: 'center',
    },
    rowStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: hp(2),
      justifyContent: 'space-between',
      marginLeft: wp(1),
    },
    iconStyle: {
      height: hp(4),
      width: hp(4),
      tintColor: colors.black,
      opacity: 0.94,
      resizeMode: 'contain',
    },
    innerRowStyle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    greenTextStyle: {
      ...commonFontStyle(500, fontValue + 14, colors.mainBlue),
    },
    itemTextStyle: {
      ...commonFontStyle(500, 18 + fontValue, colors.black),
      marginLeft: wp(4),
    },
  });
};
