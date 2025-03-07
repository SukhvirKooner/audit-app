import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CustomImage from './CustomImage';
import {Icons} from '../theme/images';
import {openImagePicker1} from '../utils/commonFunction';

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
}: Props) => {
  const [isModalVisible, setModalVisible] = useState(false);

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
      onSucess: res => {
        console.log('res', res);

        const newI = {
          uri: res?.uri,
          base64: res?.base64,
          type: res?.type,
        };
        console.log('newI', newI);

        onImageSelected([newI]);
        closeModal();
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

        <TouchableOpacity style={styles.button} onPress={handleCamera}>
          <Text style={styles.buttonText}>Open Camera</Text>
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
