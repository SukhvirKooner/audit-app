import {
  Alert,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
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
import Input from '../../components/Input';
import CustomButton from '../../components/CustomButton';
import {navigationRef} from '../../navigation/RootContainer';

const MyAccount = () => {
  const {t} = useTranslation();

  const {colors} = useTheme();
  const {goBack} = useNavigation();
  const {fontValue} = useSelector(state => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title={'My Account'} />
      <ScrollView style={{flex: 1, marginHorizontal: wps(16)}}>
        <View style={{alignSelf: 'center', marginBottom: 40}}>
          <CustomImage
            uri="https://picsum.photos/200"
            size={wps(90)}
            imageStyle={{borderRadius: wps(90)}}
            containerStyle={{alignSelf: 'center', marginTop: 40}}
          />
          <TouchableOpacity
            onPress={() => {
              Alert.alert('open camera');
            }}
            style={styles.profileView}>
            <Image source={Icons.edit} style={styles.imageView} />
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
          extraStyle={styles.inputExtraStyle}
        />
        <Input
          icon={Icons.email}
          title={t('Email')}
          placeHolder={t('email')}
          isRequired
          extraStyle={styles.inputExtraStyle}
        />
        <Input
          icon={Icons.ic_phone}
          title={t('Phone')}
          placeHolder={t('phone number')}
          isRequired
          extraStyle={styles.inputExtraStyle}
        />
        <CustomButton
          title={t('Save')}
          type={'gray'}
          extraStyle={{marginTop: hp(4)}}
          onPress={() => navigationRef.goBack()}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyAccount;

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
