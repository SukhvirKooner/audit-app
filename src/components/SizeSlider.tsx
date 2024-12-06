import React, {useState} from 'react';
import {useTheme} from '@react-navigation/native';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  View,
  Dimensions,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Slider from '@react-native-community/slider';
import {commonFontStyle} from '../theme/fonts';

const SizeSlider = ({onPress}) => {
  const {colors} = useTheme();
  const {fontValue} = useSelector(state => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  const {t} = useTranslation();
  const fontSizes = {
    small: -2,
    default: 0,
    medium: 2,
    large: 4,
  };
  const sliderWidth = Dimensions.get('window').width - 70; // Adjust for padding

  const fontSizeOptions = [
    {label: t('Small'), size: fontSizes.small, position: 0, id: 0},
    {
      label: t('Default'),
      size: fontSizes.default,
      position: sliderWidth / 3.1,
      id: 1,
    },
    {
      label: t('Medium'),
      size: fontSizes.medium,
      position: (sliderWidth / 3) * 1.95,
      id: 2,
    },
    {label: t('Large'), size: fontSizes.large, position: sliderWidth, id: 3},
  ];

  const [sliderValue, setSliderValue] = useState(
    fontSizeOptions.filter(list => list.size === fontValue)[0]?.id,
  ); // Default position

  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={3}
        step={1}
        value={sliderValue}
        onValueChange={value => {
          console.log('value', value);
          onPress(fontSizeOptions[value]);
          setSliderValue(value);
        }}
        minimumTrackTintColor="#d3d3d3"
        maximumTrackTintColor={'#d3d3d3'}
        thumbTintColor={colors.mainBlue}
      />
      <View style={styles.labelContainer}>
        {fontSizeOptions?.map((item, index) => (
          <Text
            key={index}
            style={[styles.label, sliderValue === index && styles.activeLabel]}>
            {item?.label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const getGlobalStyles = props => {
  const {colors, fontValue} = props;
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      marginBottom: 10,
    },
    slider: {
      width: '102%',
      height: 32,
    },
    labelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '96%',
    },
    label: {
      ...commonFontStyle(400, 13 + fontValue, colors.black),
    },
    activeLabel: {
      ...commonFontStyle(500, 13 + fontValue, colors.black),
    },
  });
};

export default SizeSlider;
