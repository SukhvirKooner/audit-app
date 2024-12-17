import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import {commonApiCall, homeScreenList} from '../../utils/commonFunction';
import HomeListView from '../../components/Home/HomeListView';
import CustomHeader from '../../components/CustomHeader';
import {SCREENS} from '../../navigation/screenNames';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import axios from 'axios';
import {getAsyncAudit, setAsyncAudit} from '../../utils/asyncStorageManager';
import NetInfo from '@react-native-community/netinfo';
import {GET_AUDITS} from '../../redux/actionTypes';

const HomeScreen = () => {
  const {navigate} = useNavigation();
  const dispatch = useAppDispatch();
  const {auditsList} = useAppSelector(state => state.home);
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
        title={'Riya Samuel'}
        subTitle={'Good Evening!'}
        notificationIcon={true}
        type="home"
        onNotificationPress={() => {
          navigate(SCREENS.NotificationScreen);
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
              navigate(SCREENS.Audits);
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
