/* eslint-disable @typescript-eslint/no-unused-vars */
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
import React, {useEffect, useRef, useState} from 'react';
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
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
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
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {IS_LOADING} from '../../redux/actionTypes';
import {SCREENS} from '../../navigation/screenNames';
import {errorToast, navigateTo, successToast} from '../../utils/commonFunction';
import PdfDownloadModal from '../../components/PdfDownloadModal';
import RenderCheckbox from '../../components/RenderCheckbox';
import {
  getAsyncTemplate,
  getAsyncTemplateFillData,
  setAsyncTemplate,
  setAsyncTemplateFillData,
} from '../../utils/asyncStorageManager';
import NetInfo from '@react-native-community/netinfo';
import ToggleComponent from '../../components/ToggleComponent';
import Loader from '../../components/Loader';

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
  id?: any;
  label?: string;
  field_type?:
    | 'text'
    | 'number'
    | 'dropdown'
    | 'yes_no'
    | 'date'
    | 'time'
    | 'location'
    | 'checkbox'
    | 'image'
    | 'text_area'
    | 'radio'
    | 'radio_badge'
    | 'switch'
    | 'section'
    | 'label'
    | 'sub_form'
    | 'signature'
    | 'file'
    | 'heading';
  is_required?: boolean;
  options?: FieldOptions | null;
  section_heading?: string;
  validation_rules?: ValidationRule[];
  order?: number;
  date?: any;
  location?: any;
  sub_fields?: any[];
}

// Utility function to group fields by section
const groupBySection = (data: FormField[]) => {
  if (!data) {
    return {};
  }
  return data.reduce<Record<string, FormField[]>>((sections, field) => {
    const {section_heading}: any = field;
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
  const mapCameraRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [templateData, setTemplateData] = React.useState<FormField[]>([]);

  const [formValues, setFormValues] = useState<Record<string, any>>({});
  // console.log('formValues', formValues);
  const sections = groupBySection(templateData);
  console.log('sectionsasdas', JSON.stringify(formValues));

  const [formErrors, setFormErrors] = useState<Record<number, string>>({});

  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [pdfModal, setPdfModal] = useState(false);
  const [selectFieldId, setSelectFieldId] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [imageSource, setImageSource] = useState<any>(null);

  useEffect(() => {
    onGetTemplate();

    if (params?.type === 'edit') {
      setIsEdit(false);
    } else {
      setIsEdit(true);
      checkInternet();
    }
  }, [params?.type]);

  const checkInternet = async () => {
    NetInfo.fetch().then(async state => {
      if (state.isConnected === false) {
        const template_list = await getAsyncTemplate();
        const templateFormData = await getAsyncTemplateFillData();
        const template = template_list.find(
          (item: any) => item.template_id === params?.auditItem?.template,
        );
        const templateFillData = templateFormData.filter(
          (item: any) => item.audit === params.auditItem.id,
        );

        if (templateFillData?.length > 0) {
          setFormValues(templateFillData[0]?.fields);
        }

        if (template) {
          setTemplateData(template?.fields);
        }
      }
    });
  };

  const syncOfflineData = async () => {
    NetInfo.fetch().then(async state => {
      if (state.isConnected === false) {
        errorToast('No internet connection');
        return;
      } else {
        const templateFormData = await getAsyncTemplateFillData();

        const templateFillData = templateFormData.filter(
          (item: any) => item.audit === params.auditItem.id,
        );

        const nonTemplate = templateFormData.filter(
          (item: any) => item.audit !== params.auditItem.id,
        );

        if (templateFillData?.length > 0) {
          const obj = {
            data: templateFillData[0],
            onSuccess: async () => {
              successToast('One offline data synced successfully');
              templateFillData.shift();
              setAsyncTemplateFillData([...nonTemplate, ...templateFillData]);
            },
            onFailure: () => {},
          };
          // console.log('obj-->', JSON.stringify(obj.data));
          dispatch(createAudits(obj));
        } else {
          errorToast('No offline data found');
        }
      }
    });
  };

  const onGetTemplate = async () => {
    let obj = {
      data: {
        id: params?.auditItem?.template,
      },
      onSuccess: async (res: any) => {
        setTemplateData(res?.fields);

        const template_list = await getAsyncTemplate();

        if (template_list?.length > 0) {
          const template = template_list.find(
            (item: any) => item.template_id === params?.auditItem?.template,
          );

          if (template) {
          } else {
            const newData = {
              template_id: params?.auditItem?.template,
              fields: res?.fields,
            };
            await setAsyncTemplate([...template_list, newData]);
          }
        } else {
          const newData: any = {
            template_id: params?.auditItem?.template,
            fields: res?.fields,
          };
          await setAsyncTemplate([newData]);
        }
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
        if (mapCameraRef?.current) {
          mapCameraRef?.current?.setCamera({
            center: {
              latitude: latitude,
              longitude: longitude,
            },
            zoom: 11, // Adjust zoom level
            animation: {
              duration: 1000, // Duration of the animation
              easing: () => {},
            },
          });
        }
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
      setValue();
    }
  }, [params?.auditDetails?.fields, params?.type]);

  const setValue = () => {
    if (params?.auditDetails?.fields?.length !== 0 && params?.type === 'edit') {
      const [checkboxData] = templateData.filter(
        (i: any) => i?.field_type === 'checkbox',
      );
      const [imageData] = templateData.filter(
        (i: any) => i?.field_type === 'image',
      );
      console.log('imageData', imageData);
      const [dropdownData] = templateData.filter(
        (i: any) =>
          i?.field_type === 'dropdown' &&
          i?.options?.selection_type === 'multiple',
      );

      const newData = params?.auditDetails?.fields.reduce(
        (acc: any, item: any) => {
          if (item.template_field === checkboxData?.id) {
            // for checkbox
            acc[item.template_field] = item.value?.split(',') || [];
          } else if (item.template_field === dropdownData?.id) {
            acc[item.template_field] = item.value?.split(',') || [];
          } else {
            acc[item.template_field] = item.value;
          }
          return acc;
        },
        {},
      );
      setFormValues(newData);
    }
  };

  // // Update form values on input change

  const handleInputChange = (
    id: any,
    value: string | string[],
    type?: string,
  ) => {
    if (type === 'checkbox') {
      const existingValues = formValues[id] || [];
      const newValues = Array.isArray(value) ? value : [value];
      const updatedValues = existingValues.includes(value)
        ? existingValues.filter((v: any) => v !== value)
        : [...existingValues, ...newValues];
      setFormValues({...formValues, [id]: updatedValues});
    } else {
      setFormValues({...formValues, [id]: value});

      // Clear the error for the field being updated
      setFormErrors(prev => {
        const updatedErrors = {...prev};
        delete updatedErrors[id]; // Remove the error for this field
        return updatedErrors;
      });
    }
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

    templateData.forEach((field: any) => {
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
    return Object.entries(data).map(([key, value]: any) => {
      const field: any = templateData.find(
        (fields: any) => fields.id === Number(key),
      );

      let formattedValue = value;
      if (field?.field_type === 'date') {
        formattedValue = moment(value).format('YYYY-MM-DD');
      } else if (field?.field_type === 'time') {
        formattedValue = moment(value).format('hh:mm A');
      } else if (field?.field_type === 'checkbox') {
        formattedValue = value.toString();
      } else if (
        field?.field_type === 'dropdown' &&
        field?.options?.selection_type === 'multiple'
      ) {
        formattedValue = value.toString();
      }

      return {
        template_field: key,
        value: formattedValue,
      };
    });
  };

  const handleSubmit = () => {
    NetInfo.fetch().then(async state => {
      if (state.isConnected) {
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
              onSuccess: async () => {
                navigationRef.goBack();
              },
              onFailure: () => {},
            };
            console.log('obj-->', JSON.stringify(obj.data));

            dispatch(createAudits(obj));
          }
        } else {
          console.log('Form has errors');
        }
      } else {
        if (validateForm()) {
          const formData = await getAsyncTemplateFillData();

          const obj = {
            filled_by: 1,
            audit: params.auditItem.id,
            fields: convertData(formValues),
          };

          if (formData.length > 0) {
            setAsyncTemplateFillData([...formData, obj]);
          } else {
            setAsyncTemplateFillData([obj]);
          }

          navigationRef.goBack();
        }
      }
    });
  };

  const renderError = (fieldId: number) => {
    if (formErrors[fieldId]) {
      return <Text style={styles.errorText}>{formErrors[fieldId]}</Text>;
    }
    return null;
  };
  // Render individual fields
  const renderField = (field: FormField | any) => {
    switch (field.field_type) {
      case 'heading':
        return (
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>{field.label}</Text>
          </View>
        );
      case 'text':
        return (
          <>
            <TextInput
              style={{
                ...styles.input,
                backgroundColor: isEdit ? colors.gray_ea : 'transparent',
              }}
              placeholder={field.label}
              value={formValues[field.id] || ''}
              onChangeText={text => handleInputChange(field.id, text)}
              editable={isEdit}
              placeholderTextColor={colors.black}
            />
            {renderError(field.id)}
          </>
        );
      case 'text_area':
        return (
          <>
            <TextInput
              style={{
                ...styles.input,
                backgroundColor: isEdit ? colors.gray_ea : 'transparent',
                height: 100,
              }}
              placeholder={field.label}
              value={formValues[field.id] || ''}
              onChangeText={text => handleInputChange(field.id, text)}
              editable={isEdit}
              placeholderTextColor={colors.black}
              multiline
              textAlignVertical="top"
            />
            {renderError(field.id)}
          </>
        );
      case 'number':
        return (
          <>
            <TextInput
              style={{
                ...styles.input,
                backgroundColor: isEdit ? colors.gray_ea : 'transparent',
              }}
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
            {field.options?.selection_type === 'multiple' ? (
              <MultiSelect
                disable={!isEdit}
                style={{
                  ...styles.dropdown,
                  backgroundColor: isEdit ? colors.gray_ea : 'transparent',
                }}
                data={
                  field.options?.choices?.map(choice => ({
                    label: choice,
                    value: choice,
                  })) || []
                }
                labelField="label"
                valueField="value"
                placeholder={field.label}
                value={formValues[field.id] ?? []}
                onChange={item => handleInputChange(field.id, item, 'multiple')}
                placeholderStyle={{
                  ...commonFontStyle(400, 16, colors.black),
                }}
                selectedTextStyle={{
                  ...commonFontStyle(400, 16, colors.black),
                }}
              />
            ) : (
              <Dropdown
                disable={!isEdit}
                style={{
                  ...styles.dropdown,
                  backgroundColor: isEdit ? colors.gray_ea : 'transparent',
                }}
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
            )}
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
                  uri={
                    formValues[field.id][0].url ||
                    formValues[field.id] ||
                    imageSource?.uri
                  }
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
              {!isMapLoaded && <Loader />}
              <MapView
                ref={mapCameraRef}
                initialRegion={{
                  latitude: Number(formValues[field.id]?.split(',')[0]) || 0,
                  longitude: Number(formValues[field.id]?.split(',')[1]) || 0,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                provider="google"
                loadingEnabled
                showsUserLocation={formValues[field.id] ? true : false}
                onMapReady={() => setIsMapLoaded(true)}
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

              {isEdit && (
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
              style={{
                ...styles.dateContainer,
                backgroundColor: isEdit ? colors.gray_ea : 'transparent',
                gap: 15,
              }}>
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
      case 'time':
        return (
          <>
            <TouchableOpacity
              disabled={!isEdit}
              onPress={() => setTimeOpen(true)}
              style={{
                ...styles.dateContainer,
                backgroundColor: isEdit ? colors.gray_ea : 'transparent',
                gap: 15,
              }}>
              <CustomImage
                source={Icons.calendar}
                size={hps(25)}
                tintColor={colors.black}
              />
              <CustomText
                text={
                  formValues[field.id]
                    ? moment(formValues[field.id]).format() === 'Invalid date'
                      ? formValues[field.id]
                      : moment(formValues[field.id]).format('hh:mm A')
                    : 'Select Time'
                }
                style={{flex: 1}}
              />
            </TouchableOpacity>
            <DatePicker
              modal
              open={timeOpen}
              mode="time"
              theme="auto"
              minimumDate={new Date()}
              is24hourSource="device"
              date={
                formValues[field.id]
                  ? moment(formValues[field.id]).format() === 'Invalid date'
                    ? new Date()
                    : new Date(formValues[field.id])
                  : new Date()
              }
              onConfirm={(date: any) => {
                setTimeOpen(false);
                handleInputChange(field.id, date);
              }}
              onCancel={() => {
                setTimeOpen(false);
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
              <TouchableOpacity
                style={{...styles.switchContainer, gap: 15}}
                disabled={!isEdit}
                onPress={() => {
                  handleInputChange(field.id, field.options?.yes_label);
                }}>
                <RenderRadioButton
                  value={formValues[field.id] === field.options?.yes_label}
                />
                <CustomText
                  style={styles.label}
                  text={field.options?.yes_label}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{...styles.switchContainer, gap: 15}}
                disabled={!isEdit}
                onPress={() =>
                  handleInputChange(field.id, field.options?.no_label)
                }>
                <RenderRadioButton
                  value={formValues[field.id] === field.options?.no_label}
                />
                <CustomText
                  style={styles.label}
                  text={field.options?.no_label}
                />
              </TouchableOpacity>
            </View>
            {renderError(field.id)}
          </>
        );
      case 'radio':
        return (
          <>
            <View
              style={{
                justifyContent: 'flex-start',
                gap: 15,
              }}>
              {field.options?.choices?.map((choice: string, index: number) => (
                <TouchableOpacity
                  style={{
                    ...styles.switchContainer,
                    justifyContent: 'flex-start',
                    gap: 15,
                  }}
                  disabled={!isEdit}
                  onPress={() => {
                    handleInputChange(field.id, choice);
                  }}>
                  <RenderRadioButton value={formValues[field.id] === choice} />
                  <CustomText style={styles.label} text={choice} />
                </TouchableOpacity>
              ))}
            </View>
            {renderError(field.id)}
          </>
        );
      case 'radio_badge':
        return (
          <>
            <View
              style={{
                justifyContent: 'flex-start',
                gap: 15,
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              {field.options?.choices?.map((choice: string, index: number) => (
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: colors.gray_7B,
                    paddingVertical: 10,
                    borderRadius: 10,
                    paddingHorizontal: 15,
                    backgroundColor:
                      formValues[field.id] === choice
                        ? colors.gray_7B
                        : 'transparent',
                  }}
                  disabled={!isEdit}
                  onPress={() => {
                    handleInputChange(field.id, choice);
                  }}>
                  <CustomText
                    style={{
                      ...styles.label,
                      color:
                        formValues[field.id] === choice
                          ? colors.white
                          : colors.black,
                    }}
                    text={choice}
                  />
                </TouchableOpacity>
              ))}
            </View>
            {renderError(field.id)}
          </>
        );
      case 'checkbox':
        return (
          <>
            <View
              style={{
                justifyContent: 'flex-start',
                gap: 15,
              }}>
              {field.options?.choices?.map((choice: string, index: number) => (
                <TouchableOpacity
                  disabled={!isEdit}
                  onPress={() =>
                    handleInputChange(field.id, choice, 'checkbox')
                  }
                  key={index}
                  style={{
                    ...styles.switchContainer,
                    justifyContent: 'flex-start',
                    gap: 15,
                  }}>
                  <RenderCheckbox
                    isChecked={
                      formValues[field?.id]
                        ? formValues[field?.id].includes(choice)
                        : false
                    }
                  />
                  <CustomText style={styles.label} text={choice} />
                </TouchableOpacity>
              ))}
            </View>
            {renderError(field.id)}
          </>
        );
      case 'switch':
        return (
          <>
            <View
              style={{
                justifyContent: 'flex-start',
                gap: 15,
              }}>
              <ToggleComponent
                isToggleOn={Boolean(formValues[field.id]) || false}
                onToggleSwitch={() => {
                  handleInputChange(field.id, Boolean(!formValues[field.id]));
                }}
              />
            </View>
            {renderError(field.id)}
          </>
        );
      case 'section':
        // console.log('section', field);
        return (
          <>
            {field?.sub_fields.map((FItem: any) => (
              <View key={FItem.id} style={styles.field}>
                <>
                  {FItem.field_type !== 'heading' && (
                    <CustomText style={styles.label}>{FItem.label}</CustomText>
                  )}
                  {renderField(FItem)}
                </>
              </View>
            ))}
          </>
        );
      default:
        return null;
    }
  };

  const renderSectionField = (field: FormField | any) => {
    switch (field.field_type) {
      case 'heading':
        return (
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>{field.label}</Text>
          </View>
        );
      case 'text':
        return (
          <>
            <TextInput
              style={{
                ...styles.input,
                backgroundColor: isEdit ? colors.gray_ea : 'transparent',
              }}
              placeholder={field.label}
              value={formValues[field.id] || ''}
              onChangeText={text => handleInputChange(field.id, text)}
              editable={isEdit}
              placeholderTextColor={colors.black}
            />
            {renderError(field.id)}
          </>
        );
      case 'text_area':
        return (
          <>
            <TextInput
              style={{
                ...styles.input,
                backgroundColor: isEdit ? colors.gray_ea : 'transparent',
                height: 100,
              }}
              placeholder={field.label}
              value={formValues[field.id] || ''}
              onChangeText={text => handleInputChange(field.id, text)}
              editable={isEdit}
              placeholderTextColor={colors.black}
              multiline
              textAlignVertical="top"
            />
            {renderError(field.id)}
          </>
        );
      case 'number':
        return (
          <>
            <TextInput
              style={{
                ...styles.input,
                backgroundColor: isEdit ? colors.gray_ea : 'transparent',
              }}
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
            {field.options?.selection_type === 'multiple' ? (
              <MultiSelect
                disable={!isEdit}
                style={{
                  ...styles.dropdown,
                  backgroundColor: isEdit ? colors.gray_ea : 'transparent',
                }}
                data={
                  field.options?.choices?.map(choice => ({
                    label: choice,
                    value: choice,
                  })) || []
                }
                labelField="label"
                valueField="value"
                placeholder={field.label}
                value={formValues[field.id] ?? []}
                onChange={item => handleInputChange(field.id, item, 'multiple')}
                placeholderStyle={{
                  ...commonFontStyle(400, 16, colors.black),
                }}
                selectedTextStyle={{
                  ...commonFontStyle(400, 16, colors.black),
                }}
              />
            ) : (
              <Dropdown
                disable={!isEdit}
                style={{
                  ...styles.dropdown,
                  backgroundColor: isEdit ? colors.gray_ea : 'transparent',
                }}
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
            )}
            {renderError(field.id)}
          </>
        );
      case 'image':
        console.log('formValues[field.id][0].url', formValues[field.id][0].url);
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
                  uri={
                    'https:/' + formValues[field.id][0].url || imageSource?.uri
                  }
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
              {!isMapLoaded && <Loader />}
              <MapView
                ref={mapCameraRef}
                initialRegion={{
                  latitude: Number(formValues[field.id]?.split(',')[0]) || 0,
                  longitude: Number(formValues[field.id]?.split(',')[1]) || 0,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                provider="google"
                loadingEnabled
                showsUserLocation={formValues[field.id] ? true : false}
                onMapReady={() => setIsMapLoaded(true)}
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

              {isEdit && (
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
              style={{
                ...styles.dateContainer,
                backgroundColor: isEdit ? colors.gray_ea : 'transparent',
                gap: 15,
              }}>
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
      case 'time':
        return (
          <>
            <TouchableOpacity
              disabled={!isEdit}
              onPress={() => setTimeOpen(true)}
              style={{
                ...styles.dateContainer,
                backgroundColor: isEdit ? colors.gray_ea : 'transparent',
                gap: 15,
              }}>
              <CustomImage
                source={Icons.calendar}
                size={hps(25)}
                tintColor={colors.black}
              />
              <CustomText
                text={
                  formValues[field.id]
                    ? moment(formValues[field.id]).format() === 'Invalid date'
                      ? formValues[field.id]
                      : moment(formValues[field.id]).format('hh:mm A')
                    : 'Select Time'
                }
                style={{flex: 1}}
              />
            </TouchableOpacity>
            <DatePicker
              modal
              open={timeOpen}
              mode="time"
              theme="auto"
              minimumDate={new Date()}
              is24hourSource="device"
              date={
                formValues[field.id]
                  ? moment(formValues[field.id]).format() === 'Invalid date'
                    ? new Date()
                    : new Date(formValues[field.id])
                  : new Date()
              }
              onConfirm={(date: any) => {
                setTimeOpen(false);
                handleInputChange(field.id, date);
              }}
              onCancel={() => {
                setTimeOpen(false);
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
              <TouchableOpacity
                style={{...styles.switchContainer, gap: 15}}
                disabled={!isEdit}
                onPress={() => {
                  handleInputChange(field.id, field.options?.yes_label);
                }}>
                <RenderRadioButton
                  value={formValues[field.id] === field.options?.yes_label}
                />
                <CustomText
                  style={styles.label}
                  text={field.options?.yes_label}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{...styles.switchContainer, gap: 15}}
                disabled={!isEdit}
                onPress={() =>
                  handleInputChange(field.id, field.options?.no_label)
                }>
                <RenderRadioButton
                  value={formValues[field.id] === field.options?.no_label}
                />
                <CustomText
                  style={styles.label}
                  text={field.options?.no_label}
                />
              </TouchableOpacity>
            </View>
            {renderError(field.id)}
          </>
        );
      case 'radio':
        return (
          <>
            <View
              style={{
                justifyContent: 'flex-start',
                gap: 15,
              }}>
              {field.options?.choices?.map((choice: string, index: number) => (
                <TouchableOpacity
                  style={{
                    ...styles.switchContainer,
                    justifyContent: 'flex-start',
                    gap: 15,
                  }}
                  disabled={!isEdit}
                  onPress={() => {
                    handleInputChange(field.id, choice);
                  }}>
                  <RenderRadioButton value={formValues[field.id] === choice} />
                  <CustomText style={styles.label} text={choice} />
                </TouchableOpacity>
              ))}
            </View>
            {renderError(field.id)}
          </>
        );
      case 'radio_badge':
        return (
          <>
            <View
              style={{
                justifyContent: 'flex-start',
                gap: 15,
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              {field.options?.choices?.map((choice: string, index: number) => (
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: colors.gray_7B,
                    paddingVertical: 10,
                    borderRadius: 10,
                    paddingHorizontal: 15,
                    backgroundColor:
                      formValues[field.id] === choice
                        ? colors.gray_7B
                        : 'transparent',
                  }}
                  disabled={!isEdit}
                  onPress={() => {
                    handleInputChange(field.id, choice);
                  }}>
                  <CustomText
                    style={{
                      ...styles.label,
                      color:
                        formValues[field.id] === choice
                          ? colors.white
                          : colors.black,
                    }}
                    text={choice}
                  />
                </TouchableOpacity>
              ))}
            </View>
            {renderError(field.id)}
          </>
        );
      case 'checkbox':
        return (
          <>
            <View
              style={{
                justifyContent: 'flex-start',
                gap: 15,
              }}>
              {field.options?.choices?.map((choice: string, index: number) => (
                <TouchableOpacity
                  disabled={!isEdit}
                  onPress={() =>
                    handleInputChange(field.id, choice, 'checkbox')
                  }
                  key={index}
                  style={{
                    ...styles.switchContainer,
                    justifyContent: 'flex-start',
                    gap: 15,
                  }}>
                  <RenderCheckbox
                    isChecked={
                      formValues[field?.id]
                        ? formValues[field?.id].includes(choice)
                        : false
                    }
                  />
                  <CustomText style={styles.label} text={choice} />
                </TouchableOpacity>
              ))}
            </View>
            {renderError(field.id)}
          </>
        );
      case 'switch':
        return (
          <>
            <View
              style={{
                justifyContent: 'flex-start',
                gap: 15,
              }}>
              <ToggleComponent
                isToggleOn={Boolean(formValues[field.id]) || false}
                onToggleSwitch={() => {
                  handleInputChange(field.id, Boolean(!formValues[field.id]));
                }}
              />
            </View>
            {renderError(field.id)}
          </>
        );
      case 'section':
        // console.log('section', field);
        return (
          <>
            {field?.sub_fields.map((FItem: any) => (
              <View key={FItem.id} style={styles.field}>
                <>
                  {FItem.field_type !== 'heading' && (
                    <CustomText style={styles.label}>{FItem.label}</CustomText>
                  )}
                  {renderField(FItem)}
                </>
              </View>
            ))}
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
          console.log('template', template);

          if (template) {
            const section = template.section_heading;
            if (!acc[section]) acc[section] = [];
            acc[section].push({label: template.label, value});
          }
          return acc;
        },
        {},
      );

      console.log('daasdaasdasda', JSON.stringify(groupedData));

      // Profile image path (for local image)
      const profileImagePath = groupedData?.Profile
        ? groupedData?.Profile[0]?.value
        : null;

      console.log('profileImagePath', profileImagePath);

      console.log('groupedData', groupedData);

      // ${
      //   profileImagePath
      //     ? `<h2>Profile</h2>
      // <img src="${profileImagePath}" alt="Profile Picture" width="150" height="150" />`
      //     : `<br>`
      // }
      // Create HTML content
      //       const htmlContent = `

      //    ${Object.entries(groupedData)
      //      .map(
      //        ([section, fields]) => `
      //        <h2>${section === 'Profile' ? `<br>` : `<br>`}</h2>
      //        ${fields
      //          .map(
      //            (field: any, index) => `
      //           ${
      //             section === 'Profile'
      //               ? ''
      //               : `<h2 style="margin-top: 60px"><strong>${index + 1}. ${
      //                   field.label
      //                 }:</strong></h2><p style="font-size:150%;margin-left: 30px;">${
      //                   field.value
      //                 }</p>`
      //           } `,
      //          )
      //          .join('')}
      //      `,
      //      )
      //      .join('')}
      //  `;
      const htmlContent = `<html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          .header {
            text-align: center;
            font-size: 20px;
            margin-bottom: 20px;
          }
          .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 12px;
          }
          .content {
            text-align: justify;
            margin: 0 20px;
          }
        </style>
      </head>
      <body>
       
        <div class="content">
         ${Object.entries(groupedData)
           .map(
             ([section, fields]) => `
             <h2>${section === 'Profile' ? `<br>` : `<br>`}</h2>
             ${fields
               .map(
                 (field: any, index) => `
                ${
                  section === 'Profile'
                    ? ''
                    : `<h2 style="margin-top: 60px"><strong>${index + 1}. ${
                        field.label
                      }:</strong></h2><p style="font-size:150%;margin-left: 30px;">${
                        field.value
                      }</p>`
                } `,
               )
               .join('')}
           `,
           )
           .join('')}
        </div>
          
      </body>
    </html>`;
      const pdf = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: 'Report',
        directory: 'Documents',
      });

      // Alert.alert('Success', `PDF saved at: ${pdf.filePath}`);
      // setPdfFilePath(pdf.filePath);
      setTimeout(() => {
        setPdfModal(false);
        navigationRef.navigate(SCREENS.PdfScreen, {pdfPath: pdf.filePath});
      }, 300);
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
        editIcon={isEdit ? false : params?.type === 'edit' ? true : false}
        crossIcon={params?.type === 'create' ? false : isEdit ? true : false}
        onCrossPress={() => {
          setIsEdit(!isEdit);
          errorToast('Edit mode disabled');
          setValue();
        }}
        onRefreshPress={syncOfflineData}
        onEditPress={() => {
          setIsEdit(!isEdit);
          successToast('Edit mode enabled');
        }}
        onMapPress={() => {
          const filter = templateData.find(
            (field: any) => field.field_type === 'location',
          );
          const locationData = params.auditDetails?.fields.find(
            (field: any) => field.template_field === filter?.id,
          );

          if (filter?.id) {
            navigateTo(SCREENS.MapScreen, {
              headerTitle: params?.headerTitle,
              listData: [locationData],
            });
          }
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
              {/* <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>{section}</Text>
              </View> */}
              {sections[section].map((field: any) => (
                <View key={field.id} style={styles.field}>
                  <>
                    {field.field_type !== 'heading' && (
                      <CustomText
                        style={{...styles.label, color: colors.gray_7B}}>
                        {field.label}
                        <Text style={{color: 'red'}}>
                          {field.is_required ? '*' : ''}
                        </Text>
                      </CustomText>
                    )}
                    {renderField(field)}
                  </>
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
              setImageSource(value);

              handleInputChange(selectFieldId, value.uri);
            }}
            onClose={setImageModal}
          />
          <PdfDownloadModal isVisible={pdfModal} />
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
      // marginTop: 20,
      padding: 10,
      borderRadius: 10,
    },
    sectionTitle: {
      ...commonFontStyle(400, fontValue + 16, colors.white),
      textAlign: 'center',
    },
    field: {
      // marginBottom: 15,
      gap: 15,
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
      borderColor: '#ccc',
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
