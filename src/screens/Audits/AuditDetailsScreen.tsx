import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import React from 'react';
import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import CustomHeader from '../../components/CustomHeader';
import CustomImage from '../../components/CustomImage';
import {commonFontStyle, wps} from '../../theme/fonts';
import {useSelector} from 'react-redux';
import CustomText from '../../components/CustomText';
import {useTranslation} from 'react-i18next';
import {SCREENS} from '../../navigation/screenNames';

const audits = [
  {
    id: '1',
    title: 'SCH 001 KR Circle',
    description: 'Mon, 10 July 2022',
    image: 'https://picsum.photos/200',
  },
  {
    id: '2',
    title: 'SCH 002 KR Circle',
    description: 'Mon, 10 July 2022',
    image: 'https://picsum.photos/200',
  },
  {
    id: '3',
    title: 'Gopal Gowda Circle',
    description: 'Mon, 10 July 2022',
    image: 'https://picsum.photos/200',
  },
];

const AuditDetailsScreen = () => {
  const {t} = useTranslation();
  const {params}: any = useRoute();
  const {navigate} = useNavigation();

  const {colors} = useTheme();
  const {fontValue} = useSelector((state: any) => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  const renderAudit = ({item}: any) => (
    <View style={styles.auditCard}>
      <CustomImage
        uri={item?.image}
        size={wps(28)}
        imageStyle={{borderRadius: wps(28)}}
      />
      <View>
        <CustomText text={item.title} style={styles.auditTitle} />
        <CustomText style={styles.auditDescription}>
          {`${t('Last updated on')}${item.description}}`}
        </CustomText>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title={params?.headerTitle}
        subTitle={'22 Nov 2024'}
        showMap
        searchIcon
        onMapPress={() => {
          navigate(SCREENS.MapScreen, {
            headerTitle: params?.headerTitle,
          });
        }}
      />
      <FlatList
        data={audits}
        renderItem={renderAudit}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default AuditDetailsScreen;

const getGlobalStyles = props => {
  const {colors, fontValue} = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContainer: {
      padding: 16,
    },
    viewStyle: {
      borderWidth: 0.8,
      borderColor: colors.gray_DF,
      marginVertical: 16,
    },
    auditCard: {
      backgroundColor: colors.white,
      borderRadius: 20,
      padding: 16,
      marginBottom: 10,
      shadowColor: colors.black,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    auditTitle: {
      marginBottom: 3,
      ...commonFontStyle(600, 18 + fontValue, colors.black_B23),
    },
    auditDescription: {
      ...commonFontStyle(400, 8 + fontValue, colors.gray_7B),
    },
    auditFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
  });
};
