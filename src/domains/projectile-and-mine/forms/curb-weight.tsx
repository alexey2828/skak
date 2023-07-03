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
  Switch,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import {IndexStyle} from '../../../../public/styles/index.style';
import {useNavigation} from '@react-navigation/native';
import {getLoginFromLocalStorage} from '../../../infrastucture/local-storage/login-local-storage';
import {addRecordToDatabase} from '../../../infrastucture/domain-requests/server-request';
import {URLS} from '../../../const/urls';
import {editRecord} from '../../../infrastucture/domain-requests/edit-data';
import {styles} from '../../../../styles';
import {URL_PARAMS} from '../../../const/url-params';
import {useMqtt} from '../../../infrastucture/hooks/use-mqtt';
import getFilteredData from '../../../infrastucture/domain-requests/get-filtered-data';
import {ServerInit} from '../../../const/user-init';
import {ChooseMarkForWeight} from '../../../infrastucture/choose-data/choose-mark-for-weight';
import {PROJECTILE_AND_MINE_TITLES} from '../const/projectile-and-mine-titles';
import {MAIN_TITLES} from '../../../const/titles-main';
import {ServerErrorsMessage} from '../../../infrastucture/messages/server-error-message';
import {RouteProps} from '../interface/route-interface';
import { ROUTES } from '../../../const/routes';

const CurbWeight: React.FC<RouteProps> = ({route}) => {
  const {detailNumber, barcodeData} = route.params;
  const {msgFromServer, mqttError, updateResponse} = useMqtt<any>();
  const jsonFromServer = JSON.parse(msgFromServer);
  const [filteredData, setFilteredData] = useState([]);
  const state = filteredData.map(item => Number(item.state));
  const batch = barcodeData.substring(9, 11);
  const batchYear = barcodeData.substring(11, 13);
  const [error, setError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [login, setLogin] = useState('');
  const [curbWeight, setCurbWeight] = useState<number>(jsonFromServer.M3);
  const [curbWeightFixed, setCurbWeightFixed] = useState<number | null>();
  const [appliedWeightMark, setAppliedWeightMark] = useState(false);
  const [appliedMark, setAppliedMark] = useState(false);
  let weightSign = ChooseMarkForWeight(curbWeightFixed);
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, [detailNumber]);

  const fetchData = async () => {
    const filteredItems = await getFilteredData(detailNumber, batch, batchYear);
    setFilteredData(filteredItems);
  };

  const submitForm = async () => {
    try {
      const requestEditData = {
        serverUrl: URLS.SERVER_URL,
        urlParam: URL_PARAMS.DB_EDIT_CURB_WEIGHT,
        detailNumber: detailNumber,
        curbWeight: curbWeightFixed,
        weightSign: weightSign,
        appliedWeightMark: String(appliedWeightMark),
        appliedMark: String(appliedMark),
        batch: batch,
        batchYear: batchYear,
        operationType: 4,
      };

      await editRecord(requestEditData);
      const requestDataUserOperation = {
        serverUrl: URLS.SERVER_URL,
        urlParam: URL_PARAMS.ADD_USER_OPARATION,
        detailNumber: detailNumber,
        user: login,
        operationType: 4,
      };
      await addRecordToDatabase(requestDataUserOperation);

      setShowSuccessMessage(true);

      setTimeout(() => {
        navigation.replace(ROUTES.Main);
      }, 2000);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const handleSaveConfirmation = () => {
    submitForm();
    // Добавьте здесь код для сохранения вывода модального окна
    setConfirmationModalVisible(false);
  };

  const handleCheckBoxChange = (
    name: string,
    value: boolean | ((prevState: boolean) => boolean),
  ) => {
    switch (name) {
      case 'appliedWeightMark':
        setAppliedWeightMark(value);
        break;
      case 'appliedMark':
        setAppliedMark(value);
        break;
      default:
        break;
    }
  };

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

  useEffect(() => {
    setCurbWeight(jsonFromServer.M3 ? jsonFromServer.M3.toFixed(3) : null);
  }, [jsonFromServer.M3]);

  return (
    <>
      <View style={styles.container}>
        {ServerErrorsMessage({showSuccessMessage, error, mqttError})}
        <Text style={IndexStyle.TopTitle}>
          {PROJECTILE_AND_MINE_TITLES.INCOMING_CONTROL_FORM_4}
        </Text>
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
                  {jsonFromServer.M3 ? jsonFromServer.M3.toFixed(3) : '...'}
                </Text>
              </Text>
            </View>
            <View>
              <TouchableOpacity
                style={[styles.pinButton]}
                onPress={() => {
                  setCurbWeightFixed(
                    jsonFromServer.M3
                      ? jsonFromServer.M3.toFixed(3)
                      : curbWeight,
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
                {detailNumber ? detailNumber : '...'}{' '}
              </Text>
            </Text>
            <Text style={IndexStyle.BottomTitle}>
              {PROJECTILE_AND_MINE_TITLES.STATE}:
              {state ? (
                <Text style={IndexStyle.TitleGreen}> Задовільно</Text>
              ) : (
                <Text style={IndexStyle.TitleRed}> Не задовільно</Text>
              )}
            </Text>
          </View>
        </View>
        <View style={IndexStyle.Br} />
        <Text style={IndexStyle.BottomTitle}>
          {PROJECTILE_AND_MINE_TITLES.CURB_WEIGHT}
          {curbWeightFixed ? ' (зафіксовано)' : null}:
        </Text>
        <View style={IndexStyle.RowFlexCenter}>
          <TextInput
            keyboardType="numeric"
            style={[styles.input, {width: '85%'}]}
            value={curbWeightFixed ? curbWeightFixed : curbWeight}
            onChangeText={text => {
              setCurbWeight(text);
            }}
            placeholder={PROJECTILE_AND_MINE_TITLES.ENTER_CURB_WEIGHT}
            placeholderTextColor="#ADB0BD"
          />
          <TouchableOpacity
            style={[styles.button, {marginTop: 7, marginLeft: 5}]}
            onPress={() => setCurbWeightFixed(null)}>
            <Image
              source={require('../../../../public/images/refresh.jpg')}
              style={{width: 28, height: 28}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <Text style={IndexStyle.BottomTitle}>
          {PROJECTILE_AND_MINE_TITLES.CURB_WEIGHT}:{' '}
          <Text style={IndexStyle.TitleGreen}> {weightSign}</Text>
        </Text>
        <View style={styles.checkboxContainer}>
          <View style={{width: 250}}>
            <Text style={IndexStyle.BottomTitle}>
              {PROJECTILE_AND_MINE_TITLES.APPLIED_WEIGHT_MARK}:{' '}
            </Text>
          </View>
          <Switch
            value={appliedWeightMark}
            onValueChange={value =>
              handleCheckBoxChange('appliedWeightMark', value)
            }
          />
        </View>
        <View style={styles.checkboxContainer}>
          <View style={{width: 250}}>
            <Text style={IndexStyle.BottomTitle}>
              {PROJECTILE_AND_MINE_TITLES.APPLIED_MARK}:{' '}
            </Text>
          </View>
          <Switch
            value={appliedMark}
            onValueChange={value => handleCheckBoxChange('appliedMark', value)}
          />
        </View>

        <View style={IndexStyle.Br} />
        <View style={IndexStyle.Br} />
        <View style={IndexStyle.Br} />
        <Button
          color="#BB86FC"
          title={MAIN_TITLES.SAVE}
          onPress={() => setConfirmationModalVisible(true)}
          disabled={!curbWeightFixed}
        />
      </View>
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

export default CurbWeight;
