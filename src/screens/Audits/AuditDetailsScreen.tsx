/* eslint-disable react-native/no-inline-styles */
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
import CustomImage from '../../components/CustomImage';
import {commonFontStyle, wps} from '../../theme/fonts';
import CustomText from '../../components/CustomText';
import {SCREENS} from '../../navigation/screenNames';
import {
  getAuditsDetails,
  getAuditsDetailsByID,
  getTemplate,
} from '../../service/AuditService';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {navigateTo} from '../../utils/commonFunction';
import {
  GET_AUDITS_DETAILS,
  GET_REPEATABLE_AUDITS_DETAILS,
  IS_LOADING,
} from '../../redux/actionTypes';

const AuditDetailsScreen = () => {
  const {params}: any = useRoute();
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const {colors} = useTheme();
  const {fontValue} = useAppSelector(state => state.common);
  const {auditsDetailsList} = useAppSelector(state => state.home);
  const [templateData, setTemplateData] = React.useState<any>(null);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );
  // console.log('templateData', templateData);

  useEffect(() => {
    onGetAudits();
  }, [isFocused]);

  useEffect(() => {
    dispatch({type: IS_LOADING, payload: true});
    dispatch({type: GET_AUDITS_DETAILS, payload: []});
    onGetTemplate();
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

  const onGetTemplate = async () => {
    let obj = {
      data: {
        id: params?.auditItem?.template,
      },
      onSuccess: (res: any) => {
        setTemplateData(res);
      },
      onFailure: (error: any) => {
        console.log('error', error);
      },
    };
    dispatch(getTemplate(obj));
  };

  const getTitle = (fields: any) => {
    let title = '';
    const identifier = templateData?.identifer;

    const newData = templateData?.fields?.find(
      (field: any) => field?.label === identifier,
    );

    fields?.forEach((field: any) => {
      if (field?.template_field === newData?.id) {
        title = field?.value;
      }
    });
    return title ?? identifier;
  };

  const getDetails = (item: any) => {
    const obj = {
      data: item.response_id,
      onSuccess: (res: any) => {
        dispatch({type: GET_REPEATABLE_AUDITS_DETAILS, payload: []});

        navigateTo(SCREENS.TemplateScreen, {
          headerTitle: getTitle(item.fields),
          auditItem: params?.auditItem,
          auditDetails: res,
          type: 'view',
        });
      },
      onFailure: () => {},
    };
    dispatch(getAuditsDetailsByID(obj));
  };
  const renderAudit = ({item, index}: any) => (
    <TouchableOpacity
      key={index}
      onPress={() => {
        getDetails(item);
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
          text={item?.response_id + '-' + getTitle(item.fields)}
          style={styles.auditTitle}
        />
        {/* <CustomText style={styles.auditDescription}>
          {`${t('Last updated on')}${item.description}}`}
        </CustomText> */}
      </View>
    </TouchableOpacity>
  );
  const getLocationID = (fields: any[]) => {
    for (const field of fields || []) {
      if (field?.field_type === 'location') {
        return field?.id;
      }

      if (field?.field_type === 'section') {
        const subField = field?.sub_fields?.find(
          (mItem: any) => mItem?.field_type === 'location',
        );
        if (subField) {
          return subField?.id;
        }
      }
    }
    return null;
  };

  const getFilteredLocations = (auditsDetailsList: any[], locationID: any) => {
    return auditsDetailsList
      .map((item: any) => {
        const locationField = item.fields.find(
          (IField: any) => IField.template_field === locationID,
        );
        return locationField ? {value: locationField.value} : null;
      })
      .filter((value: any) => value !== null);
  };
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title={params?.headerTitle}
        subTitle={'22 Nov 2024'}
        showMap
        showAdd
        refreshIcon={true}
        onRefreshPress={() => {
          navigateTo(SCREENS.SyncDataScreen, {
            templateData: templateData,
            headerTitle: params?.headerTitle,
            auditItem: params?.auditItem,
          });
        }}
        onMapPress={() => {
          const locationID = getLocationID(templateData?.fields);

          const filteredLocations = getFilteredLocations(
            auditsDetailsList,
            locationID,
          );
          navigateTo(SCREENS.MapScreen, {
            headerTitle: params?.headerTitle,
            listData: filteredLocations,
          });
        }}
        onSearchPress={() => {
          navigateTo(SCREENS.SearchScreen, {});
        }}
        onShowAddPress={() => {
          dispatch({type: GET_REPEATABLE_AUDITS_DETAILS, payload: []});
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
