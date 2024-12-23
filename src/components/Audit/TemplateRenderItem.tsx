/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {commonFontStyle, hp, hps} from '../../theme/fonts';
import {useTheme} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import RenderRadioButton from '../RenderRadioButton';
import CustomImage from '../CustomImage';
import {api} from '../../utils/apiConstants';
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
}: TemplateRenderItemProps) => {
  const {colors}: any = useTheme();
  const {fontValue} = useAppSelector(state => state.common);
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
  const [selectedImage, setSelectedImage] = useState<any>(null);
  // const [isMapLoaded, setIsMapLoaded] = useState(true);

  const renderError = (fieldId: number) => {
    if (formErrors[fieldId]) {
      return <Text style={styles.errorText}>{formErrors[fieldId]}</Text>;
    }
    return null;
  };

  // useEffect(() => {
  //   if (
  //     fields.field_type === 'location' ||
  //     fields.label === 'Current Location'
  //   ) {
  //     if (fontValue[fields.id]) {
  //       return;
  //     } else {
  //       getAddress(fields.id);
  //     }
  //   } else if (fields.field_type === 'section') {
  //     fields.sub_fields?.map((i: any) => {
  //       if (
  //         i.field_type === 'location' ||
  //         fields.label === 'Current Location'
  //       ) {
  //         if (fontValue[i.id]) {
  //           return;
  //         } else {
  //           getAddress(i.id);
  //         }
  //       }
  //     });
  //   }
  // }, []);

  // const getAddress = async (id: any) => {
  //   try {
  //     dispatch({type: IS_LOADING, payload: true});
  //     await requestLocationPer(
  //       async (response: any) => {
  //         // setCurrentLocation(response);

  //         const {latitude, longitude} = response;
  //         dispatch({type: IS_LOADING, payload: false});
  //         if (mapCameraRef?.current) {
  //           mapCameraRef?.current?.setCamera({
  //             center: {
  //               latitude: latitude,
  //               longitude: longitude,
  //             },
  //             zoom: 11, // Adjust zoom level
  //             animation: {
  //               duration: 1000, // Duration of the animation
  //               easing: () => {},
  //             },
  //           });
  //         }
  //         if (id) {
  //           handleInputChange(id, `${latitude},${longitude}`);
  //           dispatch({type: IS_LOADING, payload: false});
  //         }
  //       },
  //       (err: any) => {
  //         dispatch({type: IS_LOADING, payload: false});
  //         console.log('<---current location error --->\n', err);
  //       },
  //     );
  //   } catch (error) {
  //     console.log('error', error);
  //   }
  // };

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
                  field.options?.choices?.map((choice: any) => ({
                    label: choice,
                    value: choice,
                  })) || []
                }
                labelField="label"
                valueField="value"
                dropdownPosition="auto"
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
                  field.options?.choices?.map((choice: any) => ({
                    label: choice,
                    value: choice,
                  })) || []
                }
                containerStyle={{
                  borderRadius: 10,
                  marginTop: 10,
                }}
                dropdownPosition="auto"
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
                    uri={api.BASE_URL + item.url}
                    size={hp(14)}
                    // disabled={!isEdit}
                    containerStyle={{borderRadius: 10, overflow: 'hidden'}}
                    onPress={() => {
                      setShowImagePreview(true);
                      setSelectedImage(api.BASE_URL + item.url);
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
                        setImageModal(true);
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

            {renderError(field.id)}
          </>
        );
      case 'location':
        return (
          <>
            {field.label === 'Current Location' ? null : (
              <View style={styles.locationContainer}>
                {isMapLoaded ? (
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
                    showsUserLocation={true}
                    moveOnMarkerPress
                    onPress={(e: any) => {
                      if (!isEdit) return;
                      const {latitude, longitude} = e.nativeEvent.coordinate;
                      handleInputChange(field.id, `${latitude},${longitude}`);
                    }}
                    onMapReady={() => {
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
                )}
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
              {field.options?.choices?.map((choice: string) => (
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
                        color: colors.gray_7B,
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
        onImageSelected={(value: any) => {
          // setImageSource(value);
          onUploadImage(value);
          // handleInputChange(selectFieldId, value, 'image');
        }}
        onClose={setImageModal}
      />
      <ImageModal
        value={selectedImage}
        isVisible={showImagePreview}
        onCloseModal={() => setShowImagePreview(false)}
      />
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
