/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text, Image, Button} from 'react-native';
import HoneywellScanner from 'react-native-honeywell-scanner';
import {useNavigation} from '@react-navigation/native';
import {IndexStyle} from '../../../public/styles/index.style';
import {styles} from '../../../styles';
import getFilteredData from '../domain-requests/get-filtered-data';
import {PROJECTILE_AND_MINE_TITLES} from '../../domains/projectile-and-mine/const/projectile-and-mine-titles';
import {colors} from '../../const/colors';
import {ROUTES} from '../../const/routes';

interface filteredDataFromServer {
  appliedMark: null | string;
  appliedWeightMark: null | string;
  batch: null | string;
  batchYear: null | string;
  bodyWeightWithWater: null | string;
  caseDepth: null | string;
  chamberV: null | string;
  checkAlignment: null | string;
  checkConditionStabilizerWings: null | string;
  checkGlassThread: null | string;
  checkStabilizerTubeDiameter: null | string;
  checkStabilizerTubeGluten: null | string;
  checkStabilizerWingBeating: null | string;
  cupDepth: null | string;
  curbWeight: null | string;
  ddWeight: null | string;
  densityVV: null | string;
  detailNumber: null | string;
  id: null | string;
  isWater: null | string;
  operationType: null | string;
  stabilizerWingBeatControl: null | string;
  state: null | string;
  totalBodyWeight: string;
  user: null | string;
  vVWeight: null | string;
  weightEemptyBodyWithoutGlass: null | string;
  weightSign: null | string;
  weightWater: null | string;
}

type ScreenName =
  | ROUTES.EliminationOfDefect
  | ROUTES.TotalBodyWeight
  | ROUTES.DdWeight
  | ROUTES.CurbWeight
  | ROUTES.ProductDeatils
  | ROUTES.IncomingControl
  | '';

const Main = () => {
  const [filteredData, setFilteredData] = useState<filteredDataFromServer[]>(
    [],
  );
  const [detailNumber, setDetailNumber] = useState('');
  const [batch, setBatch] = useState('');
  const [batchYear, setBatchYear] = useState('');
  const [barcodeData, setBarcodeData] = useState('');
  const [screenName, setScreenName] = useState<ScreenName>('');
  const [operationName, setOperationName] = useState('');
  const [showButton, setShowButton] = useState(false);
  const navigation = useNavigation();

  const fetchData = async () => {
    const filteredItems = await getFilteredData(detailNumber, batch, batchYear);
    setFilteredData(filteredItems);
  };

  const chooseOperationScreen = () => {
    if (filteredData.length > 0) {
      const operationType = Number(filteredData[0].operationType);
      const state = filteredData[0].state;
      switch (operationType) {
        case 1:
          if (state == 'false') {
            setScreenName(ROUTES.EliminationOfDefect);
            setOperationName('Брак');
          } else {
            setScreenName(ROUTES.TotalBodyWeight);
            setOperationName(
              PROJECTILE_AND_MINE_TITLES.INCOMING_CONTROL_FORM_2,
            );
          }
          break;
        case 2:
          if (state == 'false') {
            setScreenName(ROUTES.EliminationOfDefect);
            setOperationName('Брак');
          } else {
            setScreenName(ROUTES.DdWeight);
            setOperationName(
              PROJECTILE_AND_MINE_TITLES.INCOMING_CONTROL_FORM_3,
            );
          }
          break;
        case 3:
          if (state == 'false') {
            setScreenName(ROUTES.EliminationOfDefect);
            setOperationName('Брак');
          } else {
            setScreenName(ROUTES.CurbWeight);
            setOperationName(
              PROJECTILE_AND_MINE_TITLES.INCOMING_CONTROL_FORM_4,
            );
          }
          break;
        case 4:
          if (state == 'false') {
            setScreenName(ROUTES.EliminationOfDefect);
            setOperationName('Брак');
          } else {
            setScreenName(ROUTES.ProductDeatils);
            setOperationName('Контроль пройдено');
          }
          break;
        default:
          break;
      }
    } else {
      setScreenName(ROUTES.IncomingControl);
      setOperationName(PROJECTILE_AND_MINE_TITLES.INCOMING_CONTROL);
    }
  };

  useEffect(() => {
    fetchData();
  }, [detailNumber]);

  useEffect(() => {
    if (barcodeData.length >= 7) {
      setDetailNumber(barcodeData.substring(13));
      setBatch(barcodeData.substring(9, 11));
      setBatchYear(barcodeData.substring(11, 13));
    }
  }, [barcodeData]);

  useEffect(() => {
    if (detailNumber || filteredData.length > 0) {
      chooseOperationScreen();
    }
  }, [detailNumber, filteredData, barcodeData]);

  const handleBarcodeReadSuccess = (event: any) => {
    console.log('Received data', event);
    setBarcodeData(event.data);
  };

  const handleBarcodeReadFail = () => {
    console.log('Barcode read failed');
  };

  const handleBarcodeReadSuccessWrapper = (event: any) => {
    handleBarcodeReadSuccess(event);
  };

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

      HoneywellScanner.on(
        'barcodeReadSuccess',
        handleBarcodeReadSuccessWrapper,
      );
      HoneywellScanner.off('barcodeReadFail', handleBarcodeReadFail);
    };
  }, []);

  useEffect(() => {
    if (barcodeData) {
      setDetailNumber(barcodeData.substring(13));
    }
  }, [barcodeData]);

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
  }, [screenName]);

  return (
    <>
      <View style={[styles.container, {backgroundColor: '#000000'}]}>
        {screenName === '' && !detailNumber && !barcodeData && (
          <>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -30,
              }}>
              <Image
                source={require('../../../public/images/scan-background.gif')}
                style={{width: 490, height: 550, position: 'absolute'}}
                resizeMode="contain"
              />
            </View>
          </>
        )}

        {screenName !== '' && detailNumber && barcodeData && (
          <>
            {showButton ? (
              <>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 200,
                  }}>
                  <Image
                    source={require('../../../public/images/scan-background.gif')}
                    style={{width: 490, height: 550, position: 'absolute'}}
                    resizeMode="contain"
                  />
                </View>
                <View
                  style={{
                    backgroundColor: colors.gray,
                    borderRadius: 10,
                    marginTop: 100,
                    position: 'relative',
                    zIndex: 3,
                  }}>
                  <View style={{margin: 15}}>
                    <Text style={styles.modalTitle}>
                      Знайдено вироб {detailNumber}
                    </Text>
                    <Text style={IndexStyle.BottomTitle}>
                      Перейти на етап виробництва: {operationName}
                    </Text>
                    <View style={IndexStyle.Br} />
                    {/*<Text style={IndexStyle.BottomTitle}>{screenName}</Text>*/}
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
              </>
            ) : (
              <>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 200,
                  }}>
                  <Image
                    source={require('../../../public/images/scan-background.gif')}
                    style={{width: 490, height: 550, position: 'absolute'}}
                    resizeMode="contain"
                  />
                </View>
                <View
                  style={{
                    backgroundColor: colors.gray,
                    borderRadius: 10,
                    marginTop: 100,
                    position: 'relative',
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

                      {/*<Text style={IndexStyle.BottomTitle}>{screenName}</Text>*/}
                    </View>
                  </View>
                </View>
              </>
            )}
          </>
        )}
      </View>
    </>
  );
};

export default Main;
