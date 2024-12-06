import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {homeScreenList} from '../../utils/commonFunction';
import HomeListView from '../../components/Home/HomeListView';
import CustomHeader from '../../components/CustomHeader';

const HomeScreen = () => {
  const {colors} = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title={'Audits'} subTitle={'22 Nov 2024'} showMap />
      <FlatList
        data={homeScreenList}
        renderItem={({item, index}: any) => <HomeListView data={item} />}
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
      gap: 10,
      paddingHorizontal: 10,
    },
  });
};
