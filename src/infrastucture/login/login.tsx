/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text, Button, TextInput, Image} from 'react-native';
import {IndexStyle} from '../../../public/styles/index.style';
import {useNavigation} from '@react-navigation/native';
import {AsyncStorage} from 'react-native';
import {URLS} from '../../const/urls';
import {URL_PARAMS} from '../../const/url-params';
import {styles} from '../../../styles';
import {ROUTES} from '../../const/routes';

const Login = () => {
  const [data, setData] = useState<any[]>([]);
  const [login, setLogin] = useState<null | any>(null);
  const [serverUrl, setServerUrl] = useState(URLS.SERVER_URL);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  console.log(data);
  useEffect(() => {
    fetchData();
    const getLoginFromLocalStorage = async () => {
      try {
        const value = await AsyncStorage.getItem('login');
        if (value !== null) {
          setLogin(value);
        }
      } catch (error) {
        console.error('Error getting login from local storage:', error);
      }
    };
    getLoginFromLocalStorage();

    const getServerUrlFromLocalStorage = async () => {
      try {
        const value = await AsyncStorage.getItem('serverUrl');
        if (value !== null) {
          setServerUrl(value);
        }
      } catch (error) {
        console.error('Error getting login from local storage:', error);
      }
    };
    getServerUrlFromLocalStorage();
  }, []);

  useEffect(() => {
    //saveServerUrlToLocalStorage(serverUrl);
    fetchData();
  }, [serverUrl]);

  const fetchData = async () => {
    try {
      const response = await fetch(URLS.SERVER_URL + URL_PARAMS.DB_USER);
      const json = await response.json();
      setData(json.data);
    } catch (error) {
      console.error(error);
    }
  };

  //const saveServerUrlToLocalStorage = async (value: string) => {
  //  try {
  //    await AsyncStorage.setItem('serverUrl', value);
  //  } catch (error) {
  //    console.error('Error saving login to serverUrl storage:', error);
  //  }
  //};
  //
  const saveLoginToLocalStorage = async (value: string) => {
    try {
      await AsyncStorage.setItem('login', value);
    } catch (error) {
      console.error('Error saving login to local storage:', error);
    }
  };

  const navigation = useNavigation();
  const handleNavigation = () => {
    navigation.navigate(ROUTES.Main);
  };

  const handleLogin = () => {
    const user = data.find(item => item.login === login);
    if (user && user.password === password) {
      saveLoginToLocalStorage(login);
      handleNavigation();
    } else {
      setErrorMessage('Логін, або пароль введені неправильно');
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={[IndexStyle.RowFlexCenter, {marginLeft: -25}]}>
          <Image
            source={{
              uri: 'https://cdn.discordapp.com/attachments/466314747281801228/826045575220559913/unknown.png',
            }}
            style={{width: 30, height: 50, marginTop: 5}}
          />
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                color: '#ffffff',
                fontSize: 35,
                marginLeft: 10,
                fontWeight: 'bold',
              }}>
              С К Я К
            </Text>
          </View>
        </View>
        <View style={IndexStyle.Br} />
        <View style={IndexStyle.Br} />
        <View style={IndexStyle.Br} />
        <TextInput
          keyboardType="numeric"
          style={styles.input}
          value={login}
          onChangeText={setLogin}
          placeholder="Введіть телефон..."
          placeholderTextColor="#ADB0BD"
        />
        <TextInput
          keyboardType="numeric"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Введіть пароль..."
          placeholderTextColor="#ADB0BD"
        />
        <View style={IndexStyle.Br} />
        <Button
          color="#BB86FC"
          title="Увійти"
          disabled={!(login && password)}
          onPress={handleLogin}
        />
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}

        {/*<>
          <TextInput
            style={styles.input}
            onChangeText={text => {
              setServerUrl(text), saveServerUrlToLocalStorage(text);
            }}
            placeholder="url..."
            placeholderTextColor="gray"
          />
          </>*/}
      </View>
    </>
  );
};

export default Login;
