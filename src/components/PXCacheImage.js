import React, { Component } from 'react';
import { View, Image } from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import { CachedImage, ImageCacheManager } from 'react-native-cached-image';

import { globalStyleVariables } from '../styles';

const CACHE_TIMEOUT = 30; // days

class PXCacheImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      width: null,
      height: null,
    };
    this.imageCacheManager = new ImageCacheManager({
      cacheLocation: `${RNFetchBlob.fs.dirs.CacheDir}/pxview`,
    });
  }

  async componentDidMount() {
    const { uri, noNeedSize } = this.props;
    if (noNeedSize) return;
    const filePath = await this.imageCacheManager.downloadAndCacheUrl(uri, {
      headers: {
        referer: 'http://www.pixiv.net',
      },
    });

    if (filePath && !this.unmounting) {
      this.getSize(filePath);
    }
  }

  getSize(filePath) {
    const { uri, onFoundImageSize } = this.props;
    Image.getSize(
      filePath,
      (width, height) => {
        if (!this.unmounting) {
          this.setState({
            loaded: true,
            width,
            height,
          });
          if (onFoundImageSize) onFoundImageSize(width, height, uri);
        }
      },
      err => console.log(err),
    );
  }

  componentWillUnmount() {
    this.unmounting = true;
  }

  renderImage(props) {
    const { source, style, imageStyle } = props;
    return (
      <Image {...this.props} source={source} style={[style, imageStyle]} />
    );
  }

  renderIllustImage = () => {
    const { uri, style } = this.props;
    return (
      <CachedImage
        source={{
          uri,
          headers: {
            referer: 'http://www.pixiv.net',
          },
        }}
        ttl={CACHE_TIMEOUT * 24 * 60 * 60}
        cacheLocation={`${RNFetchBlob.fs.dirs.CacheDir}/pxview`}
        style={style}
        renderImage={this.renderImage}
      />
    );
  };

  renderDetailImage = () => {
    const { uri, style } = this.props;
    const { loaded, width, height } = this.state;
    return loaded
      ? <View
          style={{
            width: globalStyleVariables.WINDOW_WIDTH(),
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
          }}
        >
          <CachedImage
            source={{
              uri,
              headers: {
                referer: 'http://www.pixiv.net',
              },
            }}
            style={[
              {
                width:
                  width > globalStyleVariables.WINDOW_WIDTH()
                    ? globalStyleVariables.WINDOW_WIDTH()
                    : width,
                height: globalStyleVariables.WINDOW_WIDTH() * height / width,
              },
            ]}
            cacheLocation={`${RNFetchBlob.fs.dirs.CacheDir}/pxview`}
          />
        </View>
      : <View style={[style[1], style[2]]} />;
  };

  render() {
    const { noNeedSize } = this.props;
    return noNeedSize ? this.renderIllustImage() : this.renderDetailImage();
  }
}

export default PXCacheImage;
