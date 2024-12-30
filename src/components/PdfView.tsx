/* eslint-disable react-native/no-inline-styles */
import {useTheme} from '@react-navigation/native';
import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {useAppSelector} from '../redux/hooks';
import {Icons} from '../theme/images';
import {hp, wp} from '../theme/fonts';
import CustomImage from './CustomImage';
import PDFView from 'react-native-pdf';
import WebView from 'react-native-webview';

interface ImageModalProps {
  isVisible: boolean;
  onCloseModal: () => void;
  value: string;
}

const PdfView = ({isVisible, onCloseModal, value}: ImageModalProps) => {
  const {colors} = useTheme();
  const {fontValue} = useAppSelector(state => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  return (
    <ReactNativeModal
      onBackButtonPress={onCloseModal}
      onBackdropPress={onCloseModal}
      isVisible={isVisible}>
      <View style={styles.modalContainer}>
        <TouchableOpacity
          onPress={onCloseModal}
          style={{
            alignSelf: 'flex-end',
            position: 'absolute',
            top: 12,
            right: 12,
          }}>
          <Image
            resizeMode="contain"
            source={Icons.close}
            style={styles.closeIconStyle}
          />
        </TouchableOpacity>
        {/* <WebView source={{uri: value}} style={styles.webview} /> */}
        <PDFView source={{uri: `file://${value}`}} style={styles.pdf} />
      </View>
    </ReactNativeModal>
  );
};

const getGlobalStyles = ({colors}: any) => {
  return StyleSheet.create({
    modalContainer: {
      // padding: wp(4),
      backgroundColor: colors.modalBg,
      borderRadius: 10,
      // width: wp(90),
      flex: 1,
    },
    closeIconStyle: {
      height: wp(4),
      width: wp(4),
      tintColor: colors.black,
    },
    imageStyle: {
      height: 300,
      width: wp(85),
      alignSelf: 'center',
      marginVertical: 12,
      borderRadius: 5,
    },
    pdf: {
      flex: 1,
    },
  });
};

export default PdfView;
