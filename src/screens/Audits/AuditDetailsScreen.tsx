import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {
  useIsFocused,
  useNavigation,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import CustomHeader from '../../components/CustomHeader';
import CustomImage from '../../components/CustomImage';
import {commonFontStyle, wps} from '../../theme/fonts';
import CustomText from '../../components/CustomText';
import {useTranslation} from 'react-i18next';
import {SCREENS} from '../../navigation/screenNames';
import {getAuditsDetails} from '../../service/AuditService';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {navigationRef} from '../../navigation/RootContainer';
import {navigateTo} from '../../utils/commonFunction';
import {GET_AUDITS_DETAILS, IS_LOADING} from '../../redux/actionTypes';

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
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const {colors} = useTheme();
  const {fontValue} = useAppSelector(state => state.common);
  const {auditsDetailsList} = useAppSelector(state => state.home);

  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  useEffect(() => {
    onGetAudits();
  }, [isFocused]);

  useEffect(() => {
    dispatch({type: IS_LOADING, payload: true});
    dispatch({type: GET_AUDITS_DETAILS, payload: []});
  }, [dispatch]);

  const onGetAudits = async () => {
    let obj = {
      data: {
        id: params?.auditItem?.id,
      },
      onSuccess: () => {},
      onFailure: () => {},
    };
    dispatch(getAuditsDetails(obj));
  };

  const renderAudit = ({item, index}: any) => (
    <TouchableOpacity
      key={index}
      onPress={() => {
        navigate(SCREENS.TemplateScreen, {
          headerTitle: item?.filled_by,
          auditItem: params?.auditItem,
          auditDetails: item,
          type: 'edit',
        });
      }}
      style={styles.auditCard}>
      <CustomImage
        uri={item?.image ?? 'https://picsum.photos/200'}
        size={wps(28)}
        imageStyle={{borderRadius: wps(28)}}
      />
      <View>
        <CustomText text={item?.filled_by} style={styles.auditTitle} />
        {/* <CustomText style={styles.auditDescription}>
          {`${t('Last updated on')}${item.description}}`}
        </CustomText> */}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title={params?.headerTitle}
        subTitle={'22 Nov 2024'}
        showMap
        searchIcon
        showAdd
        onMapPress={() => {
          const filteredLocations = auditsDetailsList
            .map((item: any) => {
              const locationField = item.fields.find(
                (field: any) => field.template_field === 66,
              );
              return locationField ? {value: locationField.value} : null;
            })
            .filter((value: any) => value !== null);

          navigateTo(SCREENS.MapScreen, {
            headerTitle: params?.headerTitle,
            listData: filteredLocations,
          });
        }}
        onSearchPress={() => {
          navigateTo(SCREENS.SearchScreen, {});
        }}
        onShowAddPress={() => {
          navigateTo(SCREENS.TemplateScreen, {
            headerTitle: params?.headerTitle,
            auditItem: params?.auditItem,
            type: 'create',
          });
        }}
      />
      <FlatList
        data={auditsDetailsList}
        renderItem={renderAudit}
        keyExtractor={(item: any) => item?.response_id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
