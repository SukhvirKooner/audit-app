/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import React, {useState} from 'react';
import {commonFontStyle} from '../theme/fonts';
import {light_theme} from '../theme/colors';
import {Icons} from '../theme/images';
import {useTheme} from '@react-navigation/native';
import {useSelector} from 'react-redux';

type Props = {
  value?: string;
  onChangeText?: (text: string) => void;
  icon?: any;
  placeHolder?: string;
  title?: string;
  extraStyle?: ViewStyle;
  maxLength?: number;
  RenderRightIcon?: any;
  multiline?: boolean;
  textInputStyle?: ViewStyle;
  editable?: boolean;
  secureTextEntry?: boolean;
  iconTintColor?: any;
  inputContainer?: ViewStyle;
  textAlignVertical?: 'top' | 'center' | 'bottom';
  props?: TextInputProps;
  isRequired?: boolean;
};

const Input = ({
  value,
  secureTextEntry = false,
  onChangeText,
  editable = true,
  icon,
  placeHolder,
  textInputStyle,
  RenderRightIcon,
  title,
  extraStyle,
  maxLength,
  multiline = false,
  iconTintColor = undefined,
  inputContainer,
  textAlignVertical,
  isRequired = false,
  ...props
}: Props) => {
  const [passwordHide, setPasswordHide] = useState(true);

  const {colors} = useTheme();
  const {fontValue} = useSelector((state: any) => state.common);

  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  return (
    <View style={extraStyle}>
      {title && (
        <Text style={styles.title}>
          {title}
          {isRequired && <Text style={{color: 'red'}}>*</Text>}
        </Text>
      )}
      <View style={{...styles.rowView, ...inputContainer}}>
        {icon && (
          <Image
            source={icon}
            style={[styles.icon, {tintColor: iconTintColor}]}
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={[styles.inputStyle, textInputStyle]}
          maxLength={maxLength}
          placeholder={placeHolder}
          placeholderTextColor={light_theme.gray_62}
          multiline={multiline}
          editable={editable}
          secureTextEntry={secureTextEntry ? passwordHide : false}
          textAlignVertical={textAlignVertical}
          {...props}
        />
        {RenderRightIcon && <RenderRightIcon />}
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setPasswordHide(!passwordHide)}>
            <Image
              source={passwordHide ? Icons.view : Icons.hide}
              style={styles.imageView}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Input;

const getGlobalStyles = (props: any) => {
  const {colors, fontValue} = props;
  return StyleSheet.create({
    title: {
      ...commonFontStyle(500, fontValue + 13, colors.black),
    },
    inputStyle: {
      flex: 1,
      height: 40,
      ...commonFontStyle(400, fontValue+16, colors.black),
    },
    rowView: {
      borderWidth: 1,
      borderColor: colors.gray_E7,
      borderRadius: 10,
      marginTop: 8,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      gap: 10,
    },
    icon: {
      height: 20,
      width: 20,
      resizeMode: 'contain',
    },
    imageView: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
      marginLeft: 12,
      tintColor: colors.gray_62,
    },
  });
};
