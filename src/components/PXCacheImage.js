import React, { Component } from 'react';
import { View, Image } from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import moment from 'moment';

import { globalStyleVariables } from '../styles';

const CACHE_TIMEOUT = 30; // days

class PXCacheImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUri: null,
      loaded: false,
    };
  }

  async componentDidMount() {
    const { uri, onFoundImageSize, noNeedSize } = this.props;
    const filePath = await this.downloadImage(uri);

    if (!this.unmounting && filePath) {
      // const base64Str = `data:image/png;base64,${res.base64()}`;
      let size = {
        width: null,
        height: null,
      };
      if (!noNeedSize) {
        try {
          size = await this.getImageSize(filePath);
        } catch (error) {
          return null;
        }
        if (onFoundImageSize) {
          onFoundImageSize(size.width, size.height, filePath);
        }
      }
      if (!this.unmounting) {
        this.setImageState(filePath, size);
      }
    }
    return null;
  }

  setImageState(filePath, size) {
    this.setState({
      imageUri: filePath,
      loaded: true,
      ...size,
    });
  }

  getImageSize = filePath =>
    new Promise((resolve, reject) => {
      Image.getSize(
        filePath,
        (width, height) => {
          resolve({
            width,
            height,
          });
        },
        reject,
      );
    });

  downloadImage = async uri => {
    let filePath = `${RNFetchBlob.fs.dirs.CacheDir}/pxview/${uri
      .split('/')
      .pop()}`;
    if (!await this.checkCache(filePath)) {
      let res;
      try {
        this.task = RNFetchBlob.config({
          fileCache: true,
          appendExt: 'png',
          key: uri,
          path: `${RNFetchBlob.fs.dirs.CacheDir}/pxview/${uri
            .split('/')
            .pop()}`,
        }).fetch('GET', uri, {
          referer: 'http://www.pixiv.net',
          // 'Cache-Control' : 'no-store'
        });
        res = await this.task;
      } catch (error) {
        return null;
      }
      filePath = res.path();
    }
    return filePath;
  };

  checkCache = async filePath => {
    const exist = await RNFetchBlob.fs.exists(filePath);
    if (exist) {
      const stat = await RNFetchBlob.fs.stat(filePath);
      if (
        moment(stat.lastModified).add(CACHE_TIMEOUT, 'days').isBefore(moment())
      ) {
        return false;
      }
      return true;
    }
    return false;
  };

  componentWillUnmount() {
    this.unmounting = true;
    if (this.task) {
      this.task.cancel();
    }
  }

  renderIllustImage = () => {
    const { style, ...otherProps } = this.props;
    const { loaded } = this.state;
    return loaded
      ? <Image
          source={{
            uri: this.state.imageUri,
            headers: {
              referer: 'http://www.pixiv.net',
            },
          }}
          style={style}
          {...otherProps}
        />
      : null;
  };

  renderDetailImage = () => {
    const { uri, style, ...otherProps } = this.props;
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
          <Image
            source={{
              uri: this.state.imageUri,
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
              style,
            ]}
            {...otherProps}
          />
        </View>
      : null;
  };

  render() {
    const { noNeedSize } = this.props;
    return noNeedSize ? this.renderIllustImage() : this.renderDetailImage();
  }
}

export default PXCacheImage;
