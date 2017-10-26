import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

const AnimatableIcon = Animatable.createAnimatableComponent(Icon);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    bottom: 0,
    right: 14,
    position: 'absolute',
    justifyContent: 'center',
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
});

const color = '#aaa';

const OverlayKeychainButton = () =>
  <View style={styles.container}>
    <AnimatableIcon
      name="vpn-key"
      style={{
        color,
      }}
      size={24}
    />
  </View>;

export default OverlayKeychainButton;
