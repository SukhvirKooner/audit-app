/* eslint-disable react-native/no-inline-styles */
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
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
import {errorToast, passwordCheck} from '../../utils/commonFunction';
import {useAppDispatch} from '../../redux/hooks';
import {onUserLogin} from '../../service/AuthServices';

const LoginScreen = () => {
  const {t} = useTranslation();
  // const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const {colors} = useTheme();
  const {fontValue} = useSelector((state: any) => state.common);

  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  const [userName, setUserName] = useState(__DEV__ ? 'admin' : '');
  const [password, setPassword] = useState(__DEV__ ? 'admin' : '');

  const onLogin = () => {
    if (userName.trim() === '') {
      errorToast(t('Please enter username'));
    }
    // if (!passwordCheck(password)) {
    //   errorToast(
    //     t(
    //       'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character',
    //     ),
    //   );
    // }
    else {
      let obj = {
        data: {
          username: userName.trim(),
          password: password.trim(),
        },
        onSuccess: () => {
          // resetNavigation(SCREENS.HomeScreen, undefined);
        },
      };
      dispatch(onUserLogin(obj));
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
          <CustomText text="Audit" style={styles.headingStyle} />
          <CustomImage
            source={Icons.login}
            size={hp(40)}
            containerStyle={{alignSelf: 'center'}}
          />

          <View style={styles.mainView}>
            <View style={styles.row}>
              <CustomImage
                source={Icons.add_user}
                size={hps(24)}
                isBorder
                tintColor={colors.black}
              />
              <CustomText text="Login" style={styles.loginText} />
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

            <CustomButton
              title={t('Login')}
              disabled={userName === '' || password === ''}
              type={userName === '' || password === '' ? 'gray' : 'blue'}
              extraStyle={{marginTop: hp(4)}}
              onPress={onLogin}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

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
    inputExtraStyle: {
      marginTop: hp(2),
    },
  });
};
