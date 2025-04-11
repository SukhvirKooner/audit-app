/* eslint-disable quotes */
/* eslint-disable curly */
/* eslint-disable react/no-unstable-nested-components */
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
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import CustomHeader from '../../components/CustomHeader';
import {useIsFocused, useRoute, useTheme} from '@react-navigation/native';
import {
  dispatchAction,
  useAppDispatch,
  useAppSelector,
} from '../../redux/hooks';
import {
  createAudits,
  editAudits,
  getAuditsDetailsByID,
  getTemplate,
  getUploadImage,
  uploadImage,
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
import {api, GOOGLE_API_KEY} from '../../utils/apiConstants';
import {
  _openAppSetting,
  locationOffModal,
  requestLocationPer,
  requestLocationPermission,
} from '../../utils/locationHandler';
import ImageSelectionModal from '../../components/ImageSelectionModal';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {GET_TEMPLATE, IS_LOADING} from '../../redux/actionTypes';
import {SCREENS} from '../../navigation/screenNames';
import {
  editDisableToast,
  editEnableToast,
  errorToast,
  navigateTo,
  successToast,
} from '../../utils/commonFunction';

import RNPrint from 'react-native-print';
import PdfDownloadModal from '../../components/PdfDownloadModal';
import RenderCheckbox from '../../components/RenderCheckbox';
import {
  getAsyncTemplate,
  getAsyncTemplateFillData,
  setAsyncCreateTemplateData,
  setAsyncGetTemplateData,
  setAsyncTemplate,
  setAsyncTemplateFillData,
} from '../../utils/asyncStorageManager';
import NetInfo from '@react-native-community/netinfo';
import ToggleComponent from '../../components/ToggleComponent';
import Loader from '../../components/Loader';
import TemplateRenderItem from '../../components/Audit/TemplateRenderItem';
import {use} from 'i18next';

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

const filterSectionData = (section: any[], formValue: {[key: string]: any}) => {
  // Recursive function to filter fields
  const filterFields = (fields: any[]) => {
    return fields
      .filter(field => {
        // Check if the field is present in formValue or has valid sub_fields
        if (field?.field_type === 'section' && field?.sub_fields) {
          const subFields = filterFields(field?.sub_fields); // Recursively check sub_fields
          field.sub_fields = subFields; // Update filtered sub_fields
          return subFields.length > 0; // Include only if sub_fields are available
        }
        return formValue?.hasOwnProperty(field?.id); // Check if id exists in formValue
      })
      .map(field => {
        // Handle sub_fields filtering if it's a section
        if (field?.field_type === 'section' && field?.sub_fields) {
          return {
            ...field,
            sub_fields: filterFields(field?.sub_fields), // Filter sub_fields
          };
        }
        return field; // Return field if matched
      });
  };

  // Start filtering the main section
  return filterFields(section);
};

const TemplateScreen = () => {
  const {t} = useTranslation();
  const {params}: any = useRoute();



  console.log('TemplateScreen params:', params);
  console.log('TemplateScreen templateData:', params?.templateData);
  const dispatch = useAppDispatch();
  const {colors}: any = useTheme();
  const {fontValue, userInfo} = useAppSelector(state => state.common);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [selectValue, setSelectValue] = useState(null);
  const [editValueList, setEditValueList] = useState([]);

  const [visibleSections, setVisibleSections] = useState({});

  const toggleSection = section => {
    setVisibleSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const {templateData, auditDetails, repeatableAuditsDetailsList} =
    useAppSelector(state => state.home);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );
  const isFocused = useIsFocused();

  const mapCameraRef = useRef<any>(null);
  // const [templateData, setTemplateData] = React.useState<any[]>([]);

  const [formValues, setFormValues] = useState<Record<string, any>>({});
  console.log('formValues', formValues);
  console.log('templateData', templateData);

  const sectionssss = groupBySection(templateData);

  const sections = useMemo(() => {
    // return groupBySection(templateData);
    return templateData;
  }, [templateData]); // Recompute when `fields` changes

  const [isMapLoaded, setIsMapLoaded] = useState(true);
  // const [conditionalFields, setConditionalFields] = useState(
  //   templateData
  //     .filter(
  //       field =>
  //         field.conditional_fields && field.conditional_fields.length > 0,
  //     )
  //     .map(list => ({
  //       id: list.id,
  //       show_fields: list?.conditional_fields?.map(cf => cf.show_fields).flat(),
  //     })),
  // );

  const [conditionalFields, setConditionalFields] = useState(
    templateData
      .filter(field => field.conditional_fields?.length > 0)
      .flatMap(field =>
        field.conditional_fields.map((cf, index) => ({
          id: `${field.id}-${cf.show_fields}`,
          show_fields: cf.show_fields,
        })),
      ),
  );

  // let showFieldIds = conditionalFields.flatMap(update => update.show_fields);

  // console.log('templateDataconditionalFields', JSON.stringify(templateData));
  console.log(
    'templateDataconditionalFields new',
    JSON.stringify(conditionalFields),
  );

  const showFieldIds = useMemo(() => {
    return conditionalFields.flatMap(update => update.show_fields);
  }, [conditionalFields]); // Recompute when `fields` changes

  console.log('templateDataconditionalFields new showFieldIds', showFieldIds);

  const [formErrors, setFormErrors] = useState<Record<number, string>>({});

  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [pdfModal, setPdfModal] = useState(false);
  const [selectFieldId, setSelectFieldId] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [imageSource, setImageSource] = useState<any>(null);
  const [auditResponse, setAuditResponse] = useState<any>(null);
  console.log('params?.typeparams?.typeparams?.type', params?.type);
  console.log('currentLocation', currentLocation);

  useEffect(() => {
    setTimeout(() => {
      setIsMapLoaded(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (isFocused) {
      if (selectValue) {
        if (repeatableAuditsDetailsList.length == 0) {
          handleInputChange(selectValue, '');
        } else {
          let newValue = repeatableAuditsDetailsList
            ?.filter(list => list?.audit == selectValue)
            ?.map(list => {
              return {
                template_field: list?.audit,
                sub_fields: list?.fields,
              };
            });
          handleInputChange(selectValue, newValue);
        }
        setSelectValue(null);
      }
    }
  }, [isFocused]);

  useEffect(() => {
    if (params?.type === 'edit') {
      setFormValues(params?.auditDetails?.fields);
      const locationID = getLocationID(templateData, 'current');
      if (locationID) {
        getAddress1(locationID, params?.auditDetails?.fields);
      }
      getAddress();
    }
  }, [params?.auditDetails?.fields, params?.type]);

  useEffect(() => {
    if (params?.type === 'edit') {
      const getValueList = async () => {
        const listData = await setAsyncGetTemplateData();
        setEditValueList(listData);
      };
      getValueList();
    }
  }, [params?.auditDetails?.fields, params?.type, isFocused]);

  useEffect(() => {
    if (params?.type === 'view') {
      setValue(params?.auditDetails);
    }
  }, [isFocused, params?.auditDetails, params?.type]);

  useEffect(() => {
    if (params?.type === 'edit' || params?.type === 'view') {
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
          dispatch({type: GET_TEMPLATE, payload: template?.fields});
          // setTemplateData(template?.fields);
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

  useEffect(() => {
    (async () => {
      const template_list = await getAsyncTemplate();
      if (template_list?.length > 0) {
        const template = template_list.find(
          (item: any) => item.template_id === params?.auditItem?.template,
        );
        if (template) {
        } else {
          const newData = {
            template_id: params?.auditItem?.template,
            fields: templateData?.fields,
          };
          await setAsyncTemplate([...template_list, newData]);
        }
      } else {
        const newData: any = {
          template_id: params?.auditItem?.template,
          fields: templateData?.fields,
        };
        await setAsyncTemplate([newData]);
      }
    })();
  }, [params?.auditItem?.template, templateData]);

  const setValue = (data: any) => {
    if (data?.fields?.length !== 0 && params?.type === 'view') {
      const [checkboxData] = templateData.filter(
        (i: any) => i?.field_type === 'checkbox',
      );

      const [dropdownData] = templateData.filter(
        (i: any) =>
          i?.field_type === 'dropdown' &&
          i?.options?.selection_type === 'multiple',
      );

      const newData = data?.fields.reduce((acc: any, item: any) => {
        if (item.template_field === checkboxData?.id) {
          // for checkbox
          acc[item.template_field] = item.value?.split(',') || [];
        } else if (item.template_field === dropdownData?.id) {
          acc[item.template_field] = item.value?.split(',') || [];
        } else {
          acc[item.template_field] = item.value;
        }
        return acc;
      }, {});
      setFormValues(newData);
    }
  };

  useEffect(() => {
    if (params?.type === 'create') {
      const locationID = getLocationID(templateData, 'current');
      if (locationID) {
        getAddress(locationID);
      } else {
        getAddress();
      }
    }
  }, [params?.type, templateData]);

  const getAddress = async (id: any) => {
    try {
      dispatch({type: IS_LOADING, payload: true});
      await requestLocationPer(
        async (response: any) => {
          const {latitude, longitude} = response;
          setCurrentLocation({
            latitude: latitude,
            longitude: longitude,
          });
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
          if (id) {
            console.log('id', id);
            handleInputChange(id, `${latitude},${longitude}`);
            dispatch({type: IS_LOADING, payload: false});
          }
        },
        (err: any) => {
          dispatch({type: IS_LOADING, payload: false});
          setCurrentLocation(null);
          console.log('<---current location error --->\n', err);
        },
      );
    } catch (error) {
      console.log('error', error);
    }
  };

  const getAddress1 = async (id: any, allFiled) => {
    try {
      dispatch({type: IS_LOADING, payload: true});
      await requestLocationPer(
        async (response: any) => {
          // setCurrentLocation(response);

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
          if (id) {
            // handleInputChange(id, `${latitude},${longitude}`);
            setFormValues({...allFiled, [id]: `${latitude},${longitude}`});
            dispatch({type: IS_LOADING, payload: false});
          }
        },
        (err: any) => {
          dispatch({type: IS_LOADING, payload: false});
          console.log('<---current location error --->\n', err);
        },
      );
    } catch (error) {
      console.log('error', error);
    }
  };

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
  
  // This function is no longer needed as we're using handlesConditionalFieldsss
  // Keeping it for backward compatibility with other code
  const handlesConditionalFields = (id, value) => {
    if (value?.length !== 0) {
      const newField = {
        id: id,
        show_fields: value,
      };
      const existingField = conditionalFields?.find(item => item?.id === id);
      
      if (existingField) {
        setConditionalFields(prevFields =>
          prevFields.map(field => 
            field.id === id ? newField : field
          )
        );
      } else {
        setConditionalFields(prevFields => [...prevFields, newField]);
      }
    }
  };
  
  const   handlesConditionalFieldsRemove = (id, value) => {
    if (value) {
      const newField = {
        id: id,
        show_fields: value,
      };
      
      setConditionalFields(prevFields => {
        const filteredFields = prevFields.filter(list => list?.id !== id);
        return [...filteredFields, newField];
      });
    }
  };
  
  const handlesConditionalFieldsss = (id) => {
    setConditionalFields(prevFields =>
      prevFields.filter(item => item.id !== id)
    );
  };



















  const handlesConditionalFieldDropDown = (id, value) => {
    // Find the field with matching conditional fields
    const updatedFields = templateData
        .filter(field => field.conditional_fields?.length > 0)
        .flatMap(field =>
            field.conditional_fields.map((cf, index) => ({
                id: `${field.id}-${cf.show_fields}`,
                key: `${field.id}-${index}`, // Unique key for each conditional field
                show_fields: cf.show_fields,
                condition_value: cf.condition_value, // Add condition value for comparison
            }))
        );

    // Find the matching conditional field based on the selected value
    const matchingField = updatedFields.find(
        field => field.id === id && field.condition_value === value
    );

    if (matchingField) {
        // Add or update the conditional field in the state
        setConditionalFields(prevFields => {
            // Remove any existing field with the same ID
            const filteredFields = prevFields.filter(item => item.id !== id);
            return [...filteredFields, matchingField];
        });
    } else {
        // If no matching field, remove the field from the state
        setConditionalFields(prevFields =>
            prevFields.filter(item => item.id !== id)
        );
    }
};


  const validateField = (field: FormField, value: any): string | null => {
    const {validation_rules, label, is_required}: any = field;

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

    params?.type === 'view'
      ? templateData
      : templateData
          .filter(field => !showFieldIds.includes(field.conditional_id))
          .forEach((field: any) => {
            const error = validateField(field, formValues[field.id]);

            if (field.field_type === 'section') {
              field.sub_fields.forEach((subField: any) => {
                const aError = validateField(subField, formValues[subField.id]);
                if (aError) {
                  isValid = false;
                  errors[subField.id] = aError;
                }
              });
            }

            if (error) {
              isValid = false;
              errors[field.id] = error;
            }
          });

    setFormErrors(errors);
    return isValid;
  };

  const convertData = (data: any) => {
    let updateData = [];
    let newValue = Object.entries(data).map(([key, value]: any) => {
      const field: any = templateData.find(
        (fields: any) => fields.id === Number(key),
      );
      const imageFields: any = [];

      templateData.forEach((item: any) => {
        if (item.sub_fields?.length > 0) {
          item.sub_fields.forEach((subField: any) => {
            if (subField.field_type === 'image') {
              imageFields.push({id: subField.id, label: subField.field_type});
            }
          });
        }
        if (item?.field_type === 'image') {
          imageFields.push({id: item.id, label: item.field_type});
        }
      });

      let formattedValue = value;
      if (imageFields.some((field: any) => field.id === Number(key))) {
        formattedValue = value.map((i: any) => i.id).toString() || '';
      } else if (field?.field_type === 'date') {
        formattedValue = moment(value).format('YYYY-MM-DD');
      } else if (field?.field_type === 'time') {
        formattedValue = moment(value).format('HH:MM:SS');
      } else if (field?.field_type === 'file') {
        formattedValue = value[0].base64;
      } else if (field?.field_type === 'signature') {
        formattedValue = value?.id;
      } else if (field?.field_type === 'checkbox') {
        formattedValue = value.toString();
      } else if (field?.field_type === 'sub_form') {
        const transformedData = value?.map(item => ({
          template_field: item.template_field,
          sub_fields: item.sub_fields,
        }));

        transformedData.forEach(obj => {
          updateData.push({
            template_field: key,
            sub_fields: obj?.sub_fields,
          });
        });
        return;
      } else if (
        field?.field_type === 'dropdown' &&
        field?.options?.selection_type === 'multiple'
      ) {
        formattedValue = value.toString();
      }

      updateData.push({
        template_field: key,
        value: formattedValue,
      });
      return {
        template_field: key,
        value: formattedValue,
      };
    });
    console.log('newValue', newValue);
    console.log('updateData', updateData);

    return updateData;
  };

  const handleSubmit = async () => {
    NetInfo.fetch().then(async state => {
      if (state.isConnected) {
        const locationIDs = getLocationID(templateData, 'current');
        if (currentLocation) {
          if (validateForm()) {
            const obj = {
              data: {
                filled_by: userInfo?.id,
                audit: params.auditItem.id,
                latitude: currentLocation?.latitude,
                longitude: currentLocation?.longitude,
                fields: convertData(formValues),
              },
              onSuccess: async () => {
                navigationRef.goBack();
              },
              onFailure: () => {},
            };
            console.log('obj-->', obj?.data);
            dispatch(createAudits(obj));
          } else {
            if (locationIDs) {
              getAddress(locationIDs);
            }
            console.log('Form has errors');
          }
        } else {
          getAddress();
        }
      } else {
        if (validateForm()) {
          const formData = await getAsyncTemplateFillData();
          const obj = {
            filled_by: userInfo?.id,
            audit: params.auditItem.id,
            latitude: 0,
            longitude: 0,
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

  console.log('params.auditItem.id', editValueList);
  console.log('params.auditItem.id', params?.auditDetails?.create_at);

  const handleSubmitEdit = async () => {
    const filteredData = editValueList.filter(
      item => item.create_at !== params?.auditDetails?.create_at,
    );

    NetInfo.fetch().then(async state => {
      if (state.isConnected) {
        const locationIDs = getLocationID(templateData, 'current');
        if (currentLocation) {
          if (validateForm()) {
            const obj = {
              data: {
                filled_by: userInfo?.id,
                audit: params.auditItem.id,
                latitude: currentLocation?.latitude,
                longitude: currentLocation?.longitude,
                fields: convertData(formValues),
              },
              onSuccess: async () => {
                await setAsyncCreateTemplateData(filteredData);
                navigationRef.goBack();
              },
              onFailure: () => {},
            };
            console.log('obj-->', obj?.data);
            dispatch(createAudits(obj));
          } else {
            if (locationIDs) {
              getAddress(locationIDs);
            }
            console.log('Form has errors');
          }
        } else {
          getAddress();
        }
      } else {
        if (validateForm()) {
          const formData = await getAsyncTemplateFillData();
          const obj = {
            filled_by: userInfo?.id,
            audit: params.auditItem.id,
            latitude: 0,
            longitude: 0,
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

  const handleDeleteImage = (id: number, imageID: any) => {
    const updatedFormValues = {...formValues};

    if (updatedFormValues[id]) {
      updatedFormValues[id] = updatedFormValues[id].filter(
        (item: any) => item.id !== imageID,
      );
      setFormValues(updatedFormValues);
    }
  };

  const onUploadImage = async (data: any, selectId) => {
    dispatch({type: IS_LOADING, payload: true});
    const newFormValues = formValues[selectId] || [];
    const uploadLinks = [...newFormValues];

    for (const image of data) {
      try {
        const obj = {
          audit: params?.auditItem?.id,
          filled_by: userInfo?.id,
          template_field: selectId,
          image: `data:${image.type};base64,${image?.base64}`,
        };
        const linkData = await uploadImage(obj);
        uploadLinks.push(linkData); // Store each link in the array
      } catch (error) {
        console.error(`Failed to upload ${image.filename}:`, error);
        dispatch({type: IS_LOADING, payload: false});
      }
    }

    // console.log('uploadLinks', uploadLinks);
    const newValue: any = uploadLinks.map((link: any) => {
      return {
        url: link?.image_url || link?.url,
        id: link?.image_id || link?.id,
      };
    });

    handleInputChange(selectId, newValue);
    dispatch({type: IS_LOADING, payload: false});
    // console.log('uploadLinks', newValue);
  };

  const memoizedValue = useMemo(
    () => [
      ...templateData
        .map(section => section.sub_fields)
        .flat()
        .filter(subField => subField !== null),
      ...templateData,
    ],
    [templateData],
  );

  const generatePDF = async () => {
    try {
      setPdfModal(true);
  
      // Group Data by Section (unchanged)
      const subFields = [
        ...templateData
          .map(section => section.sub_fields)
          .flat()
          .filter(subField => subField !== null),
        ...templateData,
      ];
  
      const groupedData = Object.entries(formValues).reduce(
        (acc, [key, value]) => {
          const template = memoizedValue.find(
            field => field.id.toString() === key,
          );
          if (template) {
            const section = template.section_heading || 'Default';
            if (!acc[section]) acc[section] = [];
            acc[section].push({
              label: template.label,
              value: value ? value : 'N/A',
              fieldValue: typeof value === 'object' ? 'image' : 'text',
            });
          }
          return acc;
        },
        {},
      );
  
      // Define map coordinates
      const mapLat = currentLocation?.latitude || 28.4348339;
      const mapLng = currentLocation?.longitude || 77.1065293;
  
      const logoUrl = params?.templateData?.logo || '';
      // Mappls API credentials and parameters
      const restAPIKey = '236866cde2288d1cea916c0c188cf654';
      const mapUrl = `https://apis.mappls.com/advancedmaps/v1/${restAPIKey}/still_image`;
  
      // Prepare query parameters as per the curl command
      const queryParams = new URLSearchParams({
        center: `${mapLat},${mapLng}`,
        zoom: '15',
        size: '300x200',
        ssf: '1',
        markers: `${mapLat},${mapLng}`,
      });
  
      // Fetch and convert map image to data URI using POST
      let mapDataUri = '';
      try {
        const mapResponse = await fetch(`${mapUrl}?${queryParams.toString()}`, {
          method: 'POST',
          headers: {
            'Accept': 'image/png',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
  
        if (!mapResponse.ok) {
          throw new Error(`Map API responded with status: ${mapResponse.status}`);
        }
  
        const mapBlob = await mapResponse.blob();
        const reader = new FileReader();
        mapDataUri = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(mapBlob);
        });
        console.log('Map image converted to data URI successfully');
      } catch (mapError) {
        console.error('Error downloading map:', mapError);
      }
  
      // Get current date for the footer
      const currentDate = moment().format('MMMM D, YYYY');
  
    
      const htmlContent = `<html>
        <head>
          <style>
            @page {
              margin: 20px;
              size: A4;
              @bottom-left {
                content: "Page " counter(page) " of " counter(pages);
                font-size: 10pt;
              }
              @bottom-right {
                content: "${currentDate}";
                font-size: 10pt;
              }
            }
            body {
              font-family: Arial, sans-serif;
              padding: 0;
              color: #000000;
              margin: 0;
            }
            .header {
              margin-bottom: 20px;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 1px solid #ddd;
              padding-bottom: 10px;
            }
            .header-content {
              flex: 1;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              margin: 0 0 5px 0;
            }
            .subtitle {
              font-size: 14px;
              margin: 0 0 3px 0;
              font-weight: normal;
            }
            .section-heading {
              font-size: 14px;
              font-weight: bold;
              margin: 15px 0 5px 0;
              background-color: #f0f0f0;
              padding: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
            }
            th, td {
              border: 1px solid #000000;
              padding: 8px;
              text-align: left;
              font-size: 12px;
            }
            th {
              font-weight: normal;
              width: 40%;
              background-color: #f9f9f9;
            }
            td {
              width: 60%;
            }
            .location-info {
              font-size: 12px;
              margin: 5px 0;
            }
            .location-info p {
              margin: 2px 0;
              display: flex;
              align-items: center;
            }
            .location-info p:before {
              content: "⨀";
              margin-right: 5px;
              font-size: 10px;
            }
            .footer {
              font-size: 12px;
              border-top: 1px solid #ddd;
              padding-top: 5px;
              display: none;
            }
            .image-container {
              text-align: right;
            }
            .image-container img {
              width: 120px;
              height: 120px;
              object-fit: cover;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .map-container {
              margin: 10px 0;
              width: 100%;
              max-width: 500px;
            }
            table {
              page-break-inside: avoid;
            }
            .section {
              page-break-inside: avoid;
              page-break-before: auto;
            }
            .created-info {
              display: flex;
              flex-direction: column;
              margin-top: 5px;
            }
            .created-info div {
              display: flex;
              align-items: center;
              font-size: 14px;
              margin-bottom: 3px;
            }
            .created-info div svg {
              margin-right: 5px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="header-content">
              <h1 class="title">${params?.templateData?.title || 'Test Select'}</h1>
              <p class="subtitle">${params?.templateData?.description || 'Test Select'}</p>
              
              <div class="created-info">
                <div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="black"/>
                  </svg>
                  ${moment(params?.templateData?.created_at).format('MM/DD/YYYY, hh:mm A')} GMT+5:30
                </div>
                <div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM12 13C9.33 13 4 14.34 4 17V20H20V17C20 14.34 14.67 13 12 13ZM18 18H6V17.01C6.2 16.29 9.3 15 12 15C14.7 15 17.8 16.29 18 17V18Z" fill="black"/>
                  </svg>
                  admin
                </div>
              </div>
            </div>
            <div class="image-container">
              ${
                logoUrl
                  ? `<img src="${logoUrl}" alt="Logo" />`
                  : `<img src="/api/placeholder/120/120" alt="placeholder" />`
              }
            </div>
          </div>
      
          <hr style="border: none; border-top: 1px solid #ddd; margin: 10px 0 20px 0;">
      
          <div class="location-info">
            <p><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="black"/>
            </svg> ${currentLocation ? `${currentLocation.latitude}, ${currentLocation.longitude}` : '17.4751744, 78.3712256'}</p>
          </div>
      
          <div class="content">
            ${Object.entries(groupedData).map(([section, fields]) => `
              <div class="section">
                <div class="section-heading">${section}</div>
                <table>
                  ${fields.map((field) => `
                    <tr>
                      <th>${field.label}</th>
                      <td>${
                        field.fieldValue === 'image' ?
                          Array.isArray(field.value) ? field.value.map((item) => `
                            <div class="image-container">
                              <img src="${api.BASE_URL_VIEW + item.url}" alt="Image" />
                            </div>
                          `).join('') : 'N/A' :
                        field.value === 'Invalid date' ? 'N/A' :
                        field.value
                      }</td>
                    </tr>
                  `).join('')}
                  ${
                    section === 'Field Attendance' || section === 'Default' ? 
                    `
                    <tr>
                      <th>Survey LatLong</th>
                      <td>
                        <div class="image-container">
                          ${mapDataUri ? `
                            <img class="map-img" src="${mapDataUri}" alt="Location Map" />
                          ` : `
                            <div style="width:180px;height:120px;border:1px solid #ccc;display:flex;align-items:center;justify-content:center;background-color:#f9f9f9;">
                              Location Map (${mapLat}, ${mapLng})
                            </div>
                          `}
                        </div>
                      </td>
                    </tr>
                    ` : ''
                  }
                </table>
              </div>
            `).join('')}
          </div>
        </body>
      </html>`;
      // Generate the PDF using react-native-print
      const options = {
        html: htmlContent,
        fileName: 'Field_Attendance',
        base64: false,
      };
  
      const results = await RNPrint.print(options);
      
      // Note: react-native-print by default opens the PDF viewer
      // If you want to navigate to your custom PDF screen, you'll need to save
      // the file first and then navigate to your screen
      
      setPdfModal(false);
      
      // If you need to save to a file and navigate:
      // navigateTo(SCREENS.PdfScreen, { pdfPath: results.filePath, showIcon: true });
      
    } catch (error) {
      console.log('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF');
      setPdfModal(false);
    }
  };


  const getLocationID = (fields: any[], type?: string) => {
    if (type === 'current') {
      for (const field of fields || []) {
        if (
          field?.field_type === 'location' &&
          field?.label == 'Current Location'
        ) {
          return field?.id;
        }

        if (field?.field_type === 'section') {
          const subField = field?.sub_fields?.find(
            (mItem: any) =>
              mItem?.field_type === 'location' &&
              mItem?.label == 'Current Location',
          );
          if (subField) {
            return subField?.id;
          }
        }
      }
      return null;
    } else {
      for (const field of fields || []) {
        if (field?.field_type === 'location') {
          return field?.id;
        }

        if (field?.field_type === 'section') {
          const subField = field?.sub_fields?.find(
            (mItem: any) => mItem?.field_type === 'location',
          );
          if (subField) {
            return subField?.id;
          }
        }
      }
      return null;
    }
  };

  const getFilteredLocations = (List: any, locationID: any) => {
    return Object.keys(List)
      .map((item: any) => {
        if (item == locationID) {
          return List[item];
        }
      })
      .filter((value: any) => value !== undefined)
      .toString();
  };

  const handleSave = async () => {
    const formLength = Object.keys(formValues).length;
    const listData: any = await setAsyncGetTemplateData();
    const subFields = [
      ...templateData
        ?.map(section => section?.sub_fields)
        ?.flat()
        ?.filter(subField => subField !== null),
      ...templateData,
    ];

    console.log('subFields?.length', subFields?.length / 3);

    if (params?.type === 'edit') {
      if (formValues && formLength < (subFields?.length / 3).toFixed()) {
        errorToast(
          `Please fill at least ${(
            subFields?.length / 3
          ).toFixed()} fields to save`,
        );
        return;
      }

      const findData = listData.find(
        (item: any) => item?.create_at === params?.auditDetails?.create_at,
      );

      if (findData) {
        findData.fields = formValues;

        const newData = listData.map((item: any) =>
          item?.create_at === params?.auditDetails?.create_at ? findData : item,
        );
        console.log('newData', newData);

        await setAsyncCreateTemplateData(newData);

        navigationRef.goBack();
      }
    } else {
      if (formValues && formLength < (subFields?.length / 3).toFixed()) {
        errorToast(
          `Please fill at least ${(
            subFields?.length / 3
          ).toFixed()} fields to save`,
        );
        return;
      }

      if (listData.length >= 3) {
        errorToast(
          'Note: Kindly ensure that you first sync your pending data.',
        );
        return;
      }

      if (listData.length > 0) {
        const newData = {
          filled_by: userInfo?.id,
          audit: params.auditItem.id,
          fields: formValues,
          create_at: new Date().getTime(),
        };
        await setAsyncCreateTemplateData([...listData, newData]);
      } else {
        const newData = {
          filled_by: userInfo?.id,
          audit: params.auditItem.id,
          fields: formValues,
          create_at: new Date().getTime(),
        };
        await setAsyncCreateTemplateData([newData]);
      }

      navigationRef.goBack();
    }
  };

  const onRepeatableViewPress = field => {
    setSelectValue(field.id);
    navigationRef.navigate(SCREENS.RepeatableDetailsScreen, {
      headerTitle: field.label,
      headerId: field.id,
      auditItem: field?.sub_fields,
      templateData: field?.sub_fields,
      audit: params?.auditItem?.id,
      isEdit: isEdit,
      type: params?.type,
      auditDetails: params?.auditDetails,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title={params?.headerTitle}
        // subTitle={'22 Nov 2024'}
        downloadIcon={isEdit ? false : params?.type === 'edit' ? false : true}
        refreshIcon={params?.type === 'edit' ? false : true}
        showMap
        editIcon={isEdit ? false : params?.type === 'edit' ? true : false}
        crossIcon={params?.type === 'create' ? false : isEdit ? true : false}
        onCrossPress={() => {
          setIsEdit(!isEdit);
          editDisableToast('Edit mode disabled');
          setValue(params?.auditDetails?.fields);
        }}
        onRefreshPress={syncOfflineData}
        onEditPress={() => {
          setIsEdit(!isEdit);
          editEnableToast('Edit mode enabled');
        }}
        onMapPress={() => {
          const locationID = getLocationID(templateData, 'current');
          console.log('templateData', templateData);

          const filteredLocations = formValues[locationID];
          navigateTo(SCREENS.MapScreen, {
            headerTitle: params?.headerTitle,
            listData: filteredLocations ? [{value: filteredLocations}] : [],
            location: params?.auditDetails,
          });
        }}
        onDownloadPress={() => {
          generatePDF();
        }}
      />
      <ScrollView style={{flex: 1}}>
        {/* <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          scrollEnabled={scrollEnabled}
          style={{flex: 1}}
          keyboardVerticalOffset={hp(1)}> */}

        {params?.type === 'create' ? (
          <FlatList
            data={
              // sections.filter(
              //   field => !showFieldIds.includes(field.conditional_id),
              // )
              Object.keys(sectionssss)
            }
            keyExtractor={item => item.id}
            scrollEnabled={scrollEnabled}
            contentContainerStyle={{
              paddingBottom: Platform.OS === 'ios' ? hp(8) : hp(10),
              marginHorizontal: 16,
            }}
            renderItem={({item: section}: any) => {
              return (
                <View style={{marginBottom: 10}}>
                  {/* Section Header with Toggle */}
                  {section !== 'null' && (
                    <TouchableOpacity
                      onPress={() => toggleSection(section)}
                      style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={styles.selectionText}>{section}</Text>
                      <Image
                        source={Icons.down}
                        style={{width: 18, height: 18}}
                      />
                    </TouchableOpacity>
                  )}
                  {/* Section Items */}
                  {(section == 'null' || visibleSections[section]) &&
                    sectionssss[section]
                      .filter(
                        field => !showFieldIds.includes(field.conditional_id),
                      )
                      .map(item => (
                        <View style={styles.section}>
                          {item.field_type == 'heading' ||
                          item.label == 'Current Location' ? null : (
                            <CustomText
                              style={{
                                ...styles.label,
                                ...commonFontStyle(
                                  400,
                                  fontValue +
                                    (item?.field_type === 'section' ? 20 : 16),
                                  colors.black,
                                ),
                                color:
                                  item?.field_type === 'section'
                                    ? colors.mainBlue
                                    : colors.black,
                              }}>
                              {item?.label}
                              <Text style={{color: 'red'}}>
                                {item?.is_required ? '*' : ''}
                              </Text>
                            </CustomText>
                          )}

                          <TemplateRenderItem
                            fields={item}
                            selectValue={selectValue}
                            params={params}
                            formValues={formValues}
                            currentLocation={currentLocation}
                            getAddress={getAddress}
                            formErrors={formErrors}
                            handleDeleteImage={handleDeleteImage}
                            onRepeatableViewPress={onRepeatableViewPress}
                            handleInputChange={handleInputChange}
                            handlesConditionalFields={handlesConditionalFields}
                            handlesConditionalFieldsRemove={
                              handlesConditionalFieldsRemove
                            }
                            handlesConditionalFieldsss={
                              handlesConditionalFieldsss
                            }
                            handlesConditionalFieldDropDown={
                              handlesConditionalFieldDropDown
                            }
                            isEdit={isEdit}
                            onUploadImage={onUploadImage}
                            setImageSource={setImageSource}
                            setSelectFieldId={setSelectFieldId}
                            isMapLoaded={isMapLoaded}
                            viewType={params?.type}
                            setScrollEnabled={item => {
                              setScrollEnabled(item);
                            }}
                          />
                        </View>
                      ))}
                </View>
              );
            }}
            ListFooterComponent={() => {
              return (
                <>
                  {/* {params?.type === 'edit' && isEdit && (
                  <CustomButton
                    extraStyle={styles.extraStyle}
                    title={t('Update')}
                    onPress={handleSubmit}
                  />
                )} */}
                  {params?.type === 'create' ||
                  (params?.type === 'edit' && isEdit) ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 20,
                      }}>
                      <CustomButton
                        extraStyle={styles.extraStyle}
                        title={t('Save')}
                        onPress={handleSave}
                      />
                      <CustomButton
                        extraStyle={styles.extraStyle}
                        title={t('Submit')}
                        onPress={() => {
                          params?.type === 'edit'
                            ? handleSubmitEdit()
                            : handleSubmit();
                        }}
                      />
                    </View>
                  ) : null}
                </>
              );
            }}
          />
        ) : (
          <FlatList
            data={
              params?.type === 'view'
                ? sections.filter(field => {
                    if (field.field_type == 'section') {
                      return field.sub_fields.filter((subField: any) => true);
                    } else if (field.field_type == 'sub_form') {
                      return field.sub_fields.filter((subField: any) => true);
                    } else {
                      return formValues[field.id];
                    }
                  })
                : params?.type === 'edit'
                ? isEdit
                  ? sections.filter(
                      field => !showFieldIds.includes(field.conditional_id),
                    )
                  : sections.filter(
                      field =>
                        (field.conditional_fields &&
                          field.conditional_fields.length > 0) ||
                        formValues[field.id] !== undefined,
                    )
                : sections.filter(
                    field => !showFieldIds.includes(field.conditional_id),
                  )
            }
            keyExtractor={item => item.id}
            scrollEnabled={scrollEnabled}
            contentContainerStyle={{
              paddingBottom: Platform.OS === 'ios' ? hp(8) : hp(10),
              marginHorizontal: 16,
            }}
            renderItem={({item}: any) => {
              const isAllIncluded = showFieldIds?.every(order =>
                sections.some(field => field.conditional_id === order),
              );

              return (
                <View style={styles.section}>
                  {item.field_type == 'heading' ||
                  item.label == 'Current Location' ? null : (
                    <CustomText
                      style={{
                        ...styles.label,
                        ...commonFontStyle(
                          400,
                          fontValue +
                            (item?.field_type === 'section' ? 20 : 16),
                          colors.black,
                        ),
                        color:
                          item?.field_type === 'section'
                            ? colors.mainBlue
                            : colors.black,
                      }}>
                      {item?.label}
                      <Text style={{color: 'red'}}>
                        {item?.is_required ? '*' : ''}
                      </Text>
                    </CustomText>
                  )}

                  <TemplateRenderItem
                    fields={item}
                    selectValue={selectValue}
                    params={params}
                    formValues={formValues}
                    getAddress={getAddress}
                    formErrors={formErrors}
                    handleDeleteImage={handleDeleteImage}
                    onRepeatableViewPress={onRepeatableViewPress}
                    handleInputChange={handleInputChange}
                    handlesConditionalFields={handlesConditionalFields}
                    handlesConditionalFieldsRemove={
                      handlesConditionalFieldsRemove
                    }
                    handlesConditionalFieldsss={handlesConditionalFieldsss}
                    isEdit={isEdit}
                    onUploadImage={onUploadImage}
                    setImageSource={setImageSource}
                    setSelectFieldId={setSelectFieldId}
                    isMapLoaded={isMapLoaded}
                    viewType={params?.type}
                    setScrollEnabled={item => {
                      setScrollEnabled(item);
                    }}
                  />
                </View>
              );
            }}
            ListFooterComponent={() => {
              return (
                <>
                  {/* {params?.type === 'edit' && isEdit && (
                  <CustomButton
                    extraStyle={styles.extraStyle}
                    title={t('Update')}
                    onPress={handleSubmit}
                  />
                )} */}
                  {params?.type === 'create' ||
                  (params?.type === 'edit' && isEdit) ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 20,
                      }}>
                      <CustomButton
                        extraStyle={styles.extraStyle}
                        title={t('Save')}
                        onPress={handleSave}
                      />
                      <CustomButton
                        extraStyle={styles.extraStyle}
                        title={t('Submit')}
                        onPress={() => {
                          params?.type === 'edit'
                            ? handleSubmitEdit()
                            : handleSubmit();
                        }}
                      />
                    </View>
                  ) : null}
                </>
              );
            }}
          />
        )}

        {/* {Object.keys(sections).map((section, index) => {
          console.log('asdasdasd', index);

          return (
          
          );
        })} */}

        <ImageSelectionModal
          isVisible={imageModal}
          onImageSelected={(value: any) => {
            setImageSource(value);
            onUploadImage(value);
            // handleInputChange(selectFieldId, value, 'image');
          }}
          onClose={setImageModal}
        />
        <PdfDownloadModal isVisible={pdfModal} />
        {/* </KeyboardAvoidingView> */}
      </ScrollView>
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
      marginBottom: 20,
      gap: 20,
    },
    extraStyle: {
      marginTop: 20,
      flex: 1,
    },
    label: {
      ...commonFontStyle(400, fontValue + 16, colors.black),
    },
    selectionText: {
      ...commonFontStyle(700, fontValue + 20, colors.black),
      flex: 1,
      marginVertical: 10,
    },
  });
};
