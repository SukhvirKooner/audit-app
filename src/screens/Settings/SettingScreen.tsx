import {
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
import {commonFontStyle, hps, wp, wps} from '../../theme/fonts';
import CustomHeader from '../../components/CustomHeader';
import CustomImage from '../../components/CustomImage';
import CustomText from '../../components/CustomText';
import {Icons} from '../../theme/images';
import {useTranslation} from 'react-i18next';
import ShowModal from '../../components/ShowModal';
import {navigationRef} from '../../navigation/RootContainer';
import {screenNames} from '../../navigation/screenNames';

const SettingScreen = () => {
  const {t} = useTranslation();

  const {colors} = useTheme();
  const {goBack} = useNavigation();
  const {fontValue} = useSelector(state => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  const [modalVisibleLog, setModalVisibleLog] = useState(false);
  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);

  const onPressLogOut = () => {
    setModalVisibleLog(true);
  };
  console.log(modalVisibleLog);

  const onPressDeleteAccount = () => {
    setModalVisibleDelete(true);
  };

  const onPressList = list => {
    console.log('sd', list);
  };

  const items = [
    {
      icon: Icons.account,
      title: 'Account',
      description: 'Privacy, security, change email or number',
      onPress: () => navigationRef.navigate(screenNames.EditProfile),
    },
    {
      icon: Icons.notification,
      title: 'Notifications',
      description: 'Network usage, auto download',
      marginVertical: hps(14),
      onPress: () => {},
    },
    {
      icon: Icons.help,
      title: 'Help',
      description: 'Theme, wallpapers, chat history',
      onPress: () => {},
    },
    // {
    //   icon: Icons.delete,
    //   title: 'Delete Account',
    //   description: 'Theme, wallpapers, chat history',
    // },
    {
      icon: Icons.logout,
      title: 'Logout',
      onPress: () => {
        onPressLogOut();
      },
      // description: 'Theme, wallpapers, chat history',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title={'Settings'} />
      <View style={{flex: 1}}>
        <CustomImage
          uri="https://picsum.photos/200"
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
          <Image source={Icons.edit} style={styles.imageView} />
        </View>
        <CustomText
          numberOfLines={1}
          text={'Riya Samuel'}
          style={styles.text2}
        />
        <View style={styles.listText}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.boxList,
                index !== items.length - 1 && {marginBottom: hps(18)},
              ]}
              onPress={() => item?.onPress(item.title)}>
              <CustomImage
                source={item.icon}
                size={32}
                containerStyle={styles.allIconStyle}
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
          ))}
        </View>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignSelf: 'center',
          alignItems: 'center',
          borderWidth: 0,
          marginBottom: 12,
        }}>
        <TouchableOpacity onPress={onPressDeleteAccount}>
          <CustomText text="Delete Account" style={styles.deleteText} />
        </TouchableOpacity>
      </View>
      {modalVisibleLog && (
        <ShowModal
          text={t('Logout')}
          subText={t('Are you sure you want to logout?')}
          isVisible={modalVisibleLog}
          onYesClose={() => {
            setModalVisibleLog(false);
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

const getGlobalStyles = props => {
  const {colors, fontValue} = props;
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
      ...commonFontStyle(500, 18 + fontValue, colors.red),
    },
  });
};
