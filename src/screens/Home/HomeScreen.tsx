import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {light_theme} from '../../theme/colors';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>HomeScreen</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: light_theme.background,
  },
});
