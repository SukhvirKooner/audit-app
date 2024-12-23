import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {useIsFocused, useTheme} from '@react-navigation/native';
import CustomHeader from '../../components/CustomHeader';
import CustomImage from '../../components/CustomImage';
import {Icons} from '../../theme/images';
import {commonFontStyle, hps} from '../../theme/fonts';
import CustomText from '../../components/CustomText';
import {navigationRef} from '../../navigation/RootContainer';
import {SCREENS} from '../../navigation/screenNames';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {getAudits} from '../../service/AuditService';
import {GET_AUDITS, IS_LOADING} from '../../redux/actionTypes';

const AuditScreen = () => {
  const {colors} = useTheme();
  const {fontValue, groupList} = useAppSelector((state: any) => state.common);
  const {auditsList} = useAppSelector(state => state.home);
  const isFocused = useIsFocused();

  const dispatch = useAppDispatch();
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  useEffect(() => {
    onGetAudits();
  }, [isFocused]);

  useEffect(() => {
    dispatch({type: IS_LOADING, payload: true});
  }, [dispatch]);

  const onGetAudits = async () => {
    const obj = {
      onSuccess: (res: any) => {
        // console.log(res);
        // const filterBy = groupList.filter((i: any) => i.name === 'Site');
        // const filterList = res.filter((i: any) => {
        //   return i?.assigned_group === filterBy[0]?.id || 2;
        // });
        // dispatch({type: GET_AUDITS, payload: filterList});
      },
      onFailure: (error: any) => {
        console.log('error', error);
      },
    };

    dispatch(getAudits(obj));
  };

  const renderAudit = ({item}: any) => (
    <TouchableOpacity
      onPress={() => {
        navigationRef.navigate(SCREENS.AuditDetailsScreen, {
          headerTitle: item.title,
          auditItem: item,
        });
      }}
      style={styles.auditCard}>
      <CustomText text={item?.title} style={styles.auditTitle} />
      <CustomText text={item?.description} style={styles.auditDescription} />
      <View style={styles.viewStyle} />
      <View style={styles.auditFooter}>
        <View style={styles.dateRow}>
          <CustomImage
            source={Icons.calendar}
            size={hps(24)}
            tintColor={colors.black}
          />
          <CustomText
            text={item?.start_date + ' - ' + item?.end_date}
            style={styles.dateText}
          />
        </View>
        <View style={styles.avatars}>
          {item?.avatars?.map((avatar: any, index: any) => (
            <Image
              key={index}
              source={{uri: avatar}}
              style={[styles.avatar, index > 2 && styles.extraAvatar]}
            />
          ))}
          {item?.avatars?.length > 3 && (
            <View style={styles.moreAvatar}>
              <Text style={styles.moreText}>+{item.avatars.length - 3}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title={'Audits'}
        subTitle={'22 Nov 2024'}
        searchIcon
        onSearchPress={() => {
          navigationRef.navigate(SCREENS.SearchScreen);
        }}
      />
      <FlatList
        data={auditsList}
        renderItem={renderAudit}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default AuditScreen;

const getGlobalStyles = props => {
  const {colors, fontValue} = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContainer: {
      padding: 16,
      flexGrow: 1,
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
    },
    auditTitle: {
      marginBottom: 4,
      ...commonFontStyle(600, 18 + fontValue, colors.black_B23),
    },
    auditDescription: {
      ...commonFontStyle(400, 12 + fontValue, colors.gray_7B),
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
    dateText: {
      ...commonFontStyle(400, 12 + fontValue, colors.black_B23),
      marginLeft: 2,
    },
    avatars: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 28,
      height: 28,
      borderRadius: 28,
      marginLeft: -12, // Overlapping effect
      borderWidth: 1,
      borderColor: colors.white,
    },
    extraAvatar: {
      opacity: 0.6,
    },
    moreAvatar: {
      backgroundColor: colors.mainBlue,
      width: 28,
      height: 28,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: -12,
      borderWidth: 1,
      borderColor: colors.white,
    },
    moreText: {
      color: colors.white,
      fontSize: 12,
      fontWeight: 'bold',
    },
  });
};
