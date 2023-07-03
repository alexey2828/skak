import {AsyncStorage} from 'react-native';

export const getLoginFromLocalStorage = async () => {
  try {
    const value = await AsyncStorage.getItem('login');
    return value !== null ? value : '';
  } catch (error) {
    console.error('Error getting login from local storage:', error);
    return '';
  }
};
