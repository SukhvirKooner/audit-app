/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {
  Alert,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {commonFontStyle, hp, hps, wp} from '../../theme/fonts';
import {useTheme} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import RenderRadioButton from '../RenderRadioButton';
import CustomImage from '../CustomImage';
import {api, GOOGLE_API_KEY} from '../../utils/apiConstants';
import {Icons} from '../../theme/images';
import CustomText from '../CustomText';
import MapView, {Marker} from 'react-native-maps';
import ToggleComponent from '../ToggleComponent';
import RenderCheckbox from '../RenderCheckbox';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import ImageSelectionModal from '../ImageSelectionModal';
import {IS_LOADING} from '../../redux/actionTypes';
import {requestLocationPer} from '../../utils/locationHandler';
import ImageModal from '../ImageModal';
import Loader from '../Loader';
import CustomMapView from '../CustomMapView';
import SignatureScreen from 'react-native-signature-canvas';
import SignatureExample from '../SignatureExample';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {getDropDownListAction, uploadImage} from '../../service/AuditService';
import PdfView from '../PdfView';
import {
  addMetadataToBase64,
  errorToast,
  navigateTo,
  openImagePicker1,
} from '../../utils/commonFunction';
import {screenNames, SCREENS} from '../../navigation/screenNames';
import {navigationRef} from '../../navigation/RootContainer';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CustomDropDownView from '../CustomDropDownView';
import MultiDropDownView from '../MultiDropDownView';
import SingleDropDownView from '../SingleDropDownView';
import Exif from 'react-native-exif';
import piexif from 'piexifjs';

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

interface TemplateRenderItemProps {
  fields: FormField;
  params: any;
  formValues: any;
  formErrors?: any;
  handleInputChange: (id: number, value: any, type?: string) => void;
  isEdit: boolean;
  isMapLoaded: boolean;
  handleDeleteImage: (fieldId: number, imageId: string) => void;
  onUploadImage: (image: any) => void;
  setImageSource: (image: any) => void;
  setSelectFieldId: (id: number) => void;
  getAddress: (field: FormField) => void;
  handlesConditionalFields: () => void;
  handlesConditionalFieldsRemove: () => void;
  handlesConditionalFieldsss: () => void;
  onRepeatableViewPress: () => void;
}

const TemplateRenderItem = ({
  fields,
  formValues,
  formErrors,
  handleInputChange,
  isEdit,
  handleDeleteImage,
  onUploadImage,
  setImageSource,
  setSelectFieldId,
  isMapLoaded,
  getAddress,
  setScrollEnabled,
  params,
  handlesConditionalFields,
  handlesConditionalFieldsRemove,
  handlesConditionalFieldsss,
  handlesConditionalFieldDropDown,
  onRepeatableViewPress,
  currentLocation,
}: TemplateRenderItemProps) => {
  const {colors}: any = useTheme();
  const {fontValue, userInfo} = useAppSelector(state => state.common);

  const [checkBox, setCheckBox] = useState('');
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [selectField, setSelectField] = useState('');
  // const [selectID, setSelectID] = useState('');
  let selectID = useRef();

  console.log('selectID', selectID.current);

  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );
  const dispatch = useAppDispatch();
  const mapCameraRef = useRef<any>(null);

  const [open, setOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [selectedImageID, setSelectedImageID] = useState<any>(null);
  const [selectedPdf, setSelectedPdf] = useState<any>(null);
  const [isLoaderShow, setIsLoaderShow] = useState(false);

  // const [isMapLoaded, setIsMapLoaded] = useState(true);

  const renderError = (fieldId: number) => {
    if (formErrors[fieldId]) {
      return <Text style={styles.errorText}>{formErrors[fieldId]}</Text>;
    }
    return null;
  };

  const onUploadSignature = async (id, data: any) => {
    dispatch({type: IS_LOADING, payload: true});
    try {
      const obj = {
        audit: params?.auditItem?.id,
        filled_by: userInfo?.id,
        template_field: id,
        image: data,
      };
      const linkData = await uploadImage(obj);

      let newValue = {
        url: linkData?.image_url || linkData?.url,
        id: linkData?.image_id || linkData?.id,
      };

      console.log('linkData123', newValue);

      handleInputChange(id, newValue);
      setScrollEnabled(true);
      dispatch({type: IS_LOADING, payload: false});
    } catch (error) {
      console.error(`Failed to upload ${image.filename}:`, error);
      dispatch({type: IS_LOADING, payload: false});
      setScrollEnabled(true);
    }
  };

  const pickDocument = async selectFieldId => {
    try {
      const result = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.plainText,
          DocumentPicker.types.doc,
          DocumentPicker.types.pdf,
          DocumentPicker.types.docx,
          DocumentPicker.types.xls,
          DocumentPicker.types.xlsx,
          DocumentPicker.types.ppt,
          DocumentPicker.types.pptx,
        ],
      });
      dispatch({type: IS_LOADING, payload: true});

      console.log('Selected file: ', result);
      const fileUri = result[0].uri;

      const base64File = await RNFS.readFile(fileUri, 'base64');
      console.log('Base64:asdadasdas', base64File);
      const newValue = {
        base64: `data:${result[0].type};base64,${base64File}`,
        name: result[0].name,
        uri: result[0].uri,
      };
      handleInputChange(selectFieldId, [newValue]);
      dispatch({type: IS_LOADING, payload: false});
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the picker');
      } else {
        console.error('Error picking document:', err);
      }
    }
  };

  const onPdfView = async field => {
    dispatch({type: IS_LOADING, payload: true});
    if (params?.type === 'view') {
      let outputFileName =
        formValues?.[field.id][0]?.name?.split('/')?.pop() ||
        formValues?.[field.id]?.split('/')?.pop();

      console.log('outputFileName', api.BASE_URL_VIEW + formValues?.[field.id]);

      const outputPath =
        Platform.OS === 'android'
          ? `${RNFS.DownloadDirectoryPath}/${
              moment().unix() + '_' + outputFileName
            }` // Downloads folder on Android
          : `${RNFS.DocumentDirectoryPath}/${outputFileName}`; // Document directory on iOS
      console.log('outputFileName path', outputPath);

      try {
        const result = await RNFS.downloadFile({
          fromUrl: api.BASE_URL_VIEW + formValues?.[field.id],
          toFile: outputPath,
          background: false,
          cacheable: false,
          connectionTimeout: 60 * 1000,
          readTimeout: 120 * 1000,
        }).promise;

        if (result.statusCode === 200) {
          dispatch({type: IS_LOADING, payload: false});
          navigateTo(SCREENS.PdfScreen, {pdfPath: outputPath, showIcon: false});
        } else {
          console.log('result', result);

          // Alert.alert('Failed', 'File download failed.');
          errorToast('Download failed');
          setShowPdfPreview(false);
          dispatch({type: IS_LOADING, payload: false});
        }
      } catch (error) {
        console.log('error', error);
        errorToast('Download failed');
        setShowPdfPreview(false);
        dispatch({type: IS_LOADING, payload: false});
      }
    } else {
      navigateTo(SCREENS.PdfScreen, {
        pdfPath: formValues?.[field.id][0]?.base64,
        showIcon: false,
        edit: true,
      });
      dispatch({type: IS_LOADING, payload: false});
    }

    // setSelectedPdf(api.BASE_URL + formValues?.[field.id]);
  };

  const handleCameraLocation = async () => {
    setIsLoaderShow(true);
    // dispatch({type: IS_LOADING, payload: true});

    await requestLocationPer(
      async (response: any) => {
        const {latitude, longitude} = response;
        launchCamera(
          {
            mediaType: 'photo',
            includeBase64: true,
          },
          async (response: any) => {
            setIsLoaderShow(false);
            if (response.didCancel) {
              dispatch({type: IS_LOADING, payload: false});

              console.log('User cancelled image picker');
            } else if (response.errorCode) {
              dispatch({type: IS_LOADING, payload: false});

              console.error('Image Picker Error:', response.errorMessage);
            } else {
              dispatch({type: IS_LOADING, payload: false});

              const {uri, base64, type} = response.assets[0];
              try {
                // Get existing EXIF data
                const exifData = await Exif.getExif(uri);

                const exifStr = exifData.exif ? exifData.exif : null;
                const timestamp = Date.now();

                // Add GPS Metadata
                const updatedBase64 = addMetadataToBase64(
                  base64,
                  exifStr,
                  {
                    latitude: latitude,
                    longitude: longitude,
                    timestamp,
                  },
                  exifData,
                );

                if (updatedBase64) {
                  const newI = {
                    uri: uri,
                    base64: updatedBase64,
                    type: type,
                  };

                  onUploadImage([newI], selectID.current);
                }
              } catch (error) {
                dispatch({type: IS_LOADING, payload: false});
                console.error('Error getting EXIF:', error);
              }
            }
          },
        );
      },
      (err: any) => {
        setIsLoaderShow(false);
        dispatch({type: IS_LOADING, payload: false});

        console.log('<---current location error --->\n', err);
      },
    );
  };

  const handleCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: true,
      },
      async (response: any) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.error('Image Picker Error:', response.errorMessage);
        } else {
          const {uri, base64, type} = response.assets[0];
          const newI = {
            uri: uri,
            base64: base64,
            type: type,
          };
          onUploadImage([newI], selectID.current);
        }
      },
    );
  };

  const handleGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 800,
        maxWidth: 800,
        quality: 1,
        selectionLimit: 5,
      },
      (response: any) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.error('Image Picker Error:', response.errorMessage);
        } else {
          const newData = response.assets?.map((item: any) => {
            return {
              uri: item.uri,
              base64: item.base64,
              type: item.type,
            };
          });
          console.log('newData', newData);
          onUploadImage(newData, selectID.current);
        }
      },
    );
  };

  const handleGalleryLocation = () => {
    openImagePicker1({
      onSucess: async res => {
        console.log('res', res);
        // const exifData = await Exif.getExif(res?.uri);

        const updatedBase64 = addMetadataToBase64(
          res?.base64,
          null,
          {
            latitude: res?.latitude,
            longitude: res?.longitude,
            timestamp: res?.timestamp,
          },
          null,
        );

        if (updatedBase64) {
          const newI = {
            uri: res?.uri,
            base64: updatedBase64,
            type: res?.type,
          };

          console.log('newI', newI);

          onUploadImage([newI], selectID.current);
        }
      },
    });
  };

  const renderField = (field: FormField | any) => {
    switch (field.field_type) {
      case 'heading':
        return (
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>{field.label}</Text>
          </View>
        );
      case 'sub_form':
        return (
          <>
            <TouchableOpacity
              onPress={() => {
                if (field?.repeatable) {
                  onRepeatableViewPress(field);
                }
              }}
              style={[styles.sub_formView, {marginBottom: 5}]}>
              <Text style={styles.sub_formText}>{field.label}</Text>
              <Image
                source={Icons.ic_back}
                style={{
                  width: 18,
                  height: 18,
                  transform: [{rotate: '180deg'}],
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
            <Text style={styles.remarkText}>{field?.remark}</Text>
            {renderError(field.id)}
          </>
        );
      case 'label':
        return (
          <View style={{}}>
            <Text style={styles.sectionTitle1}>{field.options?.text}</Text>
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
              placeholderTextColor={colors.gray}
            />
            <Text style={styles.remarkText}>{field?.remark}</Text>
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
              placeholderTextColor={colors.gray}
              multiline
              textAlignVertical="top"
            />
            <Text style={styles.remarkText}>{field?.remark}</Text>
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
              placeholderTextColor={colors.gray}
            />
            <Text style={styles.remarkText}>{field?.remark}</Text>
            {renderError(field.id)}
          </>
        );
      case 'dropdown':
        console.log('dropdown dropdown', formValues);

        if (field.options?.selection_type === 'multiple') {
          return (
            <>
              <MultiDropDownView
                isEdit={isEdit}
                field={field}
                formValues={formValues}
                handleInputChangeMultiple={(id, value, item) => {
                  handleInputChange(id, value, 'multiple');
                }}
                currentLocationNew={currentLocation}
              />
              <Text style={styles.remarkText}>{field?.remark}</Text>
              {renderError(field.id)}
            </>
          );
        }

        return (
          <>
            <SingleDropDownView
              isEdit={isEdit}
              field={field}
              formValues={formValues}
              handleInputChange={(id, value) => {
                handleInputChange(id, value);
              }}
              handlesConditionalFieldDropDown={handlesConditionalFieldDropDown}
              handlesConditionalFieldsRemove={handlesConditionalFieldsRemove}
              currentLocationNew={currentLocation}
            />
            <Text style={styles.remarkText}>{field?.remark}</Text>
            {renderError(field.id)}
          </>
        );

      // return (
      //   <>
      //     {field.options?.selection_type === 'multiple' ? (
      //       <MultiSelect
      //         disable={!isEdit}
      //         style={{
      //           ...styles.dropdown,
      //           backgroundColor: isEdit ? colors.gray_ea : 'transparent',
      //         }}
      //         data={
      //           field.options?.choices?.map((choice: any) => ({
      //             label: choice,
      //             value: choice,
      //           })) || []
      //         }
      //         labelField="label"
      //         valueField="value"
      //         dropdownPosition="auto"
      //         placeholder={field.label}
      //         value={formValues[field.id] ?? []}
      //         onChange={item => handleInputChange(field.id, item, 'multiple')}
      //         itemContainerStyle={{backgroundColor: colors.modalBg}}
      //         placeholderStyle={{
      //           ...commonFontStyle(400, 16, colors.black),
      //         }}
      //         itemTextStyle={{
      //           ...commonFontStyle(400, 16, colors.black),
      //         }}
      //         selectedTextStyle={{
      //           ...commonFontStyle(400, 16, colors.black),
      //         }}
      //       />
      //     ) : (
      //       <Dropdown
      //         disable={!isEdit}
      //         style={{
      //           ...styles.dropdown,
      //           backgroundColor: isEdit ? colors.gray_ea : 'transparent',
      //         }}
      //         data={
      //           field.options?.choices?.map((choice: any) => ({
      //             label: choice,
      //             value: choice,
      //           })) || []
      //         }
      //         containerStyle={{
      //           borderRadius: 10,
      //           marginTop: 10,
      //         }}
      //         dropdownPosition="auto"
      //         labelField="label"
      //         valueField="value"
      //         placeholder={field.label}
      //         value={formValues[field.id]}
      //         itemContainerStyle={{backgroundColor: colors.modalBg}}
      //         itemTextStyle={{
      //           ...commonFontStyle(400, 16, colors.black),
      //         }}
      //         onChange={item => {
      //           if (
      //             formValues[field.id] == undefined ||
      //             formValues[field.id] !== item.value
      //           ) {
      //             handleInputChange(field.id, item.value);
      //             if (
      //               field.conditional_fields[0]?.condition_value == item.value
      //             ) {
      //               handlesConditionalFieldsss(
      //                 field.id,
      //                 field.conditional_fields[0]?.show_fields,
      //               );
      //             } else {
      //               handlesConditionalFieldsRemove(
      //                 field.id,
      //                 field.conditional_fields[0]?.show_fields,
      //               );
      //             }
      //           }
      //         }}
      //         placeholderStyle={{
      //           ...commonFontStyle(400, 16, colors.black),
      //         }}
      //         selectedTextStyle={{
      //           ...commonFontStyle(400, 16, colors.black),
      //         }}
      //       />
      //     )}
      //     <Text style={styles.remarkText}>{field?.remark}</Text>
      //     {renderError(field.id)}
      //   </>
      // );
      // return (
      //   <>
      //     {/* <CustomDropDownView
      //       isEdit={isEdit}
      //       field={field}
      //       currentLocationNew={currentLocation}
      //       formValues={formValues}
      //       handlesConditionalFieldsss={handlesConditionalFieldsss}
      //       handlesConditionalFieldsRemove={handlesConditionalFieldsRemove}
      //       handleInputChange={(id, value) => {
      //         handleInputChange(id, value);
      //       }}
      //       handleInputChangeMultiple={(id, value, item) => {
      //         handleInputChange(id, value, 'multiple');
      //       }}
      //     /> */}
      //     {/* {field.options?.selection_type === 'multiple' ? (
      //       <MultiDropDownView
      //         isEdit={isEdit}
      //         field={field}
      //         formValues={formValues}
      //         handleInputChangeMultiple={(id, value, item) => {
      //           handleInputChange(id, value, 'multiple');
      //         }}
      //         currentLocationNew={currentLocation}
      //       />
      //     ) : (
      //       <SingleDropDownView
      //         isEdit={isEdit}
      //         field={field}
      //         formValues={formValues}
      //         handleInputChange={(id, value) => {
      //           handleInputChange(id, value);
      //         }}
      //         handlesConditionalFieldsss={handlesConditionalFieldsss}
      //         handlesConditionalFieldsRemove={handlesConditionalFieldsRemove}
      //         currentLocationNew={currentLocation}
      //       />
      //     )}
      //     <Text style={styles.remarkText}>{field?.remark}</Text>
      //     {renderError(field.id)} */}
      //   </>
      // );

      case 'image':
        return (
          <>
            <FlatList
              horizontal
              contentContainerStyle={{
                gap: 10,
                overflow: 'visible',
                paddingRight: 20,
              }}
              data={formValues[field.id]}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              renderItem={({item}: any) => (
                <View style={styles.imageContainer}>
                  <CustomImage
                    uri={api.BASE_URL_VIEW + item.url}
                    size={hp(14)}
                    // disabled={!isEdit}
                    containerStyle={{borderRadius: 10, overflow: 'hidden'}}
                    onPress={() => {
                      setShowImagePreview(true);
                      setSelectedImageID(item?.id);
                      setSelectedImage(api.BASE_URL_VIEW + item.url);
                    }}
                  />
                  {isEdit && (
                    <CustomImage
                      source={Icons.plus}
                      disabled={!isEdit}
                      size={hps(35)}
                      onPress={() => {
                        handleDeleteImage(field.id, item.id);
                      }}
                      containerStyle={{
                        position: 'absolute',
                        top: -0,
                        right: -10,
                      }}
                      imageStyle={{transform: [{rotate: '45deg'}]}}
                    />
                  )}
                </View>
              )}
              ListHeaderComponent={() => (
                <>
                  {isEdit && (
                    <TouchableOpacity
                      disabled={!isEdit}
                      onPress={() => {
                        setSelectFieldId(field.id);
                        // setSelectID(field.id);
                        selectID.current = field.id;
                        if (field?.other?.photo_taken_from == 'files') {
                          if (field?.other?.location_on_photo) {
                            handleGalleryLocation();
                          } else {
                            handleGallery();
                          }
                        } else if (field?.other?.photo_taken_from == 'camera') {
                          if (field?.other?.location_on_photo) {
                            handleCameraLocation();
                          } else {
                            handleCamera();
                          }
                        } else {
                          setSelectField(field?.other);
                          setImageModal(true);
                        }
                      }}
                      style={styles.imageContainer}>
                      <CustomText
                        text={'Upload Image'}
                        style={styles.imageText}
                      />
                    </TouchableOpacity>
                  )}
                </>
              )}
            />
            <Text style={styles.remarkText}>{field?.remark}</Text>
            {renderError(field.id)}
          </>
        );
      case 'file':
        return (
          <>
            {isEdit && !formValues?.[field.id] && (
              <TouchableOpacity
                disabled={!isEdit}
                onPress={() => {
                  pickDocument(field.id);
                }}
                style={styles.imageContainer}>
                <CustomText text={'Upload File'} style={styles.imageText} />
              </TouchableOpacity>
            )}
            {formValues?.[field.id] && (
              <TouchableOpacity
                onPress={() => {
                  onPdfView(field);
                }}
                style={styles.imageContainer}>
                <CustomImage
                  source={Icons.document}
                  size={22}
                  tintColor={colors.black}
                />
                <Text numberOfLines={2} style={styles.fileText}>
                  {formValues?.[field.id][0]?.name?.split('/')?.pop() ||
                    formValues?.[field.id]?.split('/')?.pop() ||
                    ''}
                </Text>
                {isEdit && (
                  <CustomImage
                    source={Icons.plus}
                    disabled={!isEdit}
                    size={hps(35)}
                    onPress={() => {
                      // handleDeleteImage(field.id, item.id);
                      handleInputChange(field.id, '');
                    }}
                    containerStyle={{
                      position: 'absolute',
                      top: -0,
                      right: -10,
                    }}
                    imageStyle={{transform: [{rotate: '45deg'}]}}
                  />
                )}
              </TouchableOpacity>
            )}
            <Text style={styles.remarkText}>{field?.remark}</Text>
            {renderError(field.id)}
          </>
        );
      case 'location':
        console.log('formValues[field.id]', formValues[field.id]);

        return (
          <>
            {field.label === 'Current Location' ? null : (
              <View style={styles.locationContainer}>
                {/* {isMapLoaded ? (
                  <View>
                    <Loader />
                  </View>
                ) : (
                  <MapView
                    ref={mapCameraRef}
                    initialRegion={{
                      latitude:
                        Number(formValues[field.id]?.split(',')[0]) || 0,
                      longitude:
                        Number(formValues[field.id]?.split(',')[1]) || 0,
                      latitudeDelta: 28.679079,
                      longitudeDelta: 77.06971,
                    }}
                    provider="google"
                    loadingEnabled
                    zoomControlEnabled
                    key={GOOGLE_API_KEY}
                    showsUserLocation={true}
                    moveOnMarkerPress
                    // onRegionChangeComplete={onRegionDidChange}
                    onPress={(e: any) => {
                      if (!isEdit) return;
                      const {latitude, longitude} = e.nativeEvent.coordinate;
                      handleInputChange(field.id, `${latitude},${longitude}`);
                    }}
                    onRegionChangeComplete={() => {
                      // setIsMapLoaded(true);
                      mapCameraRef?.current?.setCamera({
                        center: {
                          latitude: Number(formValues[field.id]?.split(',')[0]),
                          longitude: Number(
                            formValues[field.id]?.split(',')[1],
                          ),
                          latitudeDelta: 28.679079,
                          longitudeDelta: 77.06971,
                        },
                        zoom: 11, // Adjust zoom level
                        animation: {
                          duration: 1000, // Duration of the animation
                          easing: () => {},
                        },
                      });
                    }}
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
                )} */}
                <CustomMapView
                  latitude={Number(formValues[field.id]?.split(',')?.[0]) || 0}
                  longitude={Number(formValues[field.id]?.split(',')?.[1]) || 0}
                  isEdit={isEdit}
                  field={field}
                  formValues={formValues}
                  handleInputChange={(latitude, longitude) => {
                    handleInputChange(field.id, `${latitude},${longitude}`);
                  }}
                />
                {isEdit && (
                  <TouchableOpacity
                    style={styles.locationView}
                    onPress={() => {
                      // console.log('field.id', field.id);
                      getAddress(field.id);
                    }}>
                    <CustomText text={'Get Location'} style={styles.location} />
                  </TouchableOpacity>
                )}

                {/* {formValues[field.id] && (
                <CustomText
                  text={formValues[field.id]}
                  style={styles.location}
                />
              )} */}
              </View>
            )}
            <Text style={styles.remarkText}>{field?.remark}</Text>
            {field.label === 'Current Location' ? null : renderError(field.id)}
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
            <Text style={styles.remarkText}>{field?.remark}</Text>
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
            <Text style={styles.remarkText}>{field?.remark}</Text>
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
                disabled={
                  !isEdit || formValues[field.id] === field.options?.yes_label
                }
                onPress={() => {
                  handleInputChange(field.id, field.options?.yes_label);
                  console.log(
                    'field.conditional_fields[0]?.show_fields',
                    field.conditional_fields[0]?.show_fields,
                  );
                  if (
                    field.conditional_fields[0]?.condition_value ==
                    field.options?.yes_label
                  ) {
                    handlesConditionalFieldsss(
                      `${field.id}-${field.conditional_fields[0]?.show_fields}`,
                      field.conditional_fields[0]?.show_fields,
                    );
                  } else {
                    handlesConditionalFieldsRemove(
                      `${field.id}-${field.conditional_fields[0]?.show_fields}`,
                      field.conditional_fields[0]?.show_fields,
                    );
                  }

                  // handlesConditionalFields(
                  //   field.id,
                  //   field.conditional_fields[0]?.show_fields,
                  // );
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
                disabled={
                  !isEdit || formValues[field.id] === field.options?.no_label
                }
                onPress={() => {
                  handleInputChange(field.id, field.options?.no_label);
                  console.log(
                    'field.conditional_fields[0]?.show_fields',
                    field.conditional_fields[0]?.show_fields,
                  );

                  if (
                    field.conditional_fields[0]?.condition_value ==
                    field.options?.no_label
                  ) {
                    handlesConditionalFieldsss(
                      `${field.id}-${field.conditional_fields[0]?.show_fields}`,
                      field.conditional_fields[0]?.show_fields,
                    );
                  } else {
                    handlesConditionalFieldsRemove(
                      `${field.id}-${field.conditional_fields[0]?.show_fields}`,
                      field.conditional_fields[0]?.show_fields,
                    );
                  }

                  // if (formValues[field.id] == undefined) {
                  //   handlesConditionalFields(field.id, []);
                  // } else {
                  //   handlesConditionalFields(
                  //     field.id,
                  //     field.conditional_fields[0]?.show_fields,
                  //   );
                  // }
                }}>
                <RenderRadioButton
                  value={formValues[field.id] === field.options?.no_label}
                />
                <CustomText
                  style={styles.label}
                  text={field.options?.no_label}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.remarkText}>{field?.remark}</Text>
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
              {field.options?.choices?.map((choice: string) => (
                <TouchableOpacity
                  style={{
                    ...styles.switchContainer,
                    justifyContent: 'flex-start',
                    gap: 15,
                  }}
                  disabled={!isEdit || formValues[field.id] == choice}
                  onPress={() => {
                    if (
                      formValues[field.id] == undefined ||
                      formValues[field.id] !== choice
                    ) {
                      handleInputChange(field.id, choice);
                      if (
                        field.conditional_fields[0]?.condition_value == choice
                      ) {
                        handlesConditionalFieldsss(
                          `${field.id}-${field.conditional_fields[0]?.show_fields}`,
                          field.conditional_fields[0]?.show_fields,
                        );
                      } else {
                        handlesConditionalFieldsRemove(
                          `${field.id}-${field.conditional_fields[0]?.show_fields}`,
                          field.conditional_fields[0]?.show_fields,
                        );
                      }
                    }
                  }}>
                  <RenderRadioButton value={formValues[field.id] === choice} />
                  <CustomText style={styles.label} text={choice} />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.remarkText}>{field?.remark}</Text>
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
              {field.options?.choices?.map((choice: string) => (
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
            <Text style={styles.remarkText}>{field?.remark}</Text>
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
                  onPress={() => {
                    handleInputChange(field.id, choice, 'checkbox');
                    handlesConditionalFields(
                      // field.id,
                      `${field.id}-${field?.conditional_fields?.[0]?.show_fields}`,
                      field.conditional_fields[0]?.condition_value == choice
                        ? field.conditional_fields[0]?.show_fields
                        : [],
                    );
                  }}
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
            <Text style={styles.remarkText}>{field?.remark}</Text>
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
            <Text style={styles.remarkText}>{field?.remark}</Text>
            {renderError(field.id)}
          </>
        );
      case 'signature':
        return (
          <>
            {isEdit ? (
              <>
                <TouchableOpacity
                  onPress={() => {
                    if (formValues?.[field.id]?.url) {
                      setShowImagePreview(true);
                      setSelectedImage(
                        api.BASE_URL_VIEW + formValues?.[field.id]?.url,
                      );
                    } else {
                      setShowSignatureModal(true);
                    }
                  }}
                  style={[styles.imageContainer, {width: '100%'}]}>
                  {formValues?.[field.id]?.url && (
                    <CustomImage
                      onPress={() => {
                        if (formValues?.[field.id]?.url) {
                          setShowImagePreview(true);
                          setSelectedImage(
                            api.BASE_URL_VIEW + formValues?.[field.id]?.url,
                          );
                        } else {
                          setShowSignatureModal(true);
                        }
                      }}
                      uri={api.BASE_URL_VIEW + formValues?.[field.id]?.url}
                      imageStyle={{width: wp(30), height: hp(20)}}
                      containerStyle={
                        {
                          // ...styles.imageContainer,
                          // justifyContent: 'center',
                          // alignItems: 'center',
                        }
                      }
                    />
                  )}
                  {formValues?.[field.id]?.url && (
                    <CustomImage
                      source={Icons.plus}
                      disabled={!isEdit}
                      size={hps(35)}
                      onPress={() => {
                        // handleDeleteImage(field.id, item.id);
                        handleInputChange(field.id, '');
                      }}
                      containerStyle={{
                        position: 'absolute',
                        top: -0,
                        right: -10,
                      }}
                      imageStyle={{transform: [{rotate: '45deg'}]}}
                    />
                  )}
                </TouchableOpacity>
                <SignatureExample
                  isVisible={showSignatureModal}
                  value={formValues?.[field.id]?.url}
                  onCloseModal={() => {
                    setShowSignatureModal(false);
                  }}
                  onBegin={() => setScrollEnabled(true)}
                  onEnd={() => setScrollEnabled(true)}
                  onPress={value => {
                    onUploadSignature(field.id, value);
                    setShowSignatureModal(false);
                    // setScrollEnabled(true);
                  }}
                  onClearPress={() => {
                    setScrollEnabled(true);
                    // setShowSignatureModal(false);
                    handleInputChange(field.id, '');
                  }}
                />
              </>
            ) : (
              <CustomImage
                uri={api.BASE_URL_VIEW + formValues?.[field.id]?.[0]?.url}
                imageStyle={{width: wp(30), height: hp(20), top: 10}}
                containerStyle={{
                  ...styles.imageContainer,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            )}
            <Text style={styles.remarkText}>{field?.remark}</Text>
            {renderError(field.id)}
          </>
        );
      case 'section':
        return (
          <>
            <View style={styles.section}>
              {field?.sub_fields.map((FItem: any) => (
                <View key={FItem.id} style={styles.section}>
                  {FItem.field_type == 'heading' ||
                  FItem.label == 'Current Location' ? null : (
                    <CustomText
                      style={{
                        ...styles.label,
                        color: colors.black,
                      }}>
                      {FItem.label}
                      <Text style={{color: 'red'}}>
                        {FItem.is_required ? '*' : ''}
                      </Text>
                    </CustomText>
                  )}
                  {renderField(FItem)}
                </View>
              ))}
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View>
      {renderField(fields)}
      <ImageSelectionModal
        isVisible={imageModal}
        fileData={selectField}
        onImageSelected={(value: any) => {
          // setImageSource(value);
          onUploadImage(value, selectID.current);
          // handleInputChange(selectFieldId, value, 'image');
        }}
        currentLocation={currentLocation}
        onClose={setImageModal}
      />
      <ImageModal
        value={selectedImage}
        isVisible={showImagePreview}
        onCloseModal={() => setShowImagePreview(false)}
        selectedImageID={selectedImageID}
      />
      {/* <PdfView
        value={selectedPdf}
        isVisible={showPdfPreview}
        onCloseModal={() => setShowPdfPreview(false)}
      /> */}
    </View>
  );
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
      // marginTop: 20,
      padding: 10,
      borderRadius: 10,
    },
    sub_formView: {
      // marginTop: 20,
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionTitle: {
      ...commonFontStyle(400, fontValue + 16, colors.white),
      textAlign: 'center',
    },
    sub_formText: {
      ...commonFontStyle(400, fontValue + 16, colors.black),
      // textAlign: 'center',
      flex: 1,
    },
    sectionTitle1: {
      ...commonFontStyle(400, fontValue + 15, colors.black),
    },
    remarkText: {
      ...commonFontStyle(400, fontValue + 15, colors.black),
      marginTop: 12,
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
      height: hp(30),
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
    fileText: {
      ...commonFontStyle(400, fontValue + 12, colors.black_T37),
      textAlign: 'center',
      marginHorizontal: 12,
      top: 8,
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
