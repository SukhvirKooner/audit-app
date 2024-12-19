import {SafeAreaView, Share, StyleSheet} from 'react-native';
import React from 'react';
import {useRoute, useTheme} from '@react-navigation/native';
import {useAppSelector} from '../../redux/hooks';
import {commonFontStyle} from '../../theme/fonts';
import {useTranslation} from 'react-i18next';
import PDFView from 'react-native-pdf';
import CustomHeader from '../../components/CustomHeader';
import {navigationRef} from '../../navigation/RootContainer';

const PdfScreen = () => {
  const {t} = useTranslation();
  const {params}: any = useRoute();

  console.log('params', params.pdfPath);

  const {colors} = useTheme();
  const {fontValue} = useAppSelector((state: any) => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title={t('Report.pdf')}
        isBack={false}
        shareIcon
        crossIcon
        onSharePress={() => {
          Share.share({
            url: `file://${params.pdfPath}`,
            title: 'Report.pdf',
          });
        }}
        onCrossPress={() => {
          navigationRef.goBack();
        }}
      />
      {params.pdfPath && (
        <PDFView
          source={{uri: `file://${params.pdfPath}`}}
          style={styles.pdf}
        />
      )}
    </SafeAreaView>
  );
};

export default PdfScreen;
const getGlobalStyles = ({colors, fontValue}: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    title: {
      ...commonFontStyle(500, 16 + fontValue, colors.black),
      textAlign: 'center',
    },

    fileName: {
      ...commonFontStyle(500, 14 + fontValue, colors.gray_7B),
    },
    pdf: {
      flex: 1,
      width: '100%',
    },
  });
};
