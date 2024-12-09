import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Animated, StyleSheet} from 'react-native';

interface Props {
  isToggleOn?: boolean;
  onToggleSwitch?: () => void;
  trackColor?: any;
}
const ToggleComponent = ({
  isToggleOn = false,
  onToggleSwitch = () => {},
  trackColor,
}: Props) => {
  const {colors}: any = useTheme();

  const [isOn, setIsOn] = useState(false);
  const togglePosition = new Animated.Value(isOn ? 1 : 0);

  useEffect(() => {
    setIsOn(isToggleOn);
  }, [isToggleOn]);
  const toggleSwitch = () => {
    Animated.timing(togglePosition, {
      toValue: isOn ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsOn(!isOn);
    onToggleSwitch();
  };

  const interpolatedBackgroundColor = togglePosition.interpolate({
    inputRange: [0, 1],
    outputRange: trackColor || ['#b0b0b0', colors.mainBlue], // Colors for off and on states
  });

  const interpolatedTranslateX = togglePosition.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22], // Adjust these values based on the switch width
  });

  return (
    <TouchableOpacity onPress={toggleSwitch} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.switchContainer,
          {backgroundColor: interpolatedBackgroundColor},
        ]}>
        <Animated.View
          style={[
            styles.circle,
            {transform: [{translateX: interpolatedTranslateX}]},
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 50,
    height: 30,
    borderRadius: 30,
    padding: 4,
    justifyContent: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 13,
    backgroundColor: '#FFF',
  },
});

export default ToggleComponent;
