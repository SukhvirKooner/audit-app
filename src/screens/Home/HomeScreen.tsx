import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {useTheme} from '@react-navigation/native';
import {
  commonApiCall,
  homeScreenList,
  navigateTo,
} from '../../utils/commonFunction';
import HomeListView from '../../components/Home/HomeListView';
import CustomHeader from '../../components/CustomHeader';
import {SCREENS} from '../../navigation/screenNames';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {getAsyncAudit, setAsyncAudit} from '../../utils/asyncStorageManager';
import NetInfo from '@react-native-community/netinfo';
import {GET_AUDITS} from '../../redux/actionTypes';

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const {auditsList} = useAppSelector(state => state.home);
  const {userInfo, groupList} = useAppSelector(state => state.common);
  const {colors} = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);

  useEffect(() => {
    (async () => {
      commonApiCall(dispatch);

      checkInternet();
    })();
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      if (auditsList?.length > 0) {
        const newList = await getAsyncAudit();

        if (newList?.length === 0) {
          setAsyncAudit(auditsList);
        }
        // const filterBy = groupList.filter((i: any) => i.name === 'Site');

        // const filterList = auditsList.filter((i: any) => {
        //   return i?.assigned_group === filterBy[0]?.id;
        // });

        // dispatch({type: GET_AUDITS, payload: filterList});
      }
    })();
  }, [auditsList]);

  const checkInternet = async () => {
    NetInfo.fetch().then(async state => {
      if (state.isConnected === false) {
        const newList = await getAsyncAudit();

        if (newList?.length !== 0) {
          dispatch({type: GET_AUDITS, payload: newList});
        }
      } else {
        setAsyncAudit(auditsList);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title={
          userInfo?.username ||
          userInfo?.first_name + ' ' + userInfo?.last_name ||
          'Ria Samuel'
        }
        subTitle={'Good Evening!'}
        notificationIcon={true}
        type="home"
        onNotificationPress={() => {
          navigateTo(SCREENS.NotificationScreen);
        }}
      />
      <FlatList
        data={homeScreenList}
        renderItem={({item, index}: any) => (
          <HomeListView
            data={item}
            progress={item?.progress}
            title={item?.title}
            subtitle={auditsList.length + ' ' + item?.subtitle}
            onPress={() => {
              navigateTo(SCREENS.Audits);
            }}
            key={index}
          />
        )}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapperStyle}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const getGlobalStyles = (props: any) => {
  const {colors} = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    columnWrapperStyle: {
      justifyContent: 'flex-start',
      // justifyContent: 'center',
      gap: 10,
      paddingHorizontal: 10,
      paddingTop: 10,
    },
  });
};
