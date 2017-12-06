import React, { PureComponent } from 'react';
import { InteractionManager } from 'react-native';
import PhotoView from 'react-native-photo-view';

import { globalStyleVariables } from '../styles';

const photoStyle = () => ({
  width: globalStyleVariables.WINDOW_WIDTH(),
  height: globalStyleVariables.WINDOW_HEIGHT(),
});

class PXPhotoView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        loaded: true,
      });
    });
  }

  handleOnLoad = () => {
    const { onLoad, uri } = this.props;
    onLoad(uri);
  };

  render() {
    const { uri, style, onLoad, ...restProps } = this.props;
    const { loaded } = this.state;
    return loaded
      ? <PhotoView
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
      : null;
  }
}

export default PXPhotoView;
