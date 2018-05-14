/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */

import React from 'react';
import {
  PermissionsAndroid,
  CameraRoll,
  DeviceEventEmitter,
} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import OpenSettings from 'react-native-open-settings';
import hoistNonReactStatic from 'hoist-non-react-statics';
import Promise from 'bluebird';
import { connectLocalization } from '../Localization';

const enhanceSaveImage = WrappedComponent => {
  class Hoc extends React.Component {
    requestWriteExternalStoragePermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        return granted;
      } catch (err) {
        return null;
      }
    };

    handleOnPressOpenAppSettings = () => {
      OpenSettings.openSettings();
    };

    saveImage = async imageUrls => {
      const { i18n } = this.props;
      this.showToast(
        i18n.formatString(
          imageUrls.length > 1 ? i18n.saveImagesStart : i18n.saveImageStart,
        ),
      );
      const { dirs } = RNFetchBlob.fs;
      const imagesBaseDir = dirs.DocumentDir;
      const imagesDir = `${imagesBaseDir}/pxview`;
      try {
        const imagesDirExists = await RNFetchBlob.fs.isDir(imagesDir);
        if (!imagesDirExists) {
          await RNFetchBlob.fs.mkdir(imagesDir);
        }
      } catch (err) {}
      await Promise.map(
        imageUrls,
        async url => {
          const fileName = url
            .split('/')
            .pop()
            .split('#')[0]
            .split('?')[0];
          try {
            const res = await RNFetchBlob.config({
              path: `${imagesDir}/${fileName}`,
            }).fetch('GET', url, {
              referer: 'http://www.pixiv.net',
            });
            const filePath = res.path();
            try {
              await CameraRoll.saveToCameraRoll(filePath);
              this.showToast(
                i18n.formatString(i18n.saveImageSuccess, fileName),
              );
            } catch (err) {
              this.showToast(i18n.formatString(i18n.saveImageError, fileName));
            }
          } catch (err) {
            this.showToast(i18n.formatString(i18n.saveImageError, fileName));
          }
        },
        { concurrency: 3 },
      );
      return null;
    };

    showToast = message => {
      DeviceEventEmitter.emit('showToast', message);
    };

    render() {
      return <WrappedComponent {...this.props} saveImage={this.saveImage} />;
    }
  }

  hoistNonReactStatic(Hoc, WrappedComponent);

  return connectLocalization(Hoc);
};

export default enhanceSaveImage;
