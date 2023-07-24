/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, Image, Button} from 'react-native';
import HoneywellScanner from 'react-native-honeywell-scanner';
import {useNavigation} from '@react-navigation/native';
import {IndexStyle} from '../../../public/styles/index.style';
import {styles} from '../../../styles';
import getFilteredData from '../domain-requests/get-filtered-data';
import {PROJECTILE_AND_MINE_TITLES} from '../../domains/projectile-and-mine-120/const/projectile-and-mine-titles';
import {colors} from '../../const/colors';
import {ROUTES} from '../../const/routes';
import {filteredDataFromServer, ScreenName} from './types'; // Assuming that we have moved our types to a separate file named 'types.tsx'
import {NumberOfTheBeast} from '../features/number-of-the-beast';

const Main = () => {
  const [filteredData, setFilteredData] = useState<filteredDataFromServer[]>(
    [],
  );
  const [detailNumber, setDetailNumber] = useState('');
  const [batch, setBatch] = useState('');
  const [batchYear, setBatchYear] = useState('');
  const [caliber, setCaliber] = useState('');
  const [productType, setProductType] = useState('');
  const [barcodeData, setBarcodeData] = useState('');
  const [screenName, setScreenName] = useState<ScreenName>('');
  const [operationName, setOperationName] = useState('');
  const [showButton, setShowButton] = useState(false);
  const navigation = useNavigation();

  const fetchData = useCallback(async () => {
    const items = await getFilteredData(detailNumber, batch, batchYear);
    setFilteredData(items as unknown as filteredDataFromServer[]);
  }, [detailNumber, batch, batchYear]);

  const handleOperation = useCallback(
    (operationType: number, state: string | null, routes: ScreenName[]) => {
      if (state == 'false') {
        setScreenName(routes[0]);
        setOperationName('Брак');
      } else {
        setScreenName(routes[operationType]);
        setOperationName(
          PROJECTILE_AND_MINE_TITLES[
            `INCOMING_CONTROL_FORM_${operationType + 1}`
          ] || 'Контроль пройдено',
        );
      }
    },
    [],
  );

  const chooseOperationScreen = useCallback(() => {
    if (filteredData.length > 0) {
      const operationType = Number(filteredData[0].operationType);
      const state = filteredData[0].state;
      let routes = [];
      if (caliber === '3' && productType === '1') {
        routes = [
          ROUTES.EliminationOfDefect,
          ROUTES.TotalBodyWeight,
          ROUTES.DdWeight,
          ROUTES.CurbWeight,
          ROUTES.ProductDeatils,
        ];
      } else if (caliber === '1' && productType === '2') {
        routes = [
          ROUTES.EliminationOfDefect122,
          ROUTES.TotalBodyWeight122,
          ROUTES.DdWeight122,
          ROUTES.CurbWeight122,
          ROUTES.ProductDeatils122,
        ];
      } else {
        setScreenName('WarningView');
        return;
      }
      handleOperation(operationType, state, routes);
    } else {
      const initialRoute =
        caliber == '1' && productType == '2'
          ? ROUTES.IncomingControl122
          : ROUTES.IncomingControl;
      setScreenName(initialRoute);
      setOperationName(PROJECTILE_AND_MINE_TITLES.INCOMING_CONTROL);
    }
  }, [caliber, productType, filteredData, handleOperation]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (barcodeData.length >= 7) {
      setDetailNumber(barcodeData.substring(13));
      setBatch(barcodeData.substring(9, 11));
      setBatchYear(barcodeData.substring(11, 13));
      setCaliber(barcodeData.substring(3, 4));
      setProductType(barcodeData.substring(2, 3));
    }
  }, [barcodeData]);

  useEffect(() => {
    if (detailNumber || filteredData.length > 0) {
      chooseOperationScreen();
    }
  }, [detailNumber, filteredData, barcodeData, chooseOperationScreen]);

  const handleBarcodeReadSuccess = useCallback((event: any) => {
    console.log('Received data', event);
    setBarcodeData(event.data);
  }, []);

  const handleBarcodeReadFail = useCallback(() => {
    console.log('Barcode read failed');
  }, []);

  useEffect(() => {
    HoneywellScanner.startReader().then(claimed => {
      console.log(
        claimed ? 'Barcode reader is claimed' : 'Barcode reader is busy',
      );
    });

    HoneywellScanner.on('barcodeReadSuccess', handleBarcodeReadSuccess);
    HoneywellScanner.on('barcodeReadFail', handleBarcodeReadFail);

    return () => {
      HoneywellScanner.stopReader().then(() => {
        console.log('Freedom!');
      });

      HoneywellScanner.off(
        'barcodeReadSuccess',
        () => handleBarcodeReadSuccess,
      );

      HoneywellScanner.off('barcodeReadFail', handleBarcodeReadFail);
    };
  }, [handleBarcodeReadSuccess, handleBarcodeReadFail]);

  useEffect(() => {
    if (screenName !== '') {
      const timer = setTimeout(() => {
        setShowButton(true);
        console.log(filteredData);
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [screenName, filteredData]);

  const BackgroundImage = () => (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={require('../../../public/images/scan-background.gif')}
        style={{width: 490, height: 550}}
        resizeMode="contain"
      />
    </View>
  );

  const WarningView = () => (
    <View
      style={{
        backgroundColor: colors.gray,
        borderRadius: 10,
        marginTop: 150,
        position: 'relative',
        zIndex: 3,
      }}>
      <View style={{margin: 15}}>
        <View style={IndexStyle.RowFlexCenter}>
          <Image
            source={require('../../../public/images/warningpng.png')}
            style={{width: 25, height: 25, marginTop: 3}}
          />
          <Text style={styles.modalTitle}>Код не дійсний</Text>
        </View>
        <View style={IndexStyle.Br} />
      </View>
    </View>
  );

  const ProcessingView = () => (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.gray,
        borderRadius: 10,
        zIndex: 3,
      }}>
      <View style={{marginLeft: 15, marginTop: 10}}>
        <View style={IndexStyle.RowFlexCenter}>
          <Image
            source={require('../../../public/images/loading.gif')}
            style={{
              width: 40,
              height: 40,
              marginTop: -5,
            }}
            resizeMode="contain"
          />
          <Text style={styles.modalTitle}>Сканування...</Text>
        </View>
      </View>
    </View>
  );

  const FinishedProcessingView = () => (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.gray,
        borderRadius: 10,
        zIndex: 3,
      }}>
      <View style={{margin: 15}}>
        <NumberOfTheBeast barcodeData={barcodeData} />
        <Text style={styles.modalTitle}>Знайдено вироб {detailNumber}</Text>
        <Text style={IndexStyle.BottomTitle}>{operationName}</Text>
        <View style={IndexStyle.Br} />
        <Button
          color="#BB86FC"
          title={'Перейти'}
          onPress={() => {
            if (screenName) {
              navigation.replace(screenName, {
                detailNumber,
                barcodeData,
              });
            }
          }}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: '#000000'}]}>
      <BackgroundImage />
      {screenName === 'WarningView' && <WarningView />}
      {screenName !== '' &&
        screenName !== 'WarningView' &&
        detailNumber &&
        barcodeData &&
        (showButton ? <FinishedProcessingView /> : <ProcessingView />)}
      {barcodeData !== '' && screenName == '' && <WarningView />}
    </View>
  );
};

export default Main;
