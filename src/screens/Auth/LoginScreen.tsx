/* eslint-disable react-native/no-inline-styles */
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
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

const LoginScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  const {colors} = useTheme();
  const {fontValue} = useSelector((state: any) => state.common);

  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

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
              <CustomImage source={Icons.add_user} size={hps(24)} isBorder />
              <CustomText text="Login" style={styles.loginText} />
            </View>
            <Input
              icon={Icons.email}
              title={t('Username')}
              placeHolder={t('Enter your username')}
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
