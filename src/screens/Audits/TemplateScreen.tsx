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
    console.log('sections', sections);
    console.log('fieldfieldfieldfieldfield', field);
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
  const dispatch = useAppDispatch();
  const {colors}: any = useTheme();
  const {fontValue, userInfo} = useAppSelector(state => state.common);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [selectValue, setSelectValue] = useState(null);

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

  // const sections = groupBySection(templateData);

  const sections = useMemo(() => {
    // return groupBySection(templateData);
    return templateData;
  }, [templateData]); // Recompute when `fields` changes

  const [isMapLoaded, setIsMapLoaded] = useState(true);
  const [conditionalFields, setConditionalFields] = useState(
    templateData
      .filter(
        field =>
          field.conditional_fields && field.conditional_fields.length > 0,
      )
      .map(list => ({
        id: list.id,
        show_fields: list?.conditional_fields?.map(cf => cf.show_fields).flat(),
      })),
  );

  // let showFieldIds = conditionalFields.flatMap(update => update.show_fields);
  const showFieldIds = useMemo(() => {
    return conditionalFields.flatMap(update => update.show_fields);
  }, [conditionalFields]); // Recompute when `fields` changes

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

  console.log('params?.auditDetails', params?.auditDetails);

  useEffect(() => {
    if (params?.type === 'edit') {
      setFormValues(params?.auditDetails?.fields);
      const locationID = getLocationID(templateData, 'current');
      if (locationID) {
        getAddress1(locationID, params?.auditDetails?.fields);
      }
    }
  }, [params?.auditDetails?.fields, params?.type]);

  useEffect(() => {
    if (params?.type === 'view') {
      setValue(params?.auditDetails);
    }
  }, [isFocused, params?.auditDetails, params?.type]);

  useEffect(() => {
    // onGetTemplate();

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
  const handlesConditionalFields = (id, value) => {
    if (value?.length !== 0) {
      let newField = {
        id: id,
        show_fields: value,
      };
      let updateValue = conditionalFields?.find(item => item?.id == id);

      if (updateValue?.id == id) {
        setConditionalFields(prevFields =>
          prevFields.filter(list => list?.id !== id),
        );
      } else {
        setConditionalFields(prevFields => [...prevFields, newField]);
      }
    }
  };

  const handlesConditionalFieldsss = (id, value) => {
    setConditionalFields(prevFields =>
      prevFields.filter(list => list?.id !== id),
    );
  };

  const handlesConditionalFieldsRemove = (id, value) => {
    let updateValue = conditionalFields.find(item => item?.id == id);

    if (updateValue?.id == id) {
      setConditionalFields(conditionalFields);
    } else {
      let newField = {
        id: id,
        show_fields: value,
      };
      setConditionalFields(prevFields => [...prevFields, newField]);
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
          .filter(field => !showFieldIds.includes(field.order))
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

  const handleSubmit = () => {
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
                if (params?.type === 'edit') {
                  const listData: any = await setAsyncGetTemplateData();
                  const findData = listData?.filter(item => {
                    item?.create_at !== params?.auditDetails?.create_at;
                  });
                  await setAsyncCreateTemplateData(findData);
                  navigationRef.goBack();
                }
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

  const onUploadImage = async (data: any) => {
    dispatch({type: IS_LOADING, payload: true});
    const newFormValues = formValues[selectFieldId] || [];
    const uploadLinks = [...newFormValues];

    for (const image of data) {
      try {
        const obj = {
          audit: params?.auditItem?.id,
          filled_by: userInfo?.id,
          template_field: selectFieldId,
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

    handleInputChange(selectFieldId, newValue);
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
      // Group Data by Section
      const subFields = [
        ...templateData
          .map(section => section.sub_fields)
          .flat()
          .filter(subField => subField !== null),
        ...templateData,
      ];

      const groupedData = Object.entries(formValues).reduce(
        (acc: any, [key, value]) => {
          const template = memoizedValue.find(
            field => field.id.toString() === key,
          );

          if (template) {
            const section = template.section_heading;
            if (!acc[section]) acc[section] = [];
            acc[section].push({
              label: template.label,
              value: value ? value : '-',
              fieldValue: typeof value === 'object' ? 'image' : 'text',
            });
          }
          return acc;
        },
        {},
      );

      console.log('groupedData', JSON.stringify(groupedData));

      // Profile image path (for local image)
      const profileImagePath = groupedData?.Profile
        ? groupedData?.Profile[0]?.value
        : null;

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
            bottom: 20px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 10px;
            color: #333;
            counter-reset: page;
        }
        .footer::before {
            counter-increment: page;
            content: "Page " counter(page);
        }
          .content {
            text-align: justify;
            margin: 0 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
        <h1 style="text-align: left;color:#054DA4" >${
          params?.auditItem?.title
        }</h1>
        <p style="text-align: left;font-size:140%;">${
          params?.auditItem?.description
        }</p>
        </div>
        <div class="content">
         ${Object.entries(groupedData)
           .map(
             ([section, fields]: any) => `
             <h2>${section === 'Profile' ? `<br>` : `<br>`}</h2>
             ${fields
               .map(
                 (field: any, index: any) =>
                   `
                ${
                  field.value == 'Invalid date'
                    ? `<h2 style="margin-top: 60px"><strong>${index + 1}. ${
                        field.label
                      }:</strong></h2><p style="font-size:150%;margin-left: 40px;">-</p>`
                    : field.fieldValue === 'image'
                    ? `<h2 style="margin-top: 60px"><strong>${index + 1}. ${
                        field.label
                      }:</strong></h2>${field.value
                        .map(
                          (item: any) => `
                        <img src="${
                          api.BASE_URL_VIEW + item.url
                        }" alt="Image" width="300" height="300" />
                      `,
                        )
                        .join('')}`
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
                <p style="font-size:150%;margin-top: 120px; text-align: center;margin-bottom: 50px;">----- End ------</p>

        <div c style="display: flex; align-items: center; gap: 20px;justify-content: space-between; ">
        <div>
              <img  src="${'https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/National_Highways_Authority_of_India_logo.svg/600px-National_Highways_Authority_of_India_logo.svg.png?20110614062054'}" alt="Profile Picture" width="100" height="100" />
              <img style="margin:10px"  src="${'https://scontent.famd15-1.fna.fbcdn.net/v/t39.30808-1/451622324_884403687042073_7161878331476152652_n.jpg?stp=dst-jpg_s480x480_tt6&_nc_cat=103&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=eTma363D5bcQ7kNvgEJ3KcL&_nc_zt=24&_nc_ht=scontent.famd15-1.fna&_nc_gid=AQQ9Phw5i3LrtKGDXOUbmAB&oh=00_AYDIj3OMyOGEHoGdWn0FfZDlYmPVdj9C6-ra7J85sDdALw&oe=676A144B'}" alt="Profile Picture" width="100" height="100" />
           </div>
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
        navigateTo(SCREENS.PdfScreen, {pdfPath: pdf.filePath, showIcon: true});
      }, 300);
    } catch (error) {
      console.log('error', error);
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
      if (formValues && formLength < 10) {
        errorToast('Please fill at least 10 fields to save');
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
        downloadIcon={false}
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
              : sections.filter(field => !showFieldIds.includes(field.order))
          }
          keyExtractor={item => item.id}
          scrollEnabled={scrollEnabled}
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'ios' ? hp(8) : hp(10),
            marginHorizontal: 16,
          }}
          renderItem={({item}: any) => {
            const isAllIncluded = showFieldIds?.every(order =>
              sections.some(field => field.order === order),
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
                        fontValue + (item?.field_type === 'section' ? 20 : 16),
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
                      onPress={handleSubmit}
                    />
                  </View>
                ) : null}
              </>
            );
          }}
        />
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
  });
};
