import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CustomImage from './CustomImage';
import {Icons} from '../theme/images';

interface Props {
  onImageSelected: (value: any) => void;
  isVisible: boolean;
  onClose: (value: boolean) => void;
}

const ImageSelectionModal = ({onImageSelected, onClose, isVisible}: Props) => {
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setModalVisible(isVisible);
  }, [isVisible]);

  const handleCamera = () => {
    launchCamera({mediaType: 'photo', includeBase64: true}, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('Image Picker Error:', response.errorMessage);
      } else {
        const {uri, base64, fileSize} = response.assets[0];

        console.log('fileSize', fileSize);

        onImageSelected({uri: uri, base64: base64});
        closeModal();
      }
      closeModal();
    });
  };

  const handleGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 100,
        maxWidth: 100,
        quality: 1,
      },
      (response: any) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.error('Image Picker Error:', response.errorMessage);
        } else {
          const {uri, base64, fileSize} = response.assets[0];

          console.log('fileSize', base64, fileSize);

          onImageSelected({uri: uri, base64: base64});
          closeModal();
        }
        closeModal();
      },
    );
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

        <TouchableOpacity style={styles.button} onPress={handleGallery}>
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
