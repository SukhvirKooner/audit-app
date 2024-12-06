/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomHeader from '../../components/CustomHeader';
import {light_theme} from '../../theme/colors';
import EmptyComponent from '../../components/EmptyComponent';

const NotificationScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title={'Notifications'} />

      <FlatList
        data={[]}
        renderItem={({item}: any) => (
          <View>
            <></>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}
        ListEmptyComponent={() => <EmptyComponent title="No notifications" />}
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: light_theme.background,
  },
});
