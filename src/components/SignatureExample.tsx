import React, {useRef, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  View,
  Dimensions,
  Alert,
  Button,
  Modal,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Slider from '@react-native-community/slider';
import {commonFontStyle, SCREEN_HEIGHT, wp} from '../theme/fonts';
import SignatureScreen from 'react-native-signature-canvas';
import SignatureView from 'react-native-signature-canvas';
import {Icons} from '../theme/images';

const SignatureExample = ({
  onPress,
  onBegin,
  onEnd,
  onClearPress,
  isVisible,
  onCloseModal,
  value,
}) => {
  const {colors} = useTheme();
  const {fontValue} = useSelector(state => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );
  const [signature, setSignature] = React.useState(null);

  const ref = useRef<any>(null);

  // Callback when signature is saved
  const handleOK = (signature: string) => {
    setSignature(signature); // Save the Base64 string
    console.log('signature', signature);
    onPress(signature);
  };

  const handleSave = () => {
    ref.current.readSignature(); // Triggers handleOK callback
  };

  // Callback when signature is cleared
  const handleClear = () => {
    ref.current.clearSignature();
    onClearPress();
  };

  // Callback when user cancels
  const handleEmpty = () => {
    Alert.alert('No Signature', 'Please provide a signature.');
  };

  const {t} = useTranslation();
  const imgWidth = '100%';
  const imgHeight = '100%';
  const style = `.m-signature-pad {box-shadow: none; border: none; } 
              .m-signature-pad--body {border: none;}
              .m-signature-pad--footer {display: none; margin: 0px;}
              body,html {
              width: ${imgWidth}px; height: ${imgHeight}px;}`;
  return (
    <>
      <Modal
        transparent={true}
        visible={isVisible}
        onRequestClose={() => onCloseModal()}
        animationType="fade">
        <View style={styles.modalContainer}>
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
          <View style={styles.container}>
            <SignatureScreen
              ref={ref}
              onOK={handleOK} // Called when 'Save' button is pressed
              autoClear={false} // Prevents auto clearing after saving
              descriptionText="Sign here" // Placeholder text
              // bgWidth={imgWidth}
              // bgHeight={imgHeight}
              webStyle={styles.signaturePad}
              style={styles.signatureCanvas}
              onBegin={onBegin}
              onEnd={onEnd}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.btnView} onPress={handleSave}>
              <Text style={styles.btnText}>Done</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnView} onPress={handleClear}>
              <Text style={styles.btnText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const getGlobalStyles = props => {
  const {colors, fontValue} = props;
  return StyleSheet.create({
    modalContainer: {
      backgroundColor: colors.white,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      width: '100%',
    },
    closeIconStyle: {
      height: wp(4),
      width: wp(4),
      tintColor: colors.textColor,
      right: 20,
      top: 20,
    },
    buttonContainer: {
      backgroundColor: colors.white,
      flexDirection: 'row',
      gap: 20,
      marginHorizontal: 24,
      position: 'absolute',
      top: SCREEN_HEIGHT * 0.7,
    },
    btnView: {
      marginVertical: 8,
      backgroundColor: colors.white,
      borderWidth: 1,
      padding: 10,
      paddingHorizontal: 25,
      borderRadius: 5,
      borderColor: colors.gray,
    },
    btnText: {
      ...commonFontStyle(400, fontValue + 16, colors.black),
    },
    signatureCanvas: {
      // flex: 1,
      width: '100%',
      height: '100%',
      marginTop: SCREEN_HEIGHT * 0.2,
    },
    signaturePad: `
      .m-signature-pad--footer { display: none; margin:0  } /* Hide footer buttons */
    `,
  });
};

export default SignatureExample;
