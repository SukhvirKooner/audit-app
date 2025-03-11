import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CustomImage from './CustomImage';
import {Icons} from '../theme/images';
import {addMetadataToBase64, openImagePicker1} from '../utils/commonFunction';
import Exif from 'react-native-exif';
import piexif from 'piexifjs';
import {requestLocationPer} from '../utils/locationHandler';
import {useAppDispatch} from '../redux/hooks';
import {IS_LOADING} from '../redux/actionTypes';
interface Props {
  onImageSelected: (value: any) => void;
  isVisible: boolean;
  onClose: (value: boolean) => void;
}

const ImageSelectionModal = ({
  onImageSelected,
  onClose,
  isVisible,
  fileData,
  currentLocation,
}: Props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoaderShow, setIsLoaderShow] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setModalVisible(isVisible);
  }, [isVisible]);

  console.log('fileData', fileData);

  const handleCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 800,
        maxWidth: 800,
        quality: 1,
      },
      (response: any) => {
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

          onImageSelected([newI]);
          closeModal();
        }
        closeModal();
      },
    );
  };

  const handleCameraLocation = async () => {
    // dispatch({type: IS_LOADING, payload: true});

    setIsLoaderShow(true);
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
            dispatch({type: IS_LOADING, payload: false});

            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.errorCode) {
              console.error('Image Picker Error:', response.errorMessage);
            } else {
              const {uri, base64, type} = response.assets[0];
              console.log('response.assets[0]', uri);

              try {
                // Get existing EXIF data
                const exifData = await Exif.getExif(uri);
                console.log('exifStr', JSON.stringify(exifData));
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

                  onImageSelected([newI]);
                  dispatch({type: IS_LOADING, payload: false});

                  closeModal();
                }
              } catch (error) {
                console.error('Error getting EXIF:', error);
                closeModal();
                dispatch({type: IS_LOADING, payload: false});
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
          // console.log('newData', newData);
          onImageSelected(newData);
          closeModal();
        }
        closeModal();
      },
    );
  };

  const handleGalleryLocation = () => {
    openImagePicker1({
      onSucess: async res => {
        console.log('handleGalleryLocationres', res);

        // const exifData = await Exif.getExif(res?.uri);

        // const exifStr = exifData.exif ? exifData.exif : null;

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

          onImageSelected([newI]);
          closeModal();
        }
      },
      onFail: () => {
        closeModal();
      },
    });
  };

  const closeModal = () => {
    setModalVisible(false);
    onClose(false);
  };

  return (
    <Modal
      isVisible={isModalVisible}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
      style={styles.bottomModal}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Choose Option</Text>

        <TouchableOpacity
          style={styles.button}
          disabled={isLoaderShow}
          onPress={() => {
            fileData?.location_on_photo
              ? handleCameraLocation()
              : handleCamera();
          }}>
          {isLoaderShow ? (
            <ActivityIndicator size={'small'} color={'#fff'} />
          ) : (
            <Text style={styles.buttonText}>Open Camera</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            fileData?.location_on_photo
              ? handleGalleryLocation()
              : handleGallery();
          }}>
          <Text style={styles.buttonText}>Open Gallery</Text>
        </TouchableOpacity>

        <CustomImage
          source={Icons.cross}
          onPress={closeModal}
          containerStyle={styles.containerStyle}
        />
      </View>
    </Modal>
  );
};

export default ImageSelectionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  containerStyle: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
