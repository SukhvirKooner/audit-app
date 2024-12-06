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
import {commonFontStyle, hp, hps, wp, wps} from '../../theme/fonts';
import CustomHeader from '../../components/CustomHeader';
import CustomImage from '../../components/CustomImage';
import CustomText from '../../components/CustomText';
import {Icons} from '../../theme/images';
import {useTranslation} from 'react-i18next';
import ShowModal from '../../components/ShowModal';
import Input from '../../components/Input';

const EditProfile = () => {
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
      onPress: () => {},
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
      <View style={{flex: 1, marginHorizontal: wps(16)}}>
        <View style={{alignSelf: 'center'}}>
          <CustomImage
            uri="https://picsum.photos/200"
            size={wps(90)}
            imageStyle={{borderRadius: wps(90)}}
            containerStyle={{alignSelf: 'center', marginTop: 40}}
          />
          <TouchableOpacity style={styles.profileView}>
            <Image source={Icons.edit} style={styles.imageView} />
          </TouchableOpacity>
        </View>
        <CustomText
          numberOfLines={1}
          text={'Riya Samuel'}
          style={styles.text2}
        />
        <Input
          icon={Icons.email}
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
          icon={Icons.email}
          title={t('Phone')}
          placeHolder={t('phone number')}
          isRequired
          extraStyle={styles.inputExtraStyle}
        />
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;

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
