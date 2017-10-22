import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    top: 0,
    right: 0,
    position: 'absolute',
    justifyContent: 'center',
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  text: {
    marginLeft: 3,
    color: '#fff',
    backgroundColor: 'transparent',
  },
});

const OverlayUgoiraIndicator = () =>
  <View style={styles.container}>
    <Icon name="play" color="#fff" />
  </View>;

export default OverlayUgoiraIndicator;
