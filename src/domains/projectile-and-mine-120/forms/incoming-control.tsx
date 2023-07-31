/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-catch-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  Modal,
  Switch,
  TouchableOpacity,
  Image,
} from 'react-native';
import {IndexStyle} from '../../../../public/styles/index.style';
import {addRecordToDatabase} from '../../../infrastucture/domain-requests/server-request';
import {getLoginFromLocalStorage} from '../../../infrastucture/local-storage/login-local-storage';
import moment from 'moment-timezone';

import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import {URLS} from '../../../const/urls';
import {styles} from '../../../../styles';
import {weightValidate} from '../../../infrastucture/validate/weight-validate';
import {URL_PARAMS} from '../../../const/url-params';
import {ServerInit} from '../../../const/user-init';
import {useMqtt} from '../../../infrastucture/hooks/use-mqtt';
import {PROJECTILE_AND_MINE_TITLES} from '../const/projectile-and-mine-titles';
import {MAIN_TITLES} from '../../../const/titles-main';
import {ServerErrorsMessage} from '../../../infrastucture/messages/server-error-message';
import {RouteProps} from '../interface/route-interface';
import {ROUTES} from '../../../const/routes';
import getWaterTemperature from '../../../infrastucture/domain-requests/get-water-temperature';

const IncomingControl: React.FC<RouteProps> = ({route}) => {
  const {barcodeData} = route.params;
  const {msgFromServer, mqttError, updateResponse} = useMqtt<any>();
  const jsonFromServer = JSON.parse(msgFromServer);
  //const jsonFromServer = {M1: 13.5};
  const navigation = useNavigation();
  const currentDateTime = moment()
    .tz('Europe/Kiev')
    .format('YYYY-MM-DD HH:mm:ss');
  const manufacturer = barcodeData.substring(0, 2);
  const productType = barcodeData.substring(2, 3);
  const caliber = barcodeData.substring(3, 4);
  const productIndex = barcodeData.substring(4, 5);
  const batchPlace = barcodeData.substring(5, 7);
  const batchPlaceYear = barcodeData.substring(7, 9);
  const batch = barcodeData.substring(9, 11);
  const batchYear = barcodeData.substring(11, 13);
  const detailNumber = barcodeData.substring(13);

  const [error, setError] = useState<any>();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [login, setLogin] = useState('');
  const [waterTemperature, setWaterTemperature] = useState([]);

  const [manufacturerDetailNumber, setManufacturerDetailNumber] = useState('');
  const [checkGlassThread, setCheckGlassThread] = useState(false);
  const [checkStabilizerTubeDiameter, setCheckStabilizerTubeDiameter] =
    useState(false);
  const [checkConditionStabilizerWings, setCheckConditionStabilizerWings] =
    useState(false);
  const [checkStabilizerTubeGluten, setCheckStabilizerTubeGluten] =
    useState(false);
  const [checkStabilizerWingBeating, setCheckStabilizerWingBeating] =
    useState(false);
  const [checkAlignment, setCheckAlignment] = useState(false);
  const [stabilizerWingBeatСontrol, setStabilizerWingBeatСontrol] =
    useState(false);
  const [isWater, setIsWater] = useState(false);
  const [weightEemptyBodyWithoutGlass, setWeightEemptyBodyWithoutGlass] =
    useState<number | string | null>();
  const [
    weightEemptyBodyWithoutGlassFixed,
    setWeightEemptyBodyWithoutGlassFixed,
  ] = useState<number | string | null>();
  const [bodyWeightWithWater, setBodyWeightWithWater] = useState<
    number | null | string
  >();
  const [bodyWeightWithWaterFixed, setBodyWeightWithWaterFixed] = useState<
    number | string | null
  >();
  const [weightWater, setWeightWater] = useState(0);
  const [chamberV, setChamberV] = useState(0);
  const [state, setState] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [secondModalVisible, setSecondModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const handleSaveConfirmation = () => {
    submitForm();
    // Добавьте здесь код для сохранения вывода модального окна
    setConfirmationModalVisible(false);
  };
  const submitForm = async () => {
    try {
      const requestDataToCommonBatch = {
        serverUrl: URLS.SERVER_URL,
        urlParam: URL_PARAMS.DB_ADD_BATCH,
        detailNumber: detailNumber,
        batch: String(batch),
        manufacturer: manufacturer,
        productType: productType,
        caliber: caliber,
        productIndex: productIndex,
        batchPlace: batchPlace,
        batchPlaceYear: batchPlaceYear,
        date: currentDateTime,
      };
      const requestDataToCommon = {
        serverUrl: URLS.SERVER_URL,
        urlParam: URL_PARAMS.DB_ADD,
        checkGlassThread: checkGlassThread,
        checkConditionStabilizerWings: checkConditionStabilizerWings,
        checkStabilizerTubeDiameter: checkStabilizerTubeDiameter,
        checkStabilizerTubeGluten: checkStabilizerTubeGluten,
        checkStabilizerWingBeating: checkStabilizerWingBeating,
        checkAlignment: checkAlignment,
        stabilizerWingBeatСontrol: stabilizerWingBeatСontrol,
        weightEemptyBodyWithoutGlass: weightEemptyBodyWithoutGlassFixed,
        isWater: isWater,
        bodyWeightWithWater: bodyWeightWithWaterFixed,
        chamberV: chamberV.toFixed(3),
        weightWater: weightWater.toFixed(3),
        detailNumber: detailNumber,
        batch: String(batch),
        state: state,
        operationType: 1,
        date: currentDateTime,
        manufacturerDetailNumber: manufacturerDetailNumber,
        batchYear: batchYear,
        caliber: caliber,
        productType: productType,
        waterTemperature: waterTemperature.actualWaterTemperature,
        weightEemptyBodyWithoutGlassValidate: weightValidate(
          Number(weightEemptyBodyWithoutGlassFixed),
          13.15,
          13.85,
        )
          ? weightValidate(
              Number(weightEemptyBodyWithoutGlassFixed),
              13.15,
              13.85,
            )
          : 'У межах норми',
      };

      const requestDataUserOperation = {
        serverUrl: URLS.SERVER_URL,
        urlParam: URL_PARAMS.ADD_USER_OPARATION,
        detailNumber: detailNumber,
        user: login,
        operationType: 1,
      };

      await addRecordToDatabase(requestDataToCommon);
      await addRecordToDatabase(requestDataToCommonBatch);
      await addRecordToDatabase(requestDataUserOperation);

      setShowSuccessMessage(true);

      setTimeout(() => {
        navigation.replace(ROUTES.Main);
      }, 2000);
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  const handleCheckBoxChange = (
    name: string,
    value: boolean | ((prevState: boolean) => boolean),
  ) => {
    switch (name) {
      case 'checkGlassThread':
        setCheckGlassThread(value);
        break;
      case 'checkStabilizerTubeDiameter':
        setCheckStabilizerTubeDiameter(value);
        break;
      case 'checkConditionStabilizerWings':
        setCheckConditionStabilizerWings(value);
        break;
      case 'checkStabilizerTubeGluten':
        setCheckStabilizerTubeGluten(value);
        break;
      case 'checkStabilizerWingBeating':
        setCheckStabilizerWingBeating(value);
        break;
      case 'checkAlignment':
        setCheckAlignment(value);
        break;
      case 'isWater':
        setIsWater(value);
        break;
      case 'stabilizerWingBeatСontrol':
        setStabilizerWingBeatСontrol(value);
        break;
      default:
        break;
    }
  };

  const getWaterTemp = async () => {
    const filteredItems = await getWaterTemperature();
    const filteredWaterTemperature = filteredItems[0];
    setWaterTemperature(filteredWaterTemperature);
  };

  useEffect(() => {
    getWaterTemp();
  }, []);

  useEffect(() => {
    setState(
      checkGlassThread &&
        checkStabilizerWingBeating &&
        checkStabilizerTubeDiameter &&
        checkConditionStabilizerWings &&
        checkStabilizerTubeGluten &&
        checkAlignment &&
        !weightValidate(Number(weightEemptyBodyWithoutGlassFixed), 13.15, 13.85)
        ? true
        : false,
    );
    // eslint-disable-next-line no-sparse-arrays
  }, [
    checkGlassThread,
    checkStabilizerWingBeating,
    checkStabilizerTubeDiameter,
    checkConditionStabilizerWings,
    checkStabilizerTubeGluten,
    checkAlignment,
    weightEemptyBodyWithoutGlassFixed,
  ]);

  useEffect(() => {
    if (bodyWeightWithWaterFixed) {
      const weightWaterCalculate =
        Number(bodyWeightWithWaterFixed) -
        Number(weightEemptyBodyWithoutGlassFixed);
      setWeightWater(weightWaterCalculate);
      setChamberV(
        (weightWaterCalculate * 1000) /
          Number(waterTemperature.actualWaterDensity),
      );
    }
  }, [bodyWeightWithWaterFixed, weightEemptyBodyWithoutGlassFixed]);

  useEffect(() => {
    const loadLoginFromLocalStorage = async () => {
      const loginFromLocalStorage = await getLoginFromLocalStorage();
      setLogin(loginFromLocalStorage);
    };
    loadLoginFromLocalStorage();
  }, []);

  useEffect(() => {
    updateResponse(
      ServerInit.protocol + ServerInit.host + ':' + ServerInit.port,
      '/W/M',
    );
  }, []);

  //useEffect(() => {
  //  setWeightEemptyBodyWithoutGlass(
  //    jsonFromServer.M1 ? jsonFromServer.M1.toFixed(3) : null,
  //  );
  //}, [jsonFromServer.M1]);
  console.log(
    weightValidate(Number(weightEemptyBodyWithoutGlassFixed), 13.15, 13.85),
  );
  return (
    <>
      <View style={[styles.container, {marginTop: -30}]}>
        {ServerErrorsMessage({showSuccessMessage, error, mqttError})}
        <View style={IndexStyle.Br} />
        <View style={IndexStyle.Br} />
        <View style={styles.detailsContainer}>
          <View
            style={{
              margin: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text
                style={[
                  IndexStyle.BottomTitle,
                  {color: 'white', fontSize: 30},
                ]}>
                {PROJECTILE_AND_MINE_TITLES.WEIGHT}:
                <Text
                  style={[
                    IndexStyle.BottomTitle,
                    {color: 'white', fontSize: 30},
                  ]}>
                  {' '}
                  {jsonFromServer.M1 ? jsonFromServer.M1.toFixed(3) : '...'}
                </Text>
              </Text>
            </View>
            <View>
              <TouchableOpacity
                style={[styles.pinButton]}
                onPress={() => {
                  setWeightEemptyBodyWithoutGlassFixed(
                    jsonFromServer.M1
                      ? jsonFromServer.M1.toFixed(3)
                      : weightEemptyBodyWithoutGlass,
                  );
                }}>
                <Image
                  source={require('../../../../public/images/bx-pin.svg.png')}
                  style={{margin: 5, width: 28, height: 28}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
              Калібр: <Text style={{color: 'white'}}>120</Text>
            </Text>
            <Text style={IndexStyle.BottomTitle}>
              {PROJECTILE_AND_MINE_TITLES.BATCH}:{' '}
              <Text style={[IndexStyle.TitleGreen, {color: 'white'}]}>
                {batch ? batch : '...'}
              </Text>
            </Text>
            <Text style={IndexStyle.BottomTitle}>
              {PROJECTILE_AND_MINE_TITLES.STATE}:
              {state ? (
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

        <ScrollView style={{height: 500}}>
          <Text style={IndexStyle.BottomTitle}>
            {PROJECTILE_AND_MINE_TITLES.MANUFACTURER_NUMBER}:
          </Text>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            value={manufacturerDetailNumber.toString()}
            onChangeText={text => setManufacturerDetailNumber(text)}
            placeholder={PROJECTILE_AND_MINE_TITLES.ENTER_MANUFACTURER_NUMBER}
            placeholderTextColor="#ADB0BD"
          />
          <Text style={IndexStyle.BottomTitle}>
            {PROJECTILE_AND_MINE_TITLES.WEIGH_EMPTY_BODY_WITHOUT_GLASS}
            {weightEemptyBodyWithoutGlassFixed ? ' (зафіксовано)' : null}:
          </Text>
          <View style={IndexStyle.RowFlexCenter}>
            <TextInput
              keyboardType="numeric"
              style={[styles.input, {width: '85%'}]}
              value={
                weightEemptyBodyWithoutGlassFixed
                  ? weightEemptyBodyWithoutGlassFixed
                  : weightEemptyBodyWithoutGlass
              }
              onChangeText={text => {
                setWeightEemptyBodyWithoutGlass(text);
              }}
              placeholder={
                PROJECTILE_AND_MINE_TITLES.ENTER_WEIGH_EMPTY_BODY_WITHOUT_GLASS
              }
              placeholderTextColor="#ADB0BD"
            />

            <TouchableOpacity
              style={[styles.button, {marginTop: 7, marginLeft: 5}]}
              onPress={() => setWeightEemptyBodyWithoutGlassFixed(null)}>
              <Image
                source={require('../../../../public/images/refresh.jpg')}
                style={{width: 28, height: 28}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View>
            {weightValidate(
              Number(weightEemptyBodyWithoutGlassFixed),
              13.15,
              13.85,
            ) ? (
              <Text style={IndexStyle.TitleRed}>
                {weightValidate(
                  Number(weightEemptyBodyWithoutGlassFixed),
                  13.15,
                  13.85,
                )}
              </Text>
            ) : null}
          </View>
          {/*
        <Text style={IndexStyle.BottomTitle}>Партія:</Text>
        <TextInput
          style={styles.input}
          value={batch}
          onChangeText={text => setBatch(text)}
          placeholder="Введіть, або проскануйте партію..."
          placeholderTextColor="gray"
        />
        {batch === '' && (
          <Text style={[{fontSize: 2, marginTop: -5}, IndexStyle.TitleRed]}>
            Поле не може бути пустим
          </Text>
        )}*/}
          <View style={IndexStyle.Br} />
          {state ? (
            <Button
              color="#37393F"
              title={PROJECTILE_AND_MINE_TITLES.CHECK + ' (Задовільно)'}
              onPress={() => setModalVisible(true)}
            />
          ) : (
            <Button
              color="#37393F"
              title={PROJECTILE_AND_MINE_TITLES.CHECK + ' (Не задовільно)'}
              onPress={() => setModalVisible(true)}
            />
          )}
          <View style={IndexStyle.Br} />
          {!bodyWeightWithWaterFixed ? (
            <Button
              color="#37393F"
              title={PROJECTILE_AND_MINE_TITLES.WATER}
              onPress={() => setSecondModalVisible(true)}
            />
          ) : (
            <Button
              color="#37393F"
              title={PROJECTILE_AND_MINE_TITLES.WATER + ' (Зафіксовано)'}
              onPress={() => setSecondModalVisible(true)}
            />
          )}
          <View style={IndexStyle.Br} />
          <Button
            color="#BB86FC"
            title={MAIN_TITLES.SAVE}
            onPress={() => setConfirmationModalVisible(true)}
            disabled={
              !weightEemptyBodyWithoutGlassFixed ||
              detailNumber === '' ||
              batch === ''
            }
          />
          <View style={IndexStyle.Br} />
        </ScrollView>
      </View>
      {/*TODO отмечать все сразу по нажатию на 1 кнопку и так же в окне вывода из дефекта*/}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <ScrollView>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {PROJECTILE_AND_MINE_TITLES.CHECK}
            </Text>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                onPress={() =>
                  handleCheckBoxChange('checkGlassThread', !checkGlassThread)
                }>
                <View style={{width: 250}}>
                  <Text style={IndexStyle.BottomTitle}>
                    {PROJECTILE_AND_MINE_TITLES.CHECK_GLASS_THREAD}:{' '}
                  </Text>
                </View>
              </TouchableOpacity>
              <Switch
                value={checkGlassThread}
                onValueChange={value =>
                  handleCheckBoxChange('checkGlassThread', value)
                }
              />
            </View>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                onPress={() =>
                  handleCheckBoxChange(
                    'checkStabilizerTubeDiameter',
                    !checkStabilizerTubeDiameter,
                  )
                }>
                <View style={{width: 250}}>
                  <Text style={IndexStyle.BottomTitle}>
                    {PROJECTILE_AND_MINE_TITLES.CHECK_STABILIZER_TUBE_DIAMETER}:{' '}
                  </Text>
                </View>
              </TouchableOpacity>
              <Switch
                value={checkStabilizerTubeDiameter}
                onValueChange={value =>
                  handleCheckBoxChange('checkStabilizerTubeDiameter', value)
                }
              />
            </View>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                onPress={() =>
                  handleCheckBoxChange(
                    'checkConditionStabilizerWings',
                    !checkConditionStabilizerWings,
                  )
                }>
                <View style={{width: 250}}>
                  <Text style={IndexStyle.BottomTitle}>
                    {
                      PROJECTILE_AND_MINE_TITLES.CHECK_CONDITION_STABILIZER_WINGS
                    }
                    :{' '}
                  </Text>
                </View>
              </TouchableOpacity>
              <Switch
                value={checkConditionStabilizerWings}
                onValueChange={value =>
                  handleCheckBoxChange('checkConditionStabilizerWings', value)
                }
              />
            </View>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                onPress={() =>
                  handleCheckBoxChange(
                    'checkStabilizerTubeGluten',
                    !checkStabilizerTubeGluten,
                  )
                }>
                <View style={{width: 250}}>
                  <Text style={IndexStyle.BottomTitle}>
                    {PROJECTILE_AND_MINE_TITLES.CHECK_STABILIZER_TUBE_GLUTEN}:{' '}
                  </Text>
                </View>
              </TouchableOpacity>
              <Switch
                value={checkStabilizerTubeGluten}
                onValueChange={value =>
                  handleCheckBoxChange('checkStabilizerTubeGluten', value)
                }
              />
            </View>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                onPress={() =>
                  handleCheckBoxChange(
                    'checkStabilizerWingBeating',
                    !checkStabilizerWingBeating,
                  )
                }>
                <View style={{width: 250}}>
                  <Text style={IndexStyle.BottomTitle}>
                    {PROJECTILE_AND_MINE_TITLES.STABILIZER_WINGS_BEAT_CONTROL}:{' '}
                  </Text>
                </View>
              </TouchableOpacity>
              <Switch
                value={checkStabilizerWingBeating}
                onValueChange={value =>
                  handleCheckBoxChange('checkStabilizerWingBeating', value)
                }
              />
            </View>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                onPress={() =>
                  handleCheckBoxChange('checkAlignment', !checkAlignment)
                }>
                <View style={{width: 250}}>
                  <Text style={IndexStyle.BottomTitle}>
                    {PROJECTILE_AND_MINE_TITLES.CHECK_ALIGNMENT}:{' '}
                  </Text>
                </View>
              </TouchableOpacity>
              <Switch
                value={checkAlignment}
                onValueChange={value =>
                  handleCheckBoxChange('checkAlignment', value)
                }
              />
            </View>
            {/*<View style={styles.checkboxContainer}>
            <View style={{width: 250}}>
              <Text style={IndexStyle.BottomTitle}>
                {PROJECTILE_AND_MINE_TITLES.STABILIZER_WINGS_BEAT_CONTROL}:{' '}
              </Text>
            </View>
            <Switch
              value={stabilizerWingBeatСontrol}
              onValueChange={value =>
                handleCheckBoxChange('stabilizerWingBeatСontrol', value)
              }
            />
          </View>*/}
            <View style={IndexStyle.Br} />
            <View style={IndexStyle.Br} />
            <Button
              color="#BB86FC"
              title="Вибрати все"
              onPress={() => {
                handleCheckBoxChange('checkGlassThread', true);
                handleCheckBoxChange('checkStabilizerTubeDiameter', true);
                handleCheckBoxChange('checkConditionStabilizerWings', true);
                handleCheckBoxChange('checkStabilizerTubeGluten', true);
                handleCheckBoxChange('checkStabilizerWingBeating', true);
                handleCheckBoxChange('checkAlignment', true);
                handleCheckBoxChange('stabilizerWingBeatСontrol', true);
              }}
            />
            <View style={IndexStyle.Br} />
            <Button
              color="#BB86FC"
              title={MAIN_TITLES.SAVE_AND_BACK}
              onPress={() => setModalVisible(false)}
            />
          </View>
        </ScrollView>
      </Modal>

      <Modal
        visible={secondModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSecondModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {PROJECTILE_AND_MINE_TITLES.WATER}
          </Text>
          <View style={styles.detailsContainer}>
            <View
              style={{
                margin: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View>
                <Text
                  style={[
                    IndexStyle.BottomTitle,
                    {color: 'white', fontSize: 30},
                  ]}>
                  {PROJECTILE_AND_MINE_TITLES.WEIGHT}:
                  <Text
                    style={[
                      IndexStyle.BottomTitle,
                      {color: 'white', fontSize: 30},
                    ]}>
                    {' '}
                    {jsonFromServer.M1 ? jsonFromServer.M1.toFixed(3) : '...'}
                  </Text>
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  style={[styles.pinButton]}
                  onPress={() => {
                    setBodyWeightWithWaterFixed(
                      jsonFromServer.M1
                        ? jsonFromServer.M1.toFixed(3)
                        : bodyWeightWithWater,
                    );
                  }}>
                  <Image
                    source={require('../../../../public/images/bx-pin.svg.png')}
                    style={{margin: 5, width: 28, height: 28}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={IndexStyle.Br} />
          <Text style={IndexStyle.BottomTitle}>
            Температура води:{' '}
            <Text style={{color: 'white'}}>
              {waterTemperature.actualWaterTemperature}°C
            </Text>
          </Text>
          <Text style={IndexStyle.BottomTitle}>
            {PROJECTILE_AND_MINE_TITLES.BODY_WEIGHT_WITH_WATER}
            {bodyWeightWithWaterFixed ? ' (зафіксовано)' : null}:
          </Text>

          <View style={IndexStyle.RowFlexCenter}>
            <TextInput
              keyboardType="numeric"
              style={[styles.input, {width: '85%'}]}
              value={
                bodyWeightWithWaterFixed
                  ? bodyWeightWithWaterFixed
                  : bodyWeightWithWater
              }
              onChangeText={text => setBodyWeightWithWater(text)}
              placeholder={
                PROJECTILE_AND_MINE_TITLES.ENTER_BODY_WEIGHT_WITH_WATER
              }
              placeholderTextColor="#ADB0BD"
            />
            <TouchableOpacity
              style={[styles.button, {marginTop: 7, marginLeft: 5}]}
              onPress={() => setBodyWeightWithWaterFixed(null)}>
              <Image
                source={require('../../../../public/images/refresh.jpg')}
                style={{width: 28, height: 28}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View style={IndexStyle.Br} />
          <Button
            color="#BB86FC"
            title={MAIN_TITLES.SAVE_AND_BACK}
            onPress={() => setSecondModalVisible(false)}
          />
        </View>
      </Modal>
      <Modal
        visible={confirmationModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setConfirmationModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={{}}>
            <Text style={styles.modalTitle}>Підтвердження дії</Text>
            <Text style={IndexStyle.BottomTitle}>
              Зберегти у систему: {PROJECTILE_AND_MINE_TITLES.INCOMING_CONTROL}{' '}
              виробу {detailNumber}?
            </Text>
            <View style={IndexStyle.Br} />
            <View style={IndexStyle.RowFlexEnd}>
              <Button
                color="#323232"
                title="Назад"
                onPress={() => setConfirmationModalVisible(false)}
              />
              <Button
                color="#BB86FC"
                title="Зберегти"
                onPress={handleSaveConfirmation}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default IncomingControl;
