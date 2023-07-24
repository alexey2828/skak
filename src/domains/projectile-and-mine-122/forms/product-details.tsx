/* eslint-disable no-catch-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text, Button, ScrollView} from 'react-native';
import {IndexStyle} from '../../../../public/styles/index.style';
import {useNavigation} from '@react-navigation/native';
import {styles} from '../../../../styles';
import {RouteProps} from '../interface/route-interface';
import {ROUTES} from '../../../const/routes';
import getFilteredData from '../../../infrastucture/domain-requests/get-filtered-data';
import {MAIN_TITLES} from '../../../const/titles-main';
import {PROJECTILE_AND_MINE_TITLES} from '../../projectile-and-mine-120/const/projectile-and-mine-titles';

const ProductDeatils122: React.FC<RouteProps> = ({route}) => {
  const {barcodeData} = route.params;

  const batch = barcodeData.substring(9, 11);
  const batchYear = barcodeData.substring(11, 13);
  const detailNumber = barcodeData.substring(13);
  const navigation = useNavigation();
  const [filteredData, setFilteredData] = useState([]);
  const data = filteredData.map(item => {
    return item;
  });
  const enityData = data[0];
  const fetchData = async () => {
    const filteredItems = await getFilteredData(detailNumber, batch, batchYear);
    setFilteredData(filteredItems);
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(enityData);

  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <Text style={IndexStyle.TopTitle}>
            Вироб: {detailNumber ? detailNumber : null}
          </Text>
          {enityData ? (
            <>
              <Text style={IndexStyle.BottomTitle}>
                Статус: Контроль пройдено
              </Text>
              <View style={IndexStyle.Br} />
              <View style={styles.detailsContainer}>
                <View style={{margin: 10}}>
                  <Text style={IndexStyle.BottomTitle}>
                    Вироб:{' '}
                    <Text style={{color: 'white'}}>
                      {detailNumber ? detailNumber : '...'}
                    </Text>
                  </Text>
                  <Text style={IndexStyle.BottomTitle}>
                    Калібр: <Text style={{color: 'white'}}>122</Text>
                  </Text>
                  <Text style={IndexStyle.BottomTitle}>
                    {PROJECTILE_AND_MINE_TITLES.BATCH}:{' '}
                    <Text style={[IndexStyle.TitleGreen, {color: 'white'}]}>
                      {batch ? batch : '...'}
                    </Text>
                  </Text>
                  <Text style={IndexStyle.BottomTitle}>
                    Номер корпусу виробника:{' '}
                    <Text style={{color: 'white'}}>
                      {enityData.manufacturerDetailNumber
                        ? enityData.manufacturerDetailNumber
                        : '...'}
                    </Text>
                  </Text>
                  <Text style={IndexStyle.BottomTitle}>
                    Дата:{' '}
                    <Text style={{color: 'white'}}>
                      {enityData.date ? enityData.date : '...'}
                    </Text>
                  </Text>
                  <Text style={IndexStyle.BottomTitle}>
                    Маса пустого корпусу без стакану (кг):{' '}
                    <Text style={[IndexStyle.TitleGreen, {color: 'white'}]}>
                      {enityData.weightEemptyBodyWithoutGlass
                        ? enityData.weightEemptyBodyWithoutGlass
                        : '...'}
                    </Text>
                  </Text>
                  <Text style={IndexStyle.BottomTitle}>
                    Маса повного корпусу без стакану (кг):{' '}
                    <Text style={[IndexStyle.TitleGreen, {color: 'white'}]}>
                      {enityData.totalBodyWeight
                        ? enityData.totalBodyWeight
                        : '...'}
                    </Text>
                  </Text>
                  <Text style={IndexStyle.BottomTitle}>
                    Маса корпусу з водою (кг):{' '}
                    <Text style={[IndexStyle.TitleGreen, {color: 'white'}]}>
                      {enityData.bodyWeightWithWater
                        ? enityData.bodyWeightWithWater
                        : '...'}
                    </Text>
                  </Text>
                  <Text style={IndexStyle.BottomTitle}>
                    Маса води (кг):{' '}
                    <Text style={[IndexStyle.TitleGreen, {color: 'white'}]}>
                      {enityData.weightWater ? enityData.weightWater : '...'}
                    </Text>
                  </Text>
                  <Text style={IndexStyle.BottomTitle}>
                    V камори (см³):{' '}
                    <Text style={[IndexStyle.TitleGreen, {color: 'white'}]}>
                      {enityData.chamberV ? enityData.chamberV : '...'}
                    </Text>
                  </Text>
                  <Text style={IndexStyle.BottomTitle}>
                    Маса ВР (кг):{' '}
                    <Text style={[IndexStyle.TitleGreen, {color: 'white'}]}>
                      {enityData.vVWeight ? enityData.vVWeight : '...'}
                    </Text>
                  </Text>
                  <Text style={IndexStyle.BottomTitle}>
                    Плотність ВР (гр/см³):{' '}
                    <Text style={[IndexStyle.TitleGreen, {color: 'white'}]}>
                      {enityData.densityVV ? enityData.densityVV : '...'}
                    </Text>
                  </Text>
                  <Text style={IndexStyle.BottomTitle}>
                    Глибина гнізда у корпусі (мм):{' '}
                    <Text style={[IndexStyle.TitleGreen, {color: 'white'}]}>
                      {enityData.caseDepth ? enityData.caseDepth : '...'}
                    </Text>
                  </Text>
                  <Text style={IndexStyle.BottomTitle}>
                    Глибина гнізда у стакані (мм):{' '}
                    <Text style={[IndexStyle.TitleGreen, {color: 'white'}]}>
                      {enityData.cupDepth ? enityData.cupDepth : '...'}
                    </Text>
                  </Text>
                  <Text style={IndexStyle.BottomTitle}>
                    Маса ДД (гр):{' '}
                    <Text style={[IndexStyle.TitleGreen, {color: 'white'}]}>
                      {enityData.ddWeight ? enityData.ddWeight : '...'}
                    </Text>
                  </Text>
                  <Text style={IndexStyle.BottomTitle}>
                  Маса корпусу зі стаканом (кг):{' '}
                    <Text style={[IndexStyle.TitleGreen, {color: 'white'}]}>
                      {enityData.curbWeight ? enityData.curbWeight : '...'}
                    </Text>
                  </Text>
                  <Text style={IndexStyle.BottomTitle}>
                    Ваговий знак:{' '}
                    <Text style={[IndexStyle.TitleGreen, {color: 'white'}]}>
                      {enityData.weightSign ? enityData.weightSign : '...'}
                    </Text>
                  </Text>
                  <Text style={IndexStyle.BottomTitle}>
                    {PROJECTILE_AND_MINE_TITLES.STATE}:
                    {enityData.state ? (
                      <Text style={IndexStyle.TitleGreen}>
                        {' '}
                        {MAIN_TITLES.STATE_TRUE}
                      </Text>
                    ) : (
                      <Text style={IndexStyle.TitleRed}>
                        {' '}
                        {MAIN_TITLES.STATE_FALSE}
                      </Text>
                    )}
                  </Text>
                </View>
              </View>
              <View style={IndexStyle.Br} />
              <View style={IndexStyle.Br} />
              <Button
                color="#BB86FC"
                title="Назад"
                onPress={() => {
                  navigation.replace(ROUTES.Main);
                }}
              />
            </>
          ) : null}
        </ScrollView>
      </View>
    </>
  );
};

export default ProductDeatils122;
