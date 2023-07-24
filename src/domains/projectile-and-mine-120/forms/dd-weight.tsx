/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-catch-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text, Button, TouchableOpacity, Modal} from 'react-native';
import {IndexStyle} from '../../../../public/styles/index.style';
import {useNavigation} from '@react-navigation/native';
import {getLoginFromLocalStorage} from '../../../infrastucture/local-storage/login-local-storage';
import {addRecordToDatabase} from '../../../infrastucture/domain-requests/server-request';
import {URLS} from '../../../const/urls';
import getFilteredData from '../../../infrastucture/domain-requests/get-filtered-data';
import {editRecord} from '../../../infrastucture/domain-requests/edit-data';
import {styles} from '../../../../styles';
import {URL_PARAMS} from '../../../const/url-params';
import {PROJECTILE_AND_MINE_TITLES} from '../const/projectile-and-mine-titles';
import {MAIN_TITLES} from '../../../const/titles-main';
import {ServerErrorsMessage} from '../../../infrastucture/messages/server-error-message';
import {RouteProps} from '../interface/route-interface';
import {ROUTES} from '../../../const/routes';

const DdWeight: React.FC<RouteProps> = ({route}) => {
  const {detailNumber, barcodeData} = route.params;
  const [login, setLogin] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const navigation = useNavigation();
  const state = filteredData.map(item => Number(item.state));
  const batch = barcodeData.substring(9, 11);
  const batchYear = barcodeData.substring(11, 13);
  const [error, setError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [checkGlassThread, setCheckGlassThread] = useState(false);
  const [caseDepth, setCaseDepth] = useState(68);
  const [cupDepth, setCupDepth] = useState(48);
  const [ddWeight, setDdWeight] = useState(44);
  const mqttError = null;

  const fetchData = async () => {
    const filteredItems = await getFilteredData(detailNumber, batch, batchYear);
    setFilteredData(filteredItems);
  };

  const handleIncrement = (stateUpdater: {
    (value: React.SetStateAction<number>): void;
    (value: React.SetStateAction<number>): void;
    (value: React.SetStateAction<number>): void;
    (arg0: (prevValue: any) => any): void;
  }) => {
    stateUpdater((prevValue: number) => prevValue + 1);
  };

  const handleDecrement = (stateUpdater: {
    (value: React.SetStateAction<number>): void;
    (value: React.SetStateAction<number>): void;
    (value: React.SetStateAction<number>): void;
    (arg0: (prevValue: any) => number): void;
  }) => {
    stateUpdater((prevValue: number) => prevValue - 1);
  };

  const handleCheckBoxChange = (
    name: string,
    value: boolean | ((prevState: boolean) => boolean),
  ) => {
    switch (name) {
      case 'checkGlassThread':
        setCheckGlassThread(value);
        break;
    }
  };

  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const handleSaveConfirmation = () => {
    submitForm();
    setConfirmationModalVisible(false);
  };

  const submitForm = async () => {
    try {
      const requestEditData = {
        serverUrl: URLS.SERVER_URL,
        urlParam: URL_PARAMS.DB_EDIT_DD_WEIGHT,
        cupDepth: cupDepth,
        caseDepth: caseDepth,
        ddWeight: ddWeight,
        detailNumber: detailNumber,
        batch: batch,
        batchYear: batchYear,
        operationType: 3,
        checkGlassThread: checkGlassThread,
      };

      await editRecord(requestEditData);

      const requestDataUserOperation = {
        serverUrl: URLS.SERVER_URL,
        urlParam: URL_PARAMS.ADD_USER_OPARATION,
        detailNumber: detailNumber,
        user: login,
        operationType: 3,
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

  useEffect(() => {
    fetchData();
  }, [detailNumber]);

  useEffect(() => {
    const loadLoginFromLocalStorage = async () => {
      const loginFromLocalStorage = await getLoginFromLocalStorage();
      setLogin(loginFromLocalStorage);
    };
    loadLoginFromLocalStorage();
  }, []);

  return (
    <>
      <View style={styles.container}>
        {ServerErrorsMessage({showSuccessMessage, error, mqttError})}
        <Text style={IndexStyle.TopTitle}>
          {PROJECTILE_AND_MINE_TITLES.INCOMING_CONTROL_FORM_3}
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
        <View style={styles.checkboxContainer}>
          {/*<View style={{width: 260}}>
            <Text style={IndexStyle.BottomTitle}>
              {PROJECTILE_AND_MINE_TITLES.CHECK_GLASS_THREAD}:{' '}
            </Text>
          </View>
          <Switch
            value={checkGlassThread}
            onValueChange={value =>
              handleCheckBoxChange('checkGlassThread', value)
            }
          />*/}
        </View>
        <View style={IndexStyle.RowFlexCenter}>
          <Text style={IndexStyle.BottomTitle}>
            {PROJECTILE_AND_MINE_TITLES.CASE_DEPTH}:{' '}
          </Text>
        </View>
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleDecrement(setCaseDepth)}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>

          <Text style={[IndexStyle.BottomTitle, {color: 'white'}]}>
            {caseDepth}{' '}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleIncrement(setCaseDepth)}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={IndexStyle.RowFlexCenter}>
          <Text style={IndexStyle.BottomTitle}>
            {PROJECTILE_AND_MINE_TITLES.CUP_DEPTH}:{' '}
          </Text>
        </View>

        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleDecrement(setCupDepth)}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={[IndexStyle.BottomTitle, {color: 'white'}]}>
            {cupDepth}{' '}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleIncrement(setCupDepth)}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={IndexStyle.RowFlexCenter}>
          <Text style={IndexStyle.BottomTitle}>
            {PROJECTILE_AND_MINE_TITLES.DD_WEIGHT}:{' '}
          </Text>
        </View>
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleDecrement(setDdWeight)}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>

          <Text style={[IndexStyle.BottomTitle, {color: 'white'}]}>
            {ddWeight}{' '}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleIncrement(setDdWeight)}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={IndexStyle.Br} />
        <View style={IndexStyle.Br} />
        <View style={IndexStyle.Br} />
        <Button
          color="#BB86FC"
          title={MAIN_TITLES.SAVE}
          onPress={() => setConfirmationModalVisible(true)}
          disabled={detailNumber === ''}
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

export default DdWeight;
