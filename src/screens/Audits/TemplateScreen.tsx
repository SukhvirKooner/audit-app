import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import CustomHeader from '../../components/CustomHeader';
import {useRoute, useTheme} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {getTemplate} from '../../service/AuditService';

const TemplateScreen = () => {
  const {params}: any = useRoute();
  const dispatch = useAppDispatch();
  const {colors} = useTheme();
  const {fontValue} = useAppSelector(state => state.common);
  const styles = React.useMemo(
    () => getGlobalStyles({colors, fontValue}),
    [colors, fontValue],
  );

  useEffect(() => {
    // onGetTemplate();
  }, []);

  const onGetTemplate = async () => {
    let obj = {
      data: {
        id: params?.auditItem?.template,
      },
      onSuccess: (res: any) => {
        console.log('res', res);
      },
      onFailure: () => {},
    };
    dispatch(getTemplate(obj));
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title={params?.headerTitle}
        subTitle={'22 Nov 2024'}
        downloadIcon
        refreshIcon
        showMap
      />
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
  });
};
