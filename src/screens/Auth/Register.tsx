/* eslint-disable react-native/no-inline-styles */
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {light_theme} from '../../theme/colors';
import CustomText from '../../components/CustomText';
import {commonFontStyle, hp, hps} from '../../theme/fonts';
import CustomImage from '../../components/CustomImage';
import {Icons} from '../../theme/images';
import Input from '../../components/Input';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';
import CustomButton from '../../components/CustomButton';
import {useNavigation, useTheme} from '@react-navigation/native';
import {SCREENS} from '../../navigation/screenNames';
import {useSelector} from 'react-redux';
import {
  emailCheck,
  errorToast,
  passwordCheck,
} from '../../utils/commonFunction';
import {useAppDispatch} from '../../redux/hooks';
import {onUserLogin, onUserRegister} from '../../service/AuthServices';
import {navigationRef} from '../../navigation/RootContainer';

const Register = () => {
  const {t} = useTranslation();
  // const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const {colors} = useTheme();
  const {fontValue} = useSelector((state: any) => state.common);

  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  const [userName, setUserName] = useState(__DEV__ ? '' : '');
  const [email, setEmail] = useState(__DEV__ ? '' : '');
  const [password, setPassword] = useState(__DEV__ ? '' : '');
  const [confirmPassword, setConfirmPassword] = useState(__DEV__ ? '' : '');

  const onLogin = () => {
    if (userName.trim() === '') {
      errorToast(t('Please enter username'));
    } else if (!emailCheck(email)) {
      errorToast(t('Enter a valid email'));
    } else if (password.length < 8) {
      errorToast('Password must be at least 8 characters');
    } else if (!passwordCheck(password)) {
      errorToast(
        'Password must be at Including numerics,alphabets,8 words at least',
      );
    } else if (confirmPassword.length < 8) {
      errorToast('Password must be at least 8 characters');
    } else if (confirmPassword !== password) {
      errorToast('Passwords do not match. Please re-enter to confirm.');
    } else {
      let obj = {
        data: {
          username: userName.trim(),
          email: email,
          password: password.trim(),
          confirm_password: confirmPassword.trim(),
          group: 'Admin', //Site
        },
        onSuccess: () => {
          // resetNavigation(SCREENS.LoginScreen);
        },
      };
      dispatch(onUserRegister(obj));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={hp(1)}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1, paddingBottom: hp(3)}}>
          {/* <CustomText text="Audit" style={styles.headingStyle} /> */}
          <CustomImage
            source={Icons.logo}
            containerStyle={{alignSelf: 'center'}}
            imageStyle={{width: 160, height: 58, marginTop: hp(5)}}
            resizeMode={'contain'}
          />

          <View style={styles.mainView}>
            <View style={styles.row}>
              <CustomImage
                source={Icons.add_user}
                size={hps(24)}
                isBorder
                tintColor={colors.black}
              />
              <CustomText text="Register" style={styles.loginText} />
            </View>
            <Input
              value={userName}
              onChangeText={setUserName}
              icon={Icons.email}
              title={t('Username')}
              placeHolder={t('Enter your username')}
              isRequired
              extraStyle={styles.inputExtraStyle}
              iconTintColor={colors.black}
            />
            <Input
              value={email}
              onChangeText={setEmail}
              icon={Icons.email}
              title={t('email')}
              placeHolder={t('Enter your email')}
              isRequired
              extraStyle={styles.inputExtraStyle}
              iconTintColor={colors.black}
            />
            <Input
              value={password}
              onChangeText={setPassword}
              icon={Icons.lock}
              title={t('Password')}
              placeHolder={t('Enter your password')}
              isRequired
              extraStyle={styles.inputExtraStyle}
              secureTextEntry
              iconTintColor={colors.black}
            />
            <Input
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              icon={Icons.lock}
              title={t('confirmPassword')}
              placeHolder={t('Enter your confirmPassword')}
              isRequired
              extraStyle={styles.inputExtraStyle}
              secureTextEntry
              iconTintColor={colors.black}
            />

            <CustomButton
              title={t('Register')}
              disabled={
                userName === '' ||
                password === '' ||
                !emailCheck(email) ||
                password.length < 8 ||
                !passwordCheck(password) ||
                confirmPassword !== password
              }
              type={
                userName === '' ||
                password === '' ||
                !emailCheck(email) ||
                password.length < 8 ||
                !passwordCheck(password) ||
                confirmPassword !== password
                  ? 'gray'
                  : 'blue'
              }
              extraStyle={{marginTop: hp(4)}}
              onPress={onLogin}
            />
            <Text
              onPress={() => {
                navigationRef.navigate(SCREENS.LoginScreen);
              }}
              style={styles.footerText}>
              {t('Already have account?')}{' '}
              <Text
                onPress={() => {
                  navigationRef.navigate(SCREENS.LoginScreen);
                }}
                style={styles.footerText1}>
                {t('Login')}
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;

const getGlobalStyles = (props: any) => {
  const {colors, fontValue} = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headingStyle: {
      ...commonFontStyle(700, fontValue + 24, colors.black_1F),
      textAlign: 'center',
      paddingTop: hp(5),
    },
    mainView: {
      margin: hp(2),
      padding: hp(2),
      backgroundColor: colors.white,
      borderRadius: 20,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: hp(1),
    },
    loginText: {
      ...commonFontStyle(600, fontValue + 20, colors.black_1F),
    },
    footerText: {
      ...commonFontStyle(600, fontValue + 12, colors.black_1F),
      textAlign: 'center',
      marginTop: 8,
    },
    footerText1: {
      ...commonFontStyle(600, fontValue + 12, colors.naveBg1),
    },
    inputExtraStyle: {
      marginTop: hp(2),
    },
  });
};
