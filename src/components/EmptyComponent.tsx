import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomText from './CustomText';
import {useSelector} from 'react-redux';
import {useTheme} from '@react-navigation/native';
import {commonFontStyle} from '../theme/fonts';
interface Props {
  title: string;
}

const EmptyComponent = ({title}: Props) => {
  const {colors} = useTheme();
  const {fontValue} = useSelector((state: any) => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  return (
    <View style={styles.container}>
      <CustomText text={title} style={styles.titleStyle} />
    </View>
  );
};

export default EmptyComponent;

const getGlobalStyles = (props: any) => {
  const {colors, fontValue}: any = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleStyle: {
      ...commonFontStyle(500, 25 + fontValue, colors.gray_7B),
    },
  });
};
