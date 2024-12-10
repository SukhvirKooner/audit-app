/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';

type Props = {
  value: Boolean;
  type?: 'dark' | 'light';
};

const RenderRadioButton = ({value, type}: Props) => {
  const {colors}: any = useTheme();
  const styles = React.useMemo(() => getGlobalStyles({colors}), [colors]);

  if (type && type === 'dark') {
    return (
      <View
        style={[
          styles.mainRound,
          {
            borderColor: value ? colors.mainBlue : colors.gray_E7,
            borderWidth: value ? 5 : 1,
          },
        ]}>
        {/* {value && <View style={styles.innerView} />} */}
      </View>
    );
  } else
    return (
      <View
        style={[
          styles.mainRound,
          {borderColor: value ? colors.mainBlue : colors.gray_E7},
        ]}>
        {value && <View style={styles.innerView} />}
      </View>
    );
};

export default RenderRadioButton;

const getGlobalStyles = ({colors}: any) => {
  return StyleSheet.create({
    mainRound: {
      height: 20,
      width: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.gray_B6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    innerView: {
      height: 10,
      width: 10,
      borderRadius: 10,
      backgroundColor: colors.mainBlue,
    },
  });
};
