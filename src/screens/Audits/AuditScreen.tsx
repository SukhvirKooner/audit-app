import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import CustomHeader from '../../components/CustomHeader';
import CustomImage from '../../components/CustomImage';
import {Icons} from '../../theme/images';
import {commonFontStyle, hps} from '../../theme/fonts';
import {useSelector} from 'react-redux';
import CustomText from '../../components/CustomText';
import {navigationRef} from '../../navigation/RootContainer';
import {screenNames} from '../../navigation/screenNames';

const audits = [
  {
    id: '1',
    title: 'Check Ambulance TS 456789',
    description: 'Update Maintenance Check',
    date: 'Mon, 10 July 2022',
    avatars: [
      'https://picsum.photos/200',
      'https://picsum.photos/200',
      'https://picsum.photos/200',
    ],
  },
  {
    id: '2',
    title: 'Site Inspection',
    description: 'g4C Highway lane',
    date: 'Mon, 10 July 2022',
    avatars: [
      'https://picsum.photos/200',
      'https://picsum.photos/200',
      'https://picsum.photos/200',
      'https://picsum.photos/200',
    ],
  },
  {
    id: '3',
    title: 'Traffic Signal Survey',
    description: 'Check Road condition, report and update the status',
    date: 'Mon, 10 July 2022',
    avatars: [
      'https://picsum.photos/200',
      'https://picsum.photos/200',
      'https://picsum.photos/200',
      'https://picsum.photos/200',
      'https://picsum.photos/200',
    ],
  },
];

const AuditScreen = () => {
  const {colors} = useTheme();
  const {fontValue} = useSelector(state => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  const renderAudit = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        navigationRef.navigate(screenNames.AuditDetailsScreen, {
          headerTitle: item.title,
        });
      }}
      style={styles.auditCard}>
      <CustomText text={item.title} style={styles.auditTitle} />
      <CustomText text={item.description} style={styles.auditDescription} />
      <View style={styles.viewStyle} />
      <View style={styles.auditFooter}>
        <View style={styles.dateRow}>
          <CustomImage source={Icons.calendar} size={hps(24)} />
          <CustomText text={item.date} style={styles.dateText} />
        </View>
        <View style={styles.avatars}>
          {item.avatars.map((avatar, index) => (
            <Image
              key={index}
              source={{uri: avatar}}
              style={[styles.avatar, index > 2 && styles.extraAvatar]}
            />
          ))}
          {item.avatars.length > 3 && (
            <View style={styles.moreAvatar}>
              <Text style={styles.moreText}>+{item.avatars.length - 3}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title={'Audits'}
        subTitle={'22 Nov 2024'}
        showAdd
        searchIcon
      />
      <FlatList
        data={audits}
        renderItem={renderAudit}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default AuditScreen;

const getGlobalStyles = props => {
  const {colors, fontValue} = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContainer: {
      padding: 16,
      flex: 1,
    },
    viewStyle: {
      borderWidth: 0.8,
      borderColor: colors.gray_DF,
      marginVertical: 16,
    },
    auditCard: {
      backgroundColor: colors.white,
      borderRadius: 20,
      padding: 16,
      marginBottom: 10,
      shadowColor: colors.black,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    auditTitle: {
      marginBottom: 4,
      ...commonFontStyle(600, 18 + fontValue, colors.black_B23),
    },
    auditDescription: {
      ...commonFontStyle(400, 12 + fontValue, colors.gray_7B),
    },
    auditFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    dateText: {
      ...commonFontStyle(400, 12 + fontValue, colors.black_B23),
      marginLeft: 2,
    },
    avatars: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 28,
      height: 28,
      borderRadius: 28,
      marginLeft: -12, // Overlapping effect
      borderWidth: 1,
      borderColor: colors.white,
    },
    extraAvatar: {
      opacity: 0.6,
    },
    moreAvatar: {
      backgroundColor: colors.naveBg,
      width: 28,
      height: 28,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: -12,
      borderWidth: 1,
      borderColor: colors.white,
    },
    moreText: {
      color: colors.white,
      fontSize: 12,
      fontWeight: 'bold',
    },
  });
};
