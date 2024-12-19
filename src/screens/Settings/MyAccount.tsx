/* eslint-disable react-native/no-inline-styles */
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import {commonFontStyle, hp, wps} from '../../theme/fonts';
import CustomHeader from '../../components/CustomHeader';
import CustomImage from '../../components/CustomImage';
import {Icons} from '../../theme/images';
import {useTranslation} from 'react-i18next';
import Input from '../../components/Input';
import CustomButton from '../../components/CustomButton';
import {navigationRef} from '../../navigation/RootContainer';
import {useAppSelector} from '../../redux/hooks';
import {emailCheck} from '../../utils/commonFunction';

const MyAccount = () => {
  const {t} = useTranslation();

  const {colors}: any = useTheme();
  const {goBack} = useNavigation();
  const {fontValue, isDarkTheme, userInfo} = useAppSelector(
    state => state.common,
  );
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  const [userName, setUserName] = useState(userInfo?.username);
  const [email, setEmail] = useState(userInfo?.email);
  const [phoneNum, setPhoneNum] = useState(userInfo?.phone);

  console.log('userInfo', userInfo);

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title={'My Account'} />
      <ScrollView style={{flex: 1, marginHorizontal: wps(16)}}>
        <View style={{alignSelf: 'center', marginBottom: 40}}>
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
          <TouchableOpacity
            onPress={() => {
              Alert.alert('open camera');
            }}
            style={styles.profileView}>
            <Image
              source={Icons.edit}
              style={styles.imageView}
              tintColor={colors.black}
            />
          </TouchableOpacity>
        </View>
        {/* <CustomText
          numberOfLines={1}
          text={'Riya Samuel'}
          style={styles.text2}
        /> */}
        <Input
          icon={Icons.add_user}
          title={t('User')}
          placeHolder={t('user name')}
          isRequired
          value={userName}
          extraStyle={styles.inputExtraStyle}
          iconTintColor={colors.black}
        />
        <Input
          value={email}
          icon={Icons.email}
          title={t('Email')}
          placeHolder={t('email')}
          isRequired
          extraStyle={styles.inputExtraStyle}
          iconTintColor={colors.black}
        />
        <Input
          icon={Icons.ic_phone}
          value={phoneNum}
          title={t('Phone')}
          placeHolder={t('phone number')}
          isRequired
          extraStyle={styles.inputExtraStyle}
          iconTintColor={colors.black}
        />
        <CustomButton
          title={t('Save')}
          disabled={userName === '' || email === '' || !emailCheck(email)}
          type={
            userName === '' || email === '' || !emailCheck(email)
              ? 'gray'
              : 'blue'
          }
          extraStyle={{marginTop: hp(4)}}
          onPress={() => navigationRef.goBack()}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyAccount;

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
      alignSelf: 'center',
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 28,
      height: 28,
      borderRadius: 28,
      backgroundColor: colors.white,
      justifyContent: 'center',
    },
    imageView: {
      width: 22,
      height: 22,
      // resizeMode: 'contain',
      left: 2,
    },

    inputExtraStyle: {
      marginTop: hp(2),
    },
  });
};
