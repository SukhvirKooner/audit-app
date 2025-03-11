/* eslint-disable react-native/no-inline-styles */
import {useTheme} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Text,
} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {useAppSelector} from '../redux/hooks';
import {Icons} from '../theme/images';
import {commonFontStyle, hp, wp} from '../theme/fonts';
import CustomImage from './CustomImage';
import {useDispatch} from 'react-redux';
import {uploadImageDataAction} from '../service/AuditService';
// import RNFS from 'react-native-fs';
// import Exif from 'react-native-exif';
interface ImageModalProps {
  isVisible: boolean;
  onCloseModal: () => void;
  value: string;
}

const ImageModal = ({
  isVisible,
  onCloseModal,
  value,
  selectedImageID,
}: ImageModalProps) => {
  const {colors} = useTheme();
  const {fontValue} = useAppSelector(state => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );
  const [metadata, setMetadata] = useState(null);

  const imageUrl = value;
  const dispatch = useDispatch();

  console.log('selectedImageID', selectedImageID);

  const fetchImageMetadata = async () => {
    let obj = {
      data: Number(selectedImageID),
      onSuccess: res => {
        setMetadata(res?.metadata);
      },
      onFailure: () => {},
    };
    dispatch(uploadImageDataAction(obj));
    // try {
    //   // Download the image to a local path
    //   const localPath = `${RNFS.DocumentDirectoryPath}/image.jpg`;
    //   await RNFS.downloadFile({
    //     fromUrl: imageUrl,
    //     toFile: localPath,
    //   }).promise;

    //   // Extract metadata
    //   const exifData = await Exif.getExif(localPath);
    //   setMetadata(exifData);
    //   console.log('Metadata:', exifData);
    // } catch (error) {
    //   console.error('Error fetching metadata:', error);
    // }
  };

  return (
    <ReactNativeModal
      onBackButtonPress={onCloseModal}
      onBackdropPress={onCloseModal}
      isVisible={isVisible}>
      <View style={styles.modalContainer}>
        <TouchableOpacity
          onPress={onCloseModal}
          style={{alignSelf: 'flex-end'}}>
          <Image
            resizeMode="contain"
            source={Icons.close}
            style={styles.closeIconStyle}
          />
        </TouchableOpacity>
        <View>
          {value ? (
            <View>
              {selectedImageID && (
                <TouchableOpacity
                  onPress={() => {
                    if (!metadata) {
                      fetchImageMetadata();
                    } else {
                      setMetadata(null);
                    }
                  }}
                  style={{zIndex: 1}}>
                  <Image
                    resizeMode="contain"
                    source={Icons.metadata}
                    style={styles.closeIconStyle1}
                  />
                </TouchableOpacity>
              )}
              {metadata ? (
                <ScrollView style={{height: 300}}>
                  <Text style={styles.metaDataText}>
                    {JSON.stringify(metadata)}
                  </Text>
                </ScrollView>
              ) : (
                <CustomImage uri={value} imageStyle={styles?.imageStyle} />
              )}
            </View>
          ) : (
            <CustomImage source={Icons.image} imageStyle={styles?.imageStyle} />
          )}
        </View>
      </View>
    </ReactNativeModal>
  );
};

const getGlobalStyles = ({colors, fontValue}: any) => {
  return StyleSheet.create({
    modalContainer: {
      padding: wp(4),
      backgroundColor: colors.modalBg,
      borderRadius: 10,
      width: wp(90),
    },
    closeIconStyle: {
      height: wp(4),
      width: wp(4),
      tintColor: colors.black,
    },
    closeIconStyle1: {
      height: wp(10),
      width: wp(10),
      // tintColor: colors.black,
      position: 'absolute',
      right: 60,
      zIndex: -1,
      top: 16,
    },
    imageStyle: {
      height: 300,
      width: wp(85),
      alignSelf: 'center',
      marginVertical: 12,
      borderRadius: 5,
      zIndex: 1,
    },
    metaDataText: {
      ...commonFontStyle(400, fontValue + 16, colors.black_T37),
      marginHorizontal: 20,
    },
  });
};

export default ImageModal;
