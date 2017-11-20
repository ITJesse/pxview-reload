import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { globalStyleVariables } from '../styles';

class PXCacheImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    };
  }

  componentDidMount() {
    const { uri, onFoundImageSize } = this.props;
    Image.getSize(
      uri,
      // success
      (width, height) => {
        if (!this.unmounting) {
          this.setState({
            width,
            height,
          });
          if (onFoundImageSize) {
            onFoundImageSize(width, height, uri);
          }
        }
      },
      // failure
      () => {
        console.log('Get size failed');
      },
    );
  }

  componentWillUnmount() {
    this.unmounting = true;
  }

  render() {
    const { uri, style, ...otherProps } = this.props;
    const { width, height } = this.state;
    return width && height
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
              style,
            ]}
            {...otherProps}
          />
        </View>
      : null;
  }
}

export default PXCacheImage;
