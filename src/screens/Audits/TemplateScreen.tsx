/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../components/CustomHeader';
import {useRoute, useTheme} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {
  createAudits,
  editAudits,
  getTemplate,
} from '../../service/AuditService';
import {Dropdown} from 'react-native-element-dropdown';
import {commonFontStyle, hp, hps} from '../../theme/fonts';
import CustomText from '../../components/CustomText';
import CustomButton from '../../components/CustomButton';
import {useTranslation} from 'react-i18next';
import RenderRadioButton from '../../components/RenderRadioButton';
import {navigationRef} from '../../navigation/RootContainer';
import CustomImage from '../../components/CustomImage';
import {Icons} from '../../theme/images';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import MapView from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import {GOOGLE_API_KEY} from '../../utils/apiConstants';
import Geolocation from 'react-native-geolocation-service';
import {requestPermission} from '../../utils/locationHandler';

Geocoder.init(GOOGLE_API_KEY, {language: 'en'});

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
  location?: any;
}

// Utility function to group fields by section
const groupBySection = (data: FormField[]) => {
  if (!data) {
    return {};
  }
  return data.reduce<Record<string, FormField[]>>((sections, field) => {
    const {section_heading} = field;
    if (!sections[section_heading]) {
      sections[section_heading] = [];
    }
    sections[section_heading].push(field);
    return sections;
  }, {});
};

const TemplateScreen = () => {
  const {t} = useTranslation();
  const {params}: any = useRoute();
  const dispatch = useAppDispatch();
  const {colors} = useTheme();
  const {fontValue} = useAppSelector(state => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  const [templateData, setTemplateData] = React.useState<FormField[]>([]);

  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const sections = groupBySection(templateData);

  const [formErrors, setFormErrors] = useState<Record<number, string>>({});

  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState<any>(null);

  useEffect(() => {
    onGetTemplate();

    if (params?.type === 'edit') {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
    getAddress();
  }, []);

  const getAddress = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied');
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        try {
          const response = await Geocoder.from(latitude, longitude);
          const formattedAddress: any = response.results[0].formatted_address;
          console.log('formattedAddress', formattedAddress);
          setAddress({
            latitude: latitude,
            longitude: longitude,
            address: formattedAddress,
          });
        } catch (error) {
          Alert.alert('Error', 'Failed to get address');
        }
      },
      error => {
        Alert.alert('Error', error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  useEffect(() => {
    // Merging form template with values data
    if (params?.auditDetails?.fields?.length !== 0 && params?.type === 'edit') {
      const newData = params?.auditDetails?.fields.reduce(
        (acc: any, item: any) => {
          acc[item.template_field] = item.value;
          return acc;
        },
        {},
      );
      setFormValues(newData);
    }
  }, [params?.auditDetails?.fields, params?.type]);

  const onGetTemplate = async () => {
    let obj = {
      data: {
        id: params?.auditItem?.template,
      },
      onSuccess: (res: any) => {
        console.log('params?.auditDetails?.fields', res?.fields);

        setTemplateData(res?.fields);
      },
      onFailure: (error: any) => {
        console.log('error', error);
      },
    };
    dispatch(getTemplate(obj));
  };

  // Update form values on input change
  const handleInputChange = (id: number, value: any) => {
    setFormValues(prev => ({...prev, [id]: value}));

    // Clear the error for the field being updated
    setFormErrors(prev => {
      const updatedErrors = {...prev};
      delete updatedErrors[id]; // Remove the error for this field
      return updatedErrors;
    });
  };

  const validateField = (field: FormField, value: any): string | null => {
    const {validation_rules, label, is_required} = field;

    if (is_required && (value === undefined || value === '')) {
      return `${label} is required.`;
    }

    for (const rule of validation_rules) {
      switch (rule.rule_type) {
        case 'regex':
          const regex = new RegExp(rule.value as string);
          if (!regex.test(value)) {
            return `${label} is invalid.`;
          }
          break;
        case 'min_length':
          if (value?.length < rule.value) {
            return `${label} must be at least ${rule.value} characters long.`;
          }
          break;
        case 'max_length':
          if (value?.length > rule.value) {
            return `${label} must be no more than ${rule.value} characters long.`;
          }
          break;
        case 'min_value':
          if (Number(value) < Number(rule.value)) {
            return `${label} must be at least ${rule.value}.`;
          }
          break;
        case 'max_value':
          if (Number(value) > Number(rule.value)) {
            return `${label} must be no more than ${rule.value}.`;
          }
          break;
        case 'only_numbers':
          if (rule.value && !/^\d+$/.test(value)) {
            return `${label} must contain only numbers.`;
          }
          break;
        case 'only_text':
          if (rule.value && !/^[a-zA-Z\s]+$/.test(value)) {
            return `${label} must contain only letters.`;
          }
          break;
        default:
          break;
      }
    }

    return null;
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const errors: Record<number, string> = {};

    templateData.forEach(field => {
      const error = validateField(field, formValues[field.id]);
      if (error) {
        isValid = false;
        errors[field.id] = error;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const convertData = (data: any) => {
    return Object.entries(data).map(([key, value]) => ({
      template_field: key,
      value: value,
    }));
  };

  const handleSubmit = () => {
    if (validateForm()) {
      if (params?.type === 'edit') {
        const obj = {
          data: {
            response_id: params?.auditDetails?.response_id,
            filled_by: 1,
            audit: params.auditItem.id,
            fields: convertData(formValues),
          },
          onSuccess: () => {
            navigationRef.goBack();
          },
          onFailure: () => {},
        };

        console.log('obj-->', obj.data);
        dispatch(editAudits(obj));
      } else {
        const obj = {
          data: {
            filled_by: 1,
            audit: params.auditItem.id,
            fields: convertData(formValues),
          },
          onSuccess: () => {
            navigationRef.goBack();
          },
          onFailure: () => {},
        };

        dispatch(createAudits(obj));
      }
    } else {
      console.log('Form has errors');
    }
  };

  const renderError = (fieldId: number) => {
    if (formErrors[fieldId]) {
      return <Text style={styles.errorText}>{formErrors[fieldId]}</Text>;
    }
    return null;
  };
  // Render individual fields
  const renderField = (field: FormField) => {
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
      case 'location':
        return (
          <>
            <View style={styles.locationContainer}>
              <MapView
                initialRegion={{
                  latitude: 37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}
                provider="google"
                style={{flex: 1}}
              />
            </View>
            {renderError(field.id)}
          </>
        );
      case 'date':
        return (
          <>
            <TouchableOpacity
              disabled={!isEdit}
              onPress={() => setOpen(true)}
              style={{...styles.dateContainer, gap: 15}}>
              <CustomImage source={Icons.calendar} size={hps(25)} />
              <CustomText
                text={
                  formValues[field.id]
                    ? moment(formValues[field.id]).format('DD/MM/YYYY')
                    : 'Select Date'
                }
                style={{flex: 1}}
              />
            </TouchableOpacity>
            <DatePicker
              modal
              open={open}
              mode="date"
              theme="auto"
              minimumDate={new Date()}
              date={new Date(formValues[field.id])}
              onConfirm={date => {
                setOpen(false);
                // setDate(date);
                handleInputChange(field.id, date);
              }}
              onCancel={() => {
                setOpen(false);
              }}
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

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title={params?.headerTitle}
        subTitle={'22 Nov 2024'}
        downloadIcon
        refreshIcon={params?.type === 'edit' ? false : true}
        showMap
        editIcon={params?.type === 'edit' ? true : false}
        onEditPress={() => {
          setIsEdit(!isEdit);
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={hp(1)}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'ios' ? hp(8) : hp(10),
            marginHorizontal: 16,
          }}
          showsVerticalScrollIndicator={false}>
          {Object.keys(sections).map((section, index) => (
            <View key={index} style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>{section}</Text>
              </View>
              {sections[section].map(field => (
                <View key={field.id} style={styles.field}>
                  <CustomText style={styles.label}>
                    {field.label}
                    <Text style={{color: 'red'}}>
                      {field.is_required ? '*' : ''}
                    </Text>
                  </CustomText>
                  {renderField(field)}
                </View>
              ))}
            </View>
          ))}
          {params?.type === 'edit' && isEdit && (
            <CustomButton
              extraStyle={styles.extraStyle}
              title={t('Save')}
              onPress={handleSubmit}
            />
          )}
          {/* <CustomButton
            extraStyle={styles.extraStyle}
            title={t('Save')}
            onPress={handleSubmit}
          /> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TemplateScreen;

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
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.gray_E7,
      padding: 10,
      borderRadius: 10,
    },
    locationContainer: {
      height: hp(25),
      width: '100%',
    },
  });
};
