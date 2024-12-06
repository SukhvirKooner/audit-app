import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {Icons} from '../theme/images';
import CustomImage from './CustomImage';
import {hp, hps} from '../theme/fonts';

const CustomHeader = () => {
  const {colors} = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);

  return (
    <View style={styles.container}>
      <CustomImage source={Icons.ic_back} size={hps(24)} />

      <Text>AuditScreen</Text>
    </View>
  );
};

export default CustomHeader;

const getGlobalStyles = props => {
  const {colors, fontValue} = props;
  return StyleSheet.create({});
};
