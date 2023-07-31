/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-catch-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  Switch,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {IndexStyle} from '../../../../public/styles/index.style';
import {useNavigation} from '@react-navigation/native';
import {getLoginFromLocalStorage} from '../../../infrastucture/local-storage/login-local-storage';
import {addRecordToDatabase} from '../../../infrastucture/domain-requests/server-request';
import {URLS} from '../../../const/urls';
import {editRecord} from '../../../infrastucture/domain-requests/edit-data';
import {styles} from '../../../../styles';
import {URL_PARAMS} from '../../../const/url-params';
import {MAIN_TITLES} from '../../../const/titles-main';
import {PROJECTILE_AND_MINE_TITLES} from '../const/projectile-and-mine-titles';
import {ServerErrorsMessage} from '../../../infrastucture/messages/server-error-message';
import {RouteProps} from '../interface/route-interface';
import {ROUTES} from '../../../const/routes';

const EliminationOfDefect: React.FC<RouteProps> = ({route}) => {
  const {barcodeData} = route.params;
  const navigation = useNavigation();

  const batch = barcodeData.substring(9, 11);
  const batchYear = barcodeData.substring(11, 13);
  const mqttError = null;
  const detailNumber = barcodeData.substring(13);

  const [error, setError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [login, setLogin] = useState('');
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
  const [state, setState] = useState(true);

  const submitForm = async () => {
    try {
      const requestEditData = {
        serverUrl: URLS.SERVER_URL,
        urlParam: URL_PARAMS.DB_EDIT_STATE,
        state: String(state),
        detailNumber: detailNumber,
        batch: batch,
        batchYear: batchYear,
        checkGlassThread: String(checkGlassThread),
        checkConditionStabilizerWings: String(checkConditionStabilizerWings),
        checkStabilizerTubeDiameter: String(checkStabilizerTubeDiameter),
        checkStabilizerTubeGluten: String(checkStabilizerTubeGluten),
        checkStabilizerWingBeating: String(checkStabilizerWingBeating),
        checkAlignment: String(checkAlignment),
        stabilizerWingBeatControl: String(stabilizerWingBeatСontrol),
        //operationType: 0,
      };

      await editRecord(requestEditData);

      const requestDataUserOperation = {
        serverUrl: URLS.SERVER_URL,
        urlParam: URL_PARAMS.ADD_USER_OPARATION,
        detailNumber: detailNumber,
        user: login,
        operationType: 0,
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
      case 'stabilizerWingBeatСontrol':
        setStabilizerWingBeatСontrol(value);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setState(
      checkGlassThread &&
        checkStabilizerWingBeating &&
        checkStabilizerTubeDiameter &&
        checkConditionStabilizerWings &&
        checkStabilizerTubeGluten &&
        checkAlignment
        ? true
        : false,
    );
    // eslint-disable-next-line no-sparse-arrays
  }, [
    ,
    checkGlassThread,
    checkStabilizerWingBeating,
    checkStabilizerTubeDiameter,
    checkConditionStabilizerWings,
    checkStabilizerTubeGluten,
    checkAlignment,
  ]);

  useEffect(() => {
    const loadLoginFromLocalStorage = async () => {
      const loginFromLocalStorage = await getLoginFromLocalStorage();
      setLogin(loginFromLocalStorage);
    };
    loadLoginFromLocalStorage();
  }, []);

  return (
    <>
      <View style={[styles.container, {marginTop: -20}]}>
        {ServerErrorsMessage({showSuccessMessage, error, mqttError})}
        <Text style={IndexStyle.TopTitle}>
          {PROJECTILE_AND_MINE_TITLES.DEFECT_UPDATE}
        </Text>
        <View style={IndexStyle.Br} />
        <View style={styles.detailsContainer}>
          <View style={{margin: 10}}>
            <Text style={IndexStyle.BottomTitle}>
              Вироб:{' '}
              <Text style={[IndexStyle.TitleGreen, {color: 'white'}]}>
                {detailNumber ? detailNumber : '...'}
              </Text>
              ,
            </Text>
            <Text style={IndexStyle.BottomTitle}>
              {PROJECTILE_AND_MINE_TITLES.BATCH}:{' '}
              <Text style={[IndexStyle.TitleGreen, {color: 'white'}]}>
                {batch ? batch : '...'}
              </Text>
              ,
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
          <View style={styles.container}>
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
          </View>
          <View style={IndexStyle.Br} />
        </ScrollView>
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
            handleCheckBoxChange('isWater', true);
            handleCheckBoxChange('stabilizerWingBeatСontrol', true);
          }}
        />
        <View style={IndexStyle.Br} />
        <Button
          color="#BB86FC"
          title={MAIN_TITLES.SAVE}
          onPress={submitForm}
          disabled={detailNumber === '' || batch === ''}
        />
        <View style={IndexStyle.Br} />
      </View>
    </>
  );
};

export default EliminationOfDefect;
