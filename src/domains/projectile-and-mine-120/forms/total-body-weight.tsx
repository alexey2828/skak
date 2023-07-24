/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-catch-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Switch,
  ScrollView,
} from 'react-native';
import {IndexStyle} from '../../../../public/styles/index.style';
import {useNavigation} from '@react-navigation/native';
import {getLoginFromLocalStorage} from '../../../infrastucture/local-storage/login-local-storage';
import {addRecordToDatabase} from '../../../infrastucture/domain-requests/server-request';
import getFilteredData from '../../../infrastucture/domain-requests/get-filtered-data';
import {editRecord} from '../../../infrastucture/domain-requests/edit-data';
import {URLS} from '../../../const/urls';
import {styles} from '../../../../styles';
import {URL_PARAMS} from '../../../const/url-params';
import {ServerInit} from '../../../const/user-init';
import {useMqtt} from '../../../infrastucture/hooks/use-mqtt';
import {MAIN_TITLES} from '../../../const/titles-main';
import {PROJECTILE_AND_MINE_TITLES} from '../const/projectile-and-mine-titles';
import {ServerErrorsMessage} from '../../../infrastucture/messages/server-error-message';
import {RouteProps} from '../interface/route-interface';
import {ROUTES} from '../../../const/routes';
import {ChooseMarkForWeight} from '../../../infrastucture/choose-data/choose-mark-for-weight';

const TotalBodyWeight: React.FC<RouteProps> = ({route}) => {
  const {detailNumber, barcodeData} = route.params;
  const {msgFromServer, mqttError, updateResponse} = useMqtt<any>();
  const jsonFromServer = JSON.parse(msgFromServer);
  const [filteredData, setFilteredData] = useState([]);
  const batch = barcodeData.substring(9, 11);
  const batchYear = barcodeData.substring(11, 13);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [chamberV, setChamberV] = useState(0);
  const [weightEemptyBodyWithoutGlass, setWeightEemptyBodyWithoutGlass] =
    useState(0);
  const [error, setError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [login, setLogin] = useState('');
  const [totalBodyWeight, setTotalBodyWeight] = useState<number | string>(
    jsonFromServer.M2,
  );
  const [totalBodyWeightFixed, setTotalBodyWeightFixed] = useState<
    number | null | string
  >();
  const [vVWeight, setVVWeight] = useState<number | null>(null);
  const [densityVV, setDensityVV] = useState<number | null>(null);
  const [vVWeightFixed, setVVWeightFixed] = useState<number | null>(null);
  const [densityVVFixed, setDensityVVFixed] = useState<number | null>(null);

  const [caseDepth, setCaseDepth] = useState(68);
  const [cupDepth, setCupDepth] = useState(48);
  const [ddWeight, setDdWeight] = useState(44);

  const [curbWeight, setCurbWeight] = useState<number>(jsonFromServer.M2);
  const [curbWeightFixed, setCurbWeightFixed] = useState<number | null>();
  const [appliedWeightMark, setAppliedWeightMark] = useState(false);
  const [appliedMark, setAppliedMark] = useState(false);
  let weightSign = ChooseMarkForWeight(curbWeightFixed);

  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const handleSaveConfirmation = () => {
    submitForm();
    // Добавьте здесь код для сохранения вывода модального окна
    setConfirmationModalVisible(false);
  };

  const fetchData = async () => {
    const filteredItems = await getFilteredData(detailNumber, batch, batchYear);
    setFilteredData(filteredItems);
  };

  const submitForm = async () => {
    try {
      const requestEditData = {
        serverUrl: URLS.SERVER_URL,
        urlParam: URL_PARAMS.DB_EDIT,
        detailNumber: detailNumber,
        densityVV: densityVVFixed && densityVVFixed.toFixed(3),
        vVWeight: vVWeightFixed && vVWeightFixed.toFixed(3),
        totalBodyWeight: totalBodyWeightFixed,

        cupDepth: cupDepth,
        caseDepth: caseDepth,
        ddWeight: ddWeight,

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
    fetchData();
  }, [detailNumber]);

  useEffect(() => {
    const chamberVFromServer = filteredData.map(item => Number(item.chamberV));
    setChamberV(chamberVFromServer[0]);
    const weightEemptyBodyWithoutGlassFromServer = filteredData.map(item =>
      Number(item.weightEemptyBodyWithoutGlass),
    );
    setWeightEemptyBodyWithoutGlass(weightEemptyBodyWithoutGlassFromServer[0]);
  }, [filteredData]);

  useEffect(() => {
    if (totalBodyWeight) {
      const vVWeightCalculate =
        Number(totalBodyWeight) - weightEemptyBodyWithoutGlass;
      setVVWeight(Number(vVWeightCalculate.toFixed(3)));
    }
  }, [weightEemptyBodyWithoutGlass, totalBodyWeight]);

  useEffect(() => {
    if (chamberV && vVWeight) {
      const densityVVCalculate = (Number(vVWeight) * 1000) / chamberV;
      setDensityVV(Number(densityVVCalculate.toFixed(3)));
    }
  }, [totalBodyWeight]);

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
    if (isTotalBodyWeightFocused) {
      setTotalBodyWeightFixed(
        jsonFromServer.M2 ? jsonFromServer.M2.toFixed(3) : null,
      );
    }
  }, [isTotalBodyWeightFocused]);

  useEffect(() => {
    if (isCurbWeightFocused) {
      setCurbWeightFixed(
        jsonFromServer.M2 ? jsonFromServer.M2.toFixed(3) : null,
      );
    }
  }, [isCurbWeightFocused]);

  const [isTotalBodyWeightFocused, setIsTotalBodyWeightFocused] =
    useState(false);
  const [isCurbWeightFocused, setIsCurbWeightFocused] = useState(false);

  console.log(totalBodyWeightFixed);
  return (
    <>
      <View style={styles.container}>
        {ServerErrorsMessage({showSuccessMessage, error, mqttError})}
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
                  {jsonFromServer.M2 ? jsonFromServer.M2.toFixed(3) : '...'}
                </Text>
              </Text>
            </View>
            <View>
            <TouchableOpacity
                style={[styles.pinButton]}
                onPress={() => {
                  if (isTotalBodyWeightFocused) {
                    setTotalBodyWeightFixed(
                      jsonFromServer.M2 ? jsonFromServer.M2.toFixed(3) : null,
                    );
                  } else if (isCurbWeightFocused) {
                    setCurbWeightFixed(
                      jsonFromServer.M2 ? jsonFromServer.M2.toFixed(3) : null,
                    );
                  }
                  !totalBodyWeightFixed && !jsonFromServer.M2
                    ? setTotalBodyWeightFixed(totalBodyWeight)
                    : null;
                  !curbWeightFixed && !jsonFromServer.M2 ? setCurbWeightFixed(curbWeight) : null;
                  setVVWeightFixed(vVWeight);
                  setDensityVVFixed(densityVV);
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
          </View>
        </View>
        <ScrollView>
          <View style={IndexStyle.Br} />
          <View>
            <View
              style={
                isTotalBodyWeightFocused ? styles.focusedTitle : styles.title
              }>
              <Text
                style={IndexStyle.BottomTitle}
                onPress={() => {
                  setIsTotalBodyWeightFocused(true);
                  setIsCurbWeightFocused(false);
                }}>
                {PROJECTILE_AND_MINE_TITLES.TOTAL_BODY_WEIGHT}
                {totalBodyWeightFixed ? ' (зафіксовано)' : null}:
              </Text>

              <View style={IndexStyle.RowFlexCenter}>
                <TextInput
                  keyboardType="numeric"
                  style={[styles.input, {width: '85%'}]}
                  value={
                    totalBodyWeightFixed
                      ? totalBodyWeightFixed
                      : totalBodyWeight
                  }
                  onChangeText={text => {
                    setTotalBodyWeight(text);
                  }}
                  placeholder={
                    PROJECTILE_AND_MINE_TITLES.ENTER_WEIGH_EMPTY_BODY_WITHOUT_GLASS
                  }
                  placeholderTextColor="#ADB0BD"
                />

                <TouchableOpacity
                  style={[styles.button, {marginTop: 7, marginLeft: 5}]}
                  onPress={() => setTotalBodyWeightFixed(null)}>
                  <Image
                    source={require('../../../../public/images/refresh.jpg')}
                    style={{width: 28, height: 28}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={isCurbWeightFocused ? styles.focusedInput : styles.title}>
              <Text
                style={IndexStyle.BottomTitle}
                onPress={() => {
                  setIsCurbWeightFocused(true);
                  setIsTotalBodyWeightFocused(false);
                }}>
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
            </View>
            <Text style={IndexStyle.BottomTitle}>
          {PROJECTILE_AND_MINE_TITLES.CURB_WEIGHT}:{' '}
          <Text style={IndexStyle.TitleGreen}> {weightSign}</Text>
        </Text>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                onPress={() =>
                  handleCheckBoxChange('appliedWeightMark', !appliedWeightMark)
                }>
                <View style={{width: 270}}>
                  <Text style={IndexStyle.BottomTitle}>
                    {PROJECTILE_AND_MINE_TITLES.APPLIED_WEIGHT_MARK}:{' '}
                  </Text>
                </View>
              </TouchableOpacity>
              <Switch
                value={appliedWeightMark}
                onValueChange={value =>
                  handleCheckBoxChange('appliedWeightMark', value)
                }
              />
            </View>
          </View>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              onPress={() => handleCheckBoxChange('appliedMark', !appliedMark)}>
              <View style={{width: 270}}>
                <Text style={IndexStyle.BottomTitle}>
                  {PROJECTILE_AND_MINE_TITLES.APPLIED_MARK}:{' '}
                </Text>
              </View>
            </TouchableOpacity>
            <Switch
              value={appliedMark}
              onValueChange={value =>
                handleCheckBoxChange('appliedMark', value)
              }
            />
          </View>
          <Button
            color="#37393F"
            title="Параметри ДД"
            onPress={() => setModalVisible(true)}
          />
          <View style={IndexStyle.Br} />
          <Button
            color="#BB86FC"
            title="Зберегти"
            onPress={() => setConfirmationModalVisible(true)}
            disabled={!(totalBodyWeightFixed && curbWeightFixed)}
          />
        </ScrollView>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Параметри ДД</Text>
          <View style={IndexStyle.Br} />
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
          <Button
            color="#BB86FC"
            title={MAIN_TITLES.SAVE_AND_BACK}
            onPress={() => setModalVisible(false)}
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

export default TotalBodyWeight;
