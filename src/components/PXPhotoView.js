import React, { PureComponent } from 'react';
import PhotoView from 'react-native-photo-view';

import { globalStyleVariables } from '../styles';

const photoStyle = () => ({
  width: globalStyleVariables.WINDOW_WIDTH(),
  height: globalStyleVariables.WINDOW_HEIGHT(),
});

class PXPhotoView extends PureComponent {
  handleOnLoad = () => {
    const { onLoad, uri } = this.props;
    onLoad(uri);
  };

  render() {
    const { uri, style, onLoad, ...restProps } = this.props;
    return (
      <PhotoView
        source={{
          uri,
          headers: {
            referer: 'http://www.pixiv.net',
          },
        }}
        minimumZoomScale={1}
        maximumZoomScale={3}
        style={[photoStyle(), style]}
        onLoad={this.handleOnLoad}
        {...restProps}
      />
    );
  }
}

export default PXPhotoView;
