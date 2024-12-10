import {SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import CustomHeader from '../components/CustomHeader';
import {useTheme} from '@react-navigation/native';
import {useAppSelector} from '../redux/hooks';

const SearchScreen = () => {
  const {colors} = useTheme();
  const {fontValue} = useAppSelector((state: any) => state.common);

  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title={'Search'} />
    </SafeAreaView>
  );
};

export default SearchScreen;
const getGlobalStyles = ({colors}: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });
};
