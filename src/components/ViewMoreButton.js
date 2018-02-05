import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connectLocalization } from './Localization';
import PXTouchable from './PXTouchable';
import { globalStyleVariables } from '../styles';

const containerStyle = () => ({
  width: globalStyleVariables.WINDOW_WIDTH(),
  flex: 1,
  alignSelf: 'center',
});

const styles = StyleSheet.create({
  viewMoreContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  chevronIcon: {
    marginLeft: 5,
  },
});

const ViewMoreButton = ({ i18n, onPress }) => (
  <View style={containerStyle()}>
    <PXTouchable onPress={onPress}>
      <View style={styles.viewMoreContainer}>
        <Text>{i18n.viewMore}</Text>
        <Icon name="chevron-down" style={styles.chevronIcon} />
      </View>
    </PXTouchable>
  </View>
);

export default connectLocalization(ViewMoreButton);
