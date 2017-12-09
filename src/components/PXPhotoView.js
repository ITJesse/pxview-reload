import React, { PureComponent } from 'react';
import { InteractionManager } from 'react-native';
import PhotoView from 'react-native-photo-view';
import RNFetchBlob from 'react-native-fetch-blob';
import { ImageCacheManager } from 'react-native-cached-image';

import { globalStyleVariables } from '../styles';

const photoStyle = () => ({
  width: globalStyleVariables.WINDOW_WIDTH(),
  height: globalStyleVariables.WINDOW_HEIGHT(),
});

class PXPhotoView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filePath: null,
      loaded: false,
    };
    this.imageCacheManager = new ImageCacheManager({
      cacheLocation: `${RNFetchBlob.fs.dirs.CacheDir}/pxview`,
    });
  }

  async componentDidMount() {
    const { uri } = this.props;
    this.imageCacheManager
      .downloadAndCacheUrl(uri, {
        headers: {
          referer: 'http://www.pixiv.net',
        },
      })
      .then(filePath => this.setState({ filePath }))
      .catch(err => console.log(err));
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
    const { loaded, filePath } = this.state;
    return loaded && filePath
      ? <PhotoView
          source={{
            uri: filePath,
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
