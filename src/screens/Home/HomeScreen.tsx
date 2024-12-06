import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import {homeScreenList} from '../../utils/commonFunction';
import HomeListView from '../../components/Home/HomeListView';
import CustomHeader from '../../components/CustomHeader';
import {SCREENS} from '../../navigation/screenNames';

const HomeScreen = () => {
  const {navigate} = useNavigation();
  const {colors} = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
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
