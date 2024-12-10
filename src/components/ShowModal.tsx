import {useTheme} from '@react-navigation/native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import {useSelector} from 'react-redux';
import {Icons} from '../theme/images';
import {commonFontStyle, SCREEN_WIDTH, wp} from '../theme/fonts';

interface Props {
  onPressSaveName?: () => void;
  isVisible?: boolean;
  onCloseModal?: (value?: boolean) => void;
  text?: string;
  subText?: string;
  onYesClose?: () => void;
  modalContent?: any;
  modalMessage?: any;
  showCloseIcon?: boolean;
  buttonLeftStyle?: any;
  headerIcon?: any;
}

const ShowModal = ({
  onPressSaveName,
  isVisible,
  onCloseModal,
  text,
  subText,
  onYesClose,
  modalContent,
  modalMessage,
  showCloseIcon,
  buttonLeftStyle,
  headerIcon,
}: Props) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {fontValue} = useSelector(state => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={() => onCloseModal()}
      animationType="fade">
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, modalContent]}>
          {showCloseIcon && (
            <TouchableOpacity
              onPress={onCloseModal}
              style={{alignSelf: 'flex-end'}}>
              <Image
                resizeMode="contain"
                source={Icons.close}
                style={styles.closeIconStyle}
                tintColor={colors.black}
              />
            </TouchableOpacity>
          )}
          {headerIcon && (
            <Image
              resizeMode="contain"
              source={headerIcon}
              style={styles.headerIconStyle}
              tintColor={colors.textColor}
            />
          )}
          {text && <Text style={styles.modalTitle}>{text}</Text>}
          {subText && (
            <Text style={[styles.modalMessage, modalMessage]}>{subText}</Text>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => onCloseModal(false)}
              style={{...styles.button, ...buttonLeftStyle}}>
              <Text style={styles.buttonText}>{t('No')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onYesClose} style={styles.button}>
              <Text style={styles.buttonText}>{t('Yes')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getGlobalStyles = props => {
  const {colors, fontValue} = props;
  return StyleSheet.create({
    // modalContainer: {
    //   padding: wp(4),
    //   backgroundColor: colors.backgroundColor,
    //   borderRadius: 10,
    //   width: wp(90),
    //   maxHeight: SCREEN_HEIGHT * 0.8
    // },
    closeIconStyle: {
      height: wp(4),
      width: wp(4),
      tintColor: colors.textColor,
    },
    imageStyle: {
      height: 190,
      width: wp(80),
      alignSelf: 'center',
      marginVertical: 20,
      backgroundColor: '#f6f6f6',
    },
    scrollContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    text: {
      ...commonFontStyle(600, 16 + fontValue, colors.textColor),
      marginBottom: 7,
    },
    text1: {
      ...commonFontStyle(400, 14 + fontValue, colors.textColor),
      marginBottom: 20,
    },

    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: SCREEN_WIDTH * 0.8,
      padding: 30,
      backgroundColor: colors.modalBg,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalTitle: {
      marginBottom: 15,
      ...commonFontStyle(600, 20 + fontValue, colors.black),
    },
    modalMessage: {
      marginBottom: 20,
      textAlign: 'center',
      ...commonFontStyle(400, 15 + fontValue, colors.black),
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    button: {
      padding: 10,
      flex: 1,
      marginHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.mainBlue,
      borderRadius: 5,
      marginTop: 30,
    },
    buttonText: {
      ...commonFontStyle(500, 14 + fontValue, 'white'),
    },
    headerIconStyle: {
      height: 50,
      width: 50,
      marginVertical: 20,
    },
  });
};

export default ShowModal;
