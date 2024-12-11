import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import CustomImage from './CustomImage';
import {GIF} from '../theme/images';
import {commonFontStyle, hps} from '../theme/fonts';
import {useTheme} from '@react-navigation/native';
import {useAppSelector} from '../redux/hooks';
import CustomText from './CustomText';
interface Props {
  isVisible: boolean;
}

const PdfDownloadModal = ({isVisible}: Props) => {
  const [visible, setVisible] = useState(false);

  const {colors} = useTheme();
  const {fontValue} = useAppSelector((state: any) => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  // const clodeMoal = () => {
  //   setVisible(false);
  //   onClose(false);
  // };

  return (
    <Modal isVisible={visible} animationIn={'fadeIn'} animationOut={'fadeOut'}>
      <View style={styles.modalContainer}>
        {/* Title */}
        <CustomText
          style={styles.title}
          text={'"Just a moment, we\'re almost there!"'}
        />

        <CustomImage uri={GIF.download} size={hps(80)} />

        {/* File Name */}
        <CustomText style={styles.fileName} text={'Creating Report.pdf'} />
      </View>
    </Modal>
  );
};

export default PdfDownloadModal;

const getGlobalStyles = ({colors, fontValue}: any) => {
  return StyleSheet.create({
    modalContainer: {
      backgroundColor: colors.white,
      width: '80%',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      alignSelf: 'center',
      gap: 10,
    },

    title: {
      ...commonFontStyle(500, 16 + fontValue, colors.black),
      textAlign: 'center',
    },

    fileName: {
      ...commonFontStyle(500, 14 + fontValue, colors.gray_7B),
    },
  });
};
