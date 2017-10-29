import React from 'react';
import { View } from 'react-native';
import PXImage from './PXImage';
import { globalStyleVariables } from '../styles';

const PXThumbnail = props => {
  const { uri, size, style, ...otherProps } = props;
  return (
    <View
      style={{
        backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
        borderRadius: size / 2,
        overflow: 'hidden',
      }}
    >
      <PXImage
        uri={uri}
        style={[
          {
            resizeMode: 'cover',
            width: size + 4,
            height: size,
            borderRadius: size / 2,
            marginLeft: -2,
            marginTop: -2,
          },
          style,
        ]}
        {...otherProps}
      />
    </View>
  );
};

PXThumbnail.defaultProps = {
  size: 30,
};

export default PXThumbnail;
