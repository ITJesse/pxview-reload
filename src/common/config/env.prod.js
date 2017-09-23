import { Platform } from 'react-native';

export default {
  firebase: {
    apiKey: 'AIzaSyBarMbWzvr_L8zOSUKMcinHlrjGaRQaKss',
    databaseURL: 'https://itjesse54.firebaseio.com',
    projectId: 'itjesse54',
  },
  navigation: {
    tab: Platform.OS === 'ios',
    // drawer: Platform.OS !== 'android'
  },
};
