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
} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Slider from '@react-native-community/slider';
import {commonFontStyle} from '../theme/fonts';
import SignatureScreen from 'react-native-signature-canvas';

const SignatureExample = ({onPress, onBegin, onEnd, onClearPress}) => {
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
  return (
    <>
      <View style={styles.container}>
        <SignatureScreen
          ref={ref}
          onOK={handleOK} // Called when 'Save' button is pressed
          autoClear={false} // Prevents auto clearing after saving
          descriptionText="Sign here" // Placeholder text
          webStyle={styles.signaturePad} // Customize the signature pad
          onBegin={onBegin}
          onEnd={onEnd}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.btnView} onPress={handleSave}>
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnView} onPress={handleClear}>
            <Text style={styles.btnText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const getGlobalStyles = props => {
  const {colors, fontValue} = props;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      height: 160,
      borderWidth: 1,
      borderColor: colors.gray,
    },
    buttonContainer: {
      // marginTop: 10,
      backgroundColor: colors.background,
      flexDirection: 'row',
      alignSelf: 'flex-end',
      gap: 20,
      marginHorizontal: 24,
    },
    btnView: {
      marginVertical: 8,
    },
    btnText: {
      ...commonFontStyle(400, fontValue + 16, colors.black),
    },
    signaturePad: `
      .m-signature-pad--footer { display: none; margin: 0px; } /* Hide footer buttons */
    `,
  });
};

export default SignatureExample;
