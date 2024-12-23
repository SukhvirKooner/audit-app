/* eslint-disable react/no-unstable-nested-components */
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {useIsFocused, useRoute, useTheme} from '@react-navigation/native';
import CustomHeader from '../../components/CustomHeader';
import {commonFontStyle} from '../../theme/fonts';
import CustomText from '../../components/CustomText';
import {SCREENS} from '../../navigation/screenNames';
import {useAppSelector} from '../../redux/hooks';
import {navigateTo} from '../../utils/commonFunction';
import {setAsyncGetTemplateData} from '../../utils/asyncStorageManager';
import EmptyComponent from '../../components/EmptyComponent';

const SyncDataScreen = () => {
  const {params}: any = useRoute();
  const {colors} = useTheme();
  const {fontValue} = useAppSelector(state => state.common);
  const {auditsDetailsList} = useAppSelector(state => state.home);
  const isFocused = useIsFocused();

  const [syncData, setSyncData] = React.useState<any>(null);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );
  // console.log('templateData', templateData);

  useEffect(() => {
    (async () => {
      const listData: any = await setAsyncGetTemplateData();
      const filterList = listData.filter(
        (item: any) => item?.audit === params?.auditItem?.id,
      );
      setSyncData(filterList);
    })();
  }, [isFocused]);

  //   const getTitle = (fields: any) => {
  //     let title = '';
  //     const identifier = templateData?.identifer;

  //     const newData = templateData?.fields?.find(
  //       (field: any) => field?.label === identifier,
  //     );

  //     fields?.forEach((field: any) => {
  //       if (field?.template_field === newData?.id) {
  //         title = field?.value;
  //       }
  //     });
  //     return title ?? identifier;
  //   };

  const renderAudit = ({item, index}: any) => (
    <TouchableOpacity
      key={index}
      onPress={() => {
        navigateTo(SCREENS.TemplateScreen, {
          headerTitle: params?.headerTitle,
          auditItem: params?.auditItem,
          auditDetails: item,
          type: 'edit',
        });
      }}
      style={styles.auditCard}>
      {/* <CustomImage
        uri={templateData?.logo ?? 'https://picsum.photos/200'}
        size={wps(28)}
        imageStyle={{
          borderRadius: wps(28),
          borderWidth: 1,
          borderColor: '#ccc',
        }}
      /> */}
      <View>
        <CustomText
          text={index + ' - ' + params?.headerTitle}
          style={styles.auditTitle}
        />
        {/* <CustomText style={styles.auditDescription}>
            {`${t('Last updated on')}${item.description}}`}
          </CustomText> */}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title={params?.headerTitle} />
      <FlatList
        data={syncData}
        renderItem={renderAudit}
        keyExtractor={(item: any) => item?.response_id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => {
          return <EmptyComponent title="No data found" />;
        }}
      />
    </SafeAreaView>
  );
};

export default SyncDataScreen;

const getGlobalStyles = ({colors, fontValue}: any) => {
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
