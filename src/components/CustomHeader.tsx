import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation, useTheme} from '@react-navigation/native';
import {Icons} from '../theme/images';
import CustomImage from './CustomImage';
import {commonFontStyle, hp, hps, wps} from '../theme/fonts';
import CustomText from './CustomText';
import {useSelector} from 'react-redux';

const CustomHeader = ({
  title,
  subTitle,
  showAdd,
  showMap,
  onSearchPress,
  onMapPress,
  onShowAddPress,
  searchIcon,
}: any) => {
  const {colors} = useTheme();
  const {goBack} = useNavigation();
  const {fontValue} = useSelector(state => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  return (
    <View style={[styles.container, {marginHorizontal: wps(16), marginTop: 5}]}>
      <View style={styles.container}>
        <CustomImage source={Icons.ic_back} size={hps(24)} onPress={goBack} />
        <View style={{flex: 1, marginLeft: 8}}>
          <CustomText numberOfLines={1} text={title} style={styles.text} />
          {subTitle && <CustomText text={subTitle} style={styles.text1} />}
        </View>
        {searchIcon && (
          <CustomImage
            source={Icons.ic_search}
            size={hps(45)}
            containerStyle={{marginRight: 10}}
            onPress={onSearchPress}
          />
        )}
        {showMap && (
          <CustomImage
            onPress={onMapPress}
            source={Icons.ic_map}
            size={hps(45)}
          />
        )}
        {showAdd && (
          <CustomImage
            onPress={onShowAddPress}
            source={Icons.ic_add}
            size={hps(45)}
          />
        )}
      </View>
    </View>
  );
};

export default CustomHeader;

const getGlobalStyles = props => {
  const {colors, fontValue} = props;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    text: {
      ...commonFontStyle(600, 18 + fontValue, colors.black_B23),
    },
    text1: {
      ...commonFontStyle(400, 12 + fontValue, colors.gray_7B),
      marginTop: 2,
    },
  });
};
