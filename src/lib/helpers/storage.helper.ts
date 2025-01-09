import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

const storeObjectData = async (value: any, key = 'AG_USER_DATA') => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e: any) {
    Alert.alert('Error', e.message);
  }
};

const storeStringData = async (value: string, key = 'AG_USER_TOKEN') => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e: any) {
    Alert.alert('Error', e.message);
  }
};

const getObjectData = async (key = 'AG_USER_DATA') => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? await JSON.parse(jsonValue) : null;
  } catch (e: any) {
    Alert.alert('Error', e.message);
  }
};

const getStringData = async (key = 'AG_USER_TOKEN') => {
  try {
    const value = await AsyncStorage.getItem(key).then(response => response);
    if (value !== null) {
      return value;
    }
  } catch (e: any) {
    Alert.alert('Error', e.message);
  }
};

export {storeObjectData, storeStringData, getStringData, getObjectData};
