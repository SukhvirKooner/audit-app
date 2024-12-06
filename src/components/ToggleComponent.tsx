import React, { useEffect, useMemo, useRef } from "react";
import { useTheme } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { useSelector } from "react-redux";
import { hp, wp } from "../theme/fonts";

const ToggleComponent = ({ value = false,
  onValueChange = () => { },
  disabled = false,
  trackColor,
  toggleContainerStyle,
  toggleWheel,
  isFood }) => {
  const { colors } = useTheme();
  const { fontValue } = useSelector((state) => state.common);
  const styles = React.useMemo(() => getGlobalStyles({ colors, fontValue }), [colors, fontValue]);

  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;
  const TOGGLE_LEFT_MARGIN = Platform.isPad ? 6 : 3;
  const TOGGLE_RIGHT_MARGIN = Platform.isPad ? 40 : 19;
  const moveToggle = useMemo(
    () =>
      animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [TOGGLE_LEFT_MARGIN, TOGGLE_RIGHT_MARGIN],
      }),
    [animatedValue],
  );


  const opacity = disabled ? 0.5 : 1;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      easing: Easing.elastic(0.9),
      useNativeDriver: false,
    }).start();
  }, [value]);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={disabled ? undefined : () => onValueChange(!value)}>
        <View
          style={[
            styles.toggleContainer,
            { backgroundColor: trackColor, opacity }, toggleContainerStyle
          ]}>
          <Animated.View
            style={[styles.toggleWheelStyle, { marginLeft: moveToggle }, toggleWheel]}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );


};

const TOGGLE_LEFT_MARGIN = Platform.isPad ? 4 : 3;
const TOGGLE_RIGHT_MARGIN = 22;
const getGlobalStyles = (props) => {
  const { colors, fontValue } = props;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    toggleContainer: {
      width: wp(10),
      height: Platform.isPad ? hp(4) : hp(2.9),
      marginLeft: TOGGLE_LEFT_MARGIN,
      borderRadius: wp(10),
      justifyContent: 'center',
    },
    toggleWheelStyle: {
      width: wp(4.6),
      height: wp(4.6),
      borderRadius: wp(4.6),
      shadowColor: '#000',
      backgroundColor: 'white',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2.5,
      elevation: 1.5,
    },
  });
};

export default ToggleComponent;
