import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import CustomImage from './CustomImage';
import {hps} from '../theme/fonts';
import {Icons} from '../theme/images';

interface Props {
  isChecked: boolean;
  onPress?: () => void;
}

const RenderCheckbox = ({isChecked, onPress}: Props) => {
  const {colors}: any = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      disabled={onPress ? false : true}
      onPress={onPress}
      style={styles.container}>
      {isChecked && (
        <CustomImage
          source={Icons.tick}
          size={hps(12)}
          tintColor={colors.naveBg}
        />
      )}
    </TouchableOpacity>
  );
};

export default RenderCheckbox;

const getGlobalStyles = ({colors}: any) => {
  return StyleSheet.create({
    container: {
      height: 20,
      width: 20,
      borderRadius: 2,
      borderWidth: 1,
      borderColor: colors.gray_E7,
      alignItems: 'center',
      justifyContent: 'center',
    },
    innerView: {
      height: 10,
      width: 10,
      borderRadius: 10,
      backgroundColor: colors.naveBg,
    },
  });
};
