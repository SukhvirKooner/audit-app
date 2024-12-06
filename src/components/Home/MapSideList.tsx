import {StyleSheet, View} from 'react-native';
import React from 'react';
import CustomImage from '../CustomImage';
import {hps} from '../../theme/fonts';
import {Icons} from '../../theme/images';

const MapSideList = () => {
  return (
    <View style={styles.container}>
      <CustomImage source={Icons.map1} size={hps(45)} />
      <CustomImage source={Icons.map2} size={hps(45)} />
      <CustomImage source={Icons.filter} size={hps(45)} />
      <CustomImage source={Icons.plus} size={hps(45)} />
    </View>
  );
};

export default MapSideList;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    gap: 5,
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
