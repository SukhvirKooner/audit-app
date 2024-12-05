/* eslint-disable react-native/no-inline-styles */
import {KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import {light_theme} from '../../theme/colors';
import CustomText from '../../components/CustomText';
import {commonFontStyle, hp} from '../../theme/fonts';
import CustomImage from '../../components/CustomImage';
import {Icons} from '../../theme/images';
import Input from '../../components/Input';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';
import CustomButton from '../../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {SCREENS} from '../../navigation/screenNames';

const LoginScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={hp(1)}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1, paddingBottom: hp(3)}}>
          <CustomText text="Audit" style={styles.headingStyle} />
          <CustomImage
            source={Icons.login}
            size={hp(40)}
            containerStyle={{alignSelf: 'center'}}
          />

          <View style={styles.mainView}>
            <View style={styles.row}>
              <CustomImage source={Icons.add_user} size={hp(2.4)} isBorder />
              <CustomText text="Login" style={styles.loginText} />
            </View>
            <Input
              icon={Icons.email}
              title={t('Email')}
              placeHolder={t('Enter your email')}
              isRequired
              extraStyle={styles.inputExtraStyle}
            />
            <Input
              icon={Icons.lock}
              title={t('Password')}
              placeHolder={t('Enter your password')}
              isRequired
              extraStyle={styles.inputExtraStyle}
              secureTextEntry
            />

            <CustomButton
              title={t('Login')}
              type={'gray'}
              extraStyle={{marginTop: hp(4)}}
              onPress={() => navigation.navigate(SCREENS.HomeScreen)}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: light_theme.background,
  },
  headingStyle: {
    ...commonFontStyle(700, 24, light_theme.black_1F),
    textAlign: 'center',
    paddingTop: hp(5),
  },
  mainView: {
    margin: hp(2),
    padding: hp(2),
    backgroundColor: light_theme.white,
    borderRadius: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: hp(1),
  },
  loginText: {
    ...commonFontStyle(600, 20, light_theme.black_1F),
  },
  inputExtraStyle: {
    marginTop: hp(2),
  },
});
