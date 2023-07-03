/* eslint-disable no-catch-shadow */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Button} from 'react-native';
import {IndexStyle} from '../../../../public/styles/index.style';
import {useNavigation} from '@react-navigation/native';
import {styles} from '../../../../styles';
import {RouteProps} from '../interface/route-interface';
import { ROUTES } from '../../../const/routes';

const ProductDeatils: React.FC<RouteProps> = ({route}) => {
  const {detailNumber} = route.params;
  const navigation = useNavigation();

  return (
    <>
      <View style={styles.container}>
        <Text style={IndexStyle.TopTitle}>
          Вироб: {detailNumber ? detailNumber : null}
        </Text>
        <Text style={IndexStyle.BottomTitle}>Статус: Контроль пройдено</Text>
        <View style={IndexStyle.Br} />
        <View style={IndexStyle.Br} />
        <Button
          color="#BB86FC"
          title="Назад"
          onPress={() => {
            navigation.replace(ROUTES.Main);
          }}
        />
      </View>
    </>
  );
};

export default ProductDeatils;
