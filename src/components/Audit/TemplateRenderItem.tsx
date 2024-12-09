/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {commonFontStyle} from '../../theme/fonts';
import {useTheme} from '@react-navigation/native';
import {useAppSelector} from '../../redux/hooks';
import {Dropdown} from 'react-native-element-dropdown';
import RenderRadioButton from '../RenderRadioButton';

// Define types for field options and validation rules
interface ValidationRule {
  rule_type: string;
  value: string | number | boolean;
}

interface FieldOptions {
  selection_type?: 'single' | 'multiple';
  choices?: string[];
  yes_label?: string;
  no_label?: string;
}
interface FormField {
  id: number;
  label: string;
  field_type: 'text' | 'number' | 'dropdown' | 'yes_no';
  is_required: boolean;
  options?: FieldOptions | null;
  section_heading: string;
  validation_rules: ValidationRule[];
  order: number;
  date?: any;
}

interface TemplateRenderItemProps {
  field: FormField;
  formValues: any;
  formErrors: any;
  handleInputChange: (id: number, value: any) => void;
  isEdit: boolean;
}

const TemplateRenderItem = ({
  field,
  formValues,
  formErrors,
  handleInputChange,
  isEdit,
}: TemplateRenderItemProps) => {
  const {colors} = useTheme();
  const {fontValue} = useAppSelector(state => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  const renderError = (fieldId: number) => {
    if (formErrors[fieldId]) {
      return <Text style={styles.errorText}>{formErrors[fieldId]}</Text>;
    }
    return null;
  };

  switch (field.field_type) {
    case 'text':
      return (
        <>
          <TextInput
            style={styles.input}
            placeholder={field.label}
            value={formValues[field.id] || ''}
            onChangeText={text => handleInputChange(field.id, text)}
            editable={isEdit}
          />
          {renderError(field.id)}
        </>
      );
    case 'number':
      return (
        <>
          <TextInput
            style={styles.input}
            placeholder={field.label}
            keyboardType="numeric"
            value={formValues[field.id] || ''}
            onChangeText={text => handleInputChange(field.id, text)}
            editable={isEdit}
          />
          {renderError(field.id)}
        </>
      );
    case 'dropdown':
      return (
        <>
          <Dropdown
            disable={!isEdit}
            style={styles.dropdown}
            data={
              field.options?.choices?.map(choice => ({
                label: choice,
                value: choice,
              })) || []
            }
            labelField="label"
            valueField="value"
            placeholder={field.label}
            value={formValues[field.id]}
            onChange={item => handleInputChange(field.id, item.value)}
          />
          {renderError(field.id)}
        </>
      );
    case 'date':
      return (
        <>
          <Dropdown
            disable={!isEdit}
            style={styles.dropdown}
            data={
              field.options?.choices?.map(choice => ({
                label: choice,
                value: choice,
              })) || []
            }
            labelField="label"
            valueField="value"
            placeholder={field.label}
            value={formValues[field.id]}
            onChange={item => handleInputChange(field.id, item.value)}
          />
          {renderError(field.id)}
        </>
      );
    case 'yes_no':
      return (
        <>
          <View
            style={{
              ...styles.switchContainer,
              justifyContent: 'flex-start',
              gap: 15,
            }}>
            <View style={{...styles.switchContainer, gap: 15}}>
              <Text>{field.options?.yes_label}</Text>
              <TouchableOpacity
                disabled={!isEdit}
                onPress={() => {
                  handleInputChange(field.id, field.options?.yes_label);
                }}>
                <RenderRadioButton
                  value={formValues[field.id] === field.options?.yes_label}
                />
              </TouchableOpacity>
            </View>
            <View style={{...styles.switchContainer, gap: 15}}>
              <Text>{field.options?.no_label}</Text>
              <TouchableOpacity
                disabled={!isEdit}
                onPress={() =>
                  handleInputChange(field.id, field.options?.no_label)
                }>
                <RenderRadioButton
                  value={formValues[field.id] === field.options?.no_label}
                />
              </TouchableOpacity>
            </View>
          </View>
          {renderError(field.id)}
        </>
      );
    default:
      return null;
  }
};

export default TemplateRenderItem;

const getGlobalStyles = ({colors, fontValue}: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    section: {
      // marginBottom: 20,
      gap: 20,
    },
    sectionTitleContainer: {
      backgroundColor: colors.black,
      marginTop: 20,
      padding: 10,
      borderRadius: 10,
    },
    sectionTitle: {
      ...commonFontStyle(400, fontValue + 16, colors.white),
      textAlign: 'center',
    },
    field: {
      // marginBottom: 15,
      gap: 5,
    },
    label: {
      ...commonFontStyle(400, fontValue + 16, colors.gray_B6),
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
    },
    dropdown: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    errorText: {
      ...commonFontStyle(400, fontValue + 12, colors.red),
    },
    extraStyle: {
      marginTop: 20,
    },
  });
};
