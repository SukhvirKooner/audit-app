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
import {
  dispatchAction,
  useAppDispatch,
  useAppSelector,
} from '../../redux/hooks';
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
import MapView, {Marker} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import {GOOGLE_API_KEY} from '../../utils/apiConstants';
import {requestLocationPermission} from '../../utils/locationHandler';
import ImageSelectionModal from '../../components/ImageSelectionModal';
import CustomModal from '../../components/PdfDownloadModal';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {IS_LOADING} from '../../redux/actionTypes';
import {SCREENS} from '../../navigation/screenNames';
import {errorToast, successToast} from '../../utils/commonFunction';

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
  const {colors}: any = useTheme();
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
  const [imageModal, setImageModal] = useState(false);
  const [pdfModal, setPdfModal] = useState(false);
  const [selectFieldId, setSelectFieldId] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [imageSource, setImageSource] = useState<any>(null);
  const [pdfFilePath, setPdfFilePath] = useState(null);

  console.log('pdfFilePath', currentLocation);
  useEffect(() => {
    onGetTemplate();

    if (params?.type === 'edit') {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, []);

  // useEffect(() => {
  //   if (templateData.length > 0) {
  //     const filter = templateData.find(
  //       (field: any) => field.field_type === 'location',
  //     );
  //     if (filter?.id) {
  //       setTimeout(() => {
  //         getAddress();
  //       }, 200);
  //     }
  //   }
  // }, [templateData]);

  const onGetTemplate = async () => {
    let obj = {
      data: {
        id: params?.auditItem?.template,
      },
      onSuccess: (res: any) => {
        setTemplateData(res?.fields);
      },
      onFailure: (error: any) => {
        console.log('error', error);
      },
    };
    dispatch(getTemplate(obj));
  };

  const getAddress = async () => {
    dispatch({type: IS_LOADING, payload: true});
    await requestLocationPermission(
      async response => {
        setCurrentLocation(response);
        const filter = templateData.find(
          (field: any) => field.field_type === 'location',
        );
        const {latitude, longitude} = response;
        dispatch({type: IS_LOADING, payload: false});

        if (filter?.id) {
          handleInputChange(filter.id, `${latitude},${longitude}`);
          dispatch({type: IS_LOADING, payload: false});
        }
      },
      err => {
        dispatch({type: IS_LOADING, payload: false});
        console.log('<---current location error --->\n', err);
      },
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
    const filter = templateData.find(
      (field: any) => field.field_type === 'date',
    );

    return Object.entries(data).map(([key, value]) => ({
      template_field: key,
      value:
        filter?.id === Number(key) ? moment(value).format('YYYY-MM-DD') : value,
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
        console.log('obj-->', obj.data);

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
              placeholderTextColor={colors.black}
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
              placeholderTextColor={colors.black}
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
              placeholderStyle={{
                ...commonFontStyle(400, 16, colors.black),
              }}
              selectedTextStyle={{
                ...commonFontStyle(400, 16, colors.black),
              }}
            />
            {renderError(field.id)}
          </>
        );
      case 'image':
        return (
          <>
            <TouchableOpacity
              style={styles.imageContainer}
              disabled={!isEdit}
              onPress={() => {
                setSelectFieldId(field.id);
                setImageModal(true);
              }}>
              {formValues[field.id] || imageSource?.uri ? (
                <CustomImage
                  uri={formValues[field.id] || imageSource?.uri}
                  size={hp(14)}
                  disabled
                  containerStyle={{borderRadius: 10, overflow: 'hidden'}}
                />
              ) : (
                <CustomText text={'Upload Image'} style={styles.imageText} />
              )}
              {(formValues[field.id] || imageSource?.uri) && (
                <CustomImage
                  source={Icons.cross}
                  disabled={!isEdit}
                  size={hps(30)}
                  onPress={() => {
                    setImageSource(null);
                    handleInputChange(field.id, '');
                  }}
                  containerStyle={{position: 'absolute', top: -10, right: -10}}
                  tintColor={colors.black}
                />
              )}
            </TouchableOpacity>
            {renderError(field.id)}
          </>
        );
      case 'location':
        return (
          <>
            <View style={styles.locationContainer}>
              {/* {formValues[field.id] ? ( */}
              <MapView
                initialRegion={{
                  latitude: Number(formValues[field.id]?.split(',')[0]) || 0,
                  longitude: Number(formValues[field.id]?.split(',')[1]) || 0,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                provider="google"
                loadingEnabled
                showsUserLocation={formValues[field.id] ? true : false}
                style={{flex: 1}}>
                {formValues[field.id] && (
                  <Marker
                    coordinate={{
                      latitude:
                        Number(formValues[field.id]?.split(',')[0]) || 0,
                      longitude:
                        Number(formValues[field.id]?.split(',')[1]) || 0,
                    }}
                  />
                )}
              </MapView>
              {!formValues[field.id] && (
                <TouchableOpacity
                  style={styles.locationView}
                  onPress={getAddress}>
                  <CustomText text={'Get Location'} style={styles.location} />
                </TouchableOpacity>
              )}

              {formValues[field.id] && (
                <CustomText
                  text={formValues[field.id]}
                  style={styles.location}
                />
              )}
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
              <CustomImage
                source={Icons.calendar}
                size={hps(25)}
                tintColor={colors.black}
              />
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
              date={
                formValues[field.id]
                  ? new Date(formValues[field.id])
                  : new Date()
              }
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
                <CustomText
                  style={styles.label}
                  text={field.options?.yes_label}
                />
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
                <CustomText
                  style={styles.label}
                  text={field.options?.no_label}
                />
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

  const generatePDF = async () => {
    try {
      setPdfModal(true);
      // Group Data by Section

      const groupedData = Object.entries(formValues).reduce(
        (acc: any, [key, value]) => {
          const template = templateData.find(
            field => field.id.toString() === key,
          );
          if (template) {
            const section = template.section_heading;
            if (!acc[section]) acc[section] = [];
            acc[section].push({label: template.label, value});
          }
          return acc;
        },
        {},
      );
      console.log('groupedData', groupedData);
      // Profile image path (for local image)
      const profileImagePath = groupedData?.Profile
        ? groupedData?.Profile[0]?.value
        : null;

      // Create HTML content
      const htmlContent = `
    ${
      profileImagePath
        ? `<h2>Profile</h2>
    <img src="${profileImagePath}" alt="Profile Picture" width="150" height="150" />`
        : ''
    } 
   ${Object.entries(groupedData)
     .map(
       ([section, fields]) => `
       <h2>${section === 'Profile' ? '' : section}</h2>
       ${fields
         .map(
           (field: any) => `
          ${
            section === 'Profile'
              ? ''
              : `<p><strong>${field.label}:</strong> ${field.value}</p>`
          } `,
         )
         .join('')}
     `,
     )
     .join('')}
 `;
      console.log('htmlContent', htmlContent);
      const pdf = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: 'Report',
        directory: 'Documents',
      });

      // Alert.alert('Success', `PDF saved at: ${pdf.filePath}`);
      // setPdfFilePath(pdf.filePath);
      setPdfModal(false);
      navigationRef.navigate(SCREENS.PdfScreen, {pdfPath: pdf.filePath});
    } catch (error) {
      console.log('error', error);
      Alert.alert('Error', 'Failed to generate PDF');
      setPdfModal(false);
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
          if (isEdit) {
            errorToast('Edit mode disabled');
          } else {
            successToast('Edit mode enabled');
          }
        }}
        onMapPress={() => {
          navigationRef.navigate(SCREENS.MapScreen, {
            headerTitle: params?.headerTitle,
          });
        }}
        onDownloadPress={() => {
          generatePDF();
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
              title={t('Update')}
              onPress={handleSubmit}
            />
          )}
          {params?.type === 'create' && (
            <CustomButton
              extraStyle={styles.extraStyle}
              title={t('Save')}
              onPress={handleSubmit}
            />
          )}
          <ImageSelectionModal
            isVisible={imageModal}
            onImageSelected={(value: any) => {
              // console.log('value', value);
              setImageSource(value);

              handleInputChange(selectFieldId, value.uri);
            }}
            onClose={setImageModal}
          />
          <CustomModal isVisible={pdfModal} />
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
      ...commonFontStyle(400, fontValue + 16, colors.black),
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      ...commonFontStyle(400, fontValue + 16, colors.black),
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
    imageContainer: {
      height: hp(15),
      width: hp(15),
      borderWidth: 1,
      borderColor: colors.gray_E7,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageText: {
      ...commonFontStyle(400, fontValue + 16, colors.black_T37),
      textAlign: 'center',
    },
    location: {
      ...commonFontStyle(400, fontValue + 16, colors.black_T37),
    },
    locationView: {
      borderWidth: 1,
      borderColor: colors.black,
      paddingVertical: 10,
      paddingHorizontal: 5,
      borderRadius: 10,
      alignSelf: 'flex-end',
      alignItems: 'center',
      marginTop: 10,
    },
  });
};
