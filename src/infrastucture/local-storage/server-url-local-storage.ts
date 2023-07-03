import {AsyncStorage} from 'react-native';

export const getServerUrlFromLocalStorage = async () => {
  try {
    const value = await AsyncStorage.getItem('serverUrl');
    return value !== null ? value : '';
  } catch (error) {
    console.error('Error getting serverUrl from local storage:', error);
    return '';
  }
};
