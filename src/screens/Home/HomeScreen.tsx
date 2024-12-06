import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {light_theme} from '../../theme/colors';
import {useTheme} from '@react-navigation/native';
import {homeScreenList} from '../../utils/commonFunction';
import HomeListView from '../../components/Home/HomeListView';

const HomeScreen = () => {
  const {colors} = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);
  return (
    <SafeAreaView style={styles.container}>
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
