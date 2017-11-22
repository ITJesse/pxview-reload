import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');
const aspectRatio = height / width;

export default {
  firebase: {
    apiKey: 'AIzaSyBarMbWzvr_L8zOSUKMcinHlrjGaRQaKss',
    databaseURL: 'https://itjesse54.firebaseio.com',
    projectId: 'itjesse54',
  },
  device: aspectRatio > 1.6 ? 'iphone' : 'ipad',
};
