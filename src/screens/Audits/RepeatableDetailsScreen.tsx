/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import {Icons} from '../../theme/images';

const RepeatableDetailsScreen = () => {
  const {params}: any = useRoute();
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const {colors} = useTheme();
  const {fontValue} = useAppSelector(state => state.common);
  const {repeatableAuditsDetailsList} = useAppSelector(state => state.home);
  const [templateData, setTemplateData] = React.useState<any>(null);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  console.log('repeatableAuditsDetailsList', repeatableAuditsDetailsList);

  const [getAllData, setGetAllData] = useState([]);

  // console.log('templateData', templateData);

  useEffect(() => {
    // onGetAudits();
    setTemplateData(params?.templateData);
  }, []);

  useEffect(() => {
    // dispatch({type: IS_LOADING, payload: true});
    // dispatch({type: GET_AUDITS_DETAILS, payload: []});
    // onGetTemplate();
  }, [dispatch]);

  // const onGetAudits = async () => {
  //   let obj = {
  //     data: {
  //       id: params?.auditItem?.id,
  //     },
  //     onSuccess: () => {},
  //     onFailure: () => {},
  //   };
  //   dispatch(getAuditsDetails(obj));
  // };

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
    navigateTo(SCREENS.RepeatableTemplateScreen, {
      headerTitle: params?.headerTitle,
      auditItem: params?.auditItem,
      headerId: params?.headerId,
      templateData: params?.templateData,
      auditDetails: params?.auditDetails,
      audit: params?.audit,
      type: 'view',
    });
  };

  console.log(
    'params?.auditDetails',
    params?.auditDetails?.fields.filter(
      i => i?.template_field == params?.headerId,
    ),
  );

  const onDeletePress = (item, id) => {
    const newValue = repeatableAuditsDetailsList
      ?.filter(list => list?.audit == params?.headerId)
      .filter((item, index) => index !== id);

    dispatch({type: GET_REPEATABLE_AUDITS_DETAILS, payload: newValue});
  };
  const renderAudit = ({item, index}: any) => (
    <TouchableOpacity
      key={index}
      onPress={() => {
        getDetails(item);
      }}
      style={styles.auditCard}>
      <View style={{flexDirection: 'row'}}>
        {!params?.isEdit ? (
          <CustomText
            text={params.headerId + '-' + `${index + 1}`}
            style={styles.auditTitle}
          />
        ) : (
          <CustomText
            text={item?.audit + '-' + `${index + 1}`}
            style={styles.auditTitle}
          />
        )}
        {params?.isEdit && (
          <TouchableOpacity
            onPress={() => {
              onDeletePress(item, index);
            }}>
            <Image
              source={Icons.delete}
              style={{
                width: 18,
                height: 18,
                tintColor: colors.black,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        )}
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
        // subTitle={'22 Nov 2024'}
        // showMap
        showAdd={params?.isEdit}
        // refreshIcon={true}
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
          navigateTo(SCREENS.RepeatableTemplateScreen, {
            headerTitle: params?.headerTitle,
            templateData: params?.templateData,
            auditItem: params?.auditItem,
            headerId: params?.headerId,
            audit: params?.audit,
            type: 'create',
          });
        }}
      />
      {!params?.isEdit ? (
        <FlatList
          data={params?.auditDetails?.fields.filter(
            i => i?.template_field == params?.headerId,
          )}
          // data={[]}
          renderItem={renderAudit}
          keyExtractor={(item: any) => item?.response_id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={repeatableAuditsDetailsList?.filter(
            list => list?.audit == params?.headerId,
          )}
          renderItem={renderAudit}
          keyExtractor={(item: any) => item?.response_id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default RepeatableDetailsScreen;

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
      flex: 1,
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
