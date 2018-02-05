import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import RNFetchBlob from 'react-native-fetch-blob';
import { unzip } from 'react-native-zip-archive';
import moment from 'moment';

import UgoiraView from './UgoiraView';
import PXCacheImage from './PXCacheImage';
import Loader from './Loader';
import OverlayPlayIcon from './OverlayPlayIcon';
import * as ugoiraMetaActionCreators from '../common/actions/ugoiraMeta';
import { globalStyleVariables } from '../styles';

const CACHE_TIMEOUT = 30; // days

const styles = StyleSheet.create({
  imageContainer: {
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
  },
});

class UgoiraViewTouchable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ugoiraPath: null,
      zipPath: null,
      isDownloadingZip: false,
      isStartPlaying: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { ugoiraMeta: prevUgoiraMeta } = prevProps;
    const { ugoiraMeta } = this.props;
    if (
      prevUgoiraMeta &&
      ugoiraMeta &&
      ugoiraMeta.loaded &&
      ugoiraMeta.loaded !== prevUgoiraMeta.loaded &&
      ugoiraMeta.item &&
      ugoiraMeta.item.zipUrl &&
      ugoiraMeta.item.frames &&
      ugoiraMeta.item.frames.length
    ) {
      this.downloadZip();
    }
  }

  downloadZip = async () => {
    const {
      item: { id },
      ugoiraMeta,
    } = this.props;
    const { zipUrl } = ugoiraMeta.item;
    try {
      const ugoiraPath = `${RNFetchBlob.fs.dirs.CacheDir}/pxview/ugoira/${id}`;
      const isDir = await RNFetchBlob.fs.isDir(ugoiraPath);
      if (isDir) {
        if (!this.unmounting) {
          this.setState({
            ugoiraPath,
          });
        }
      } else {
        const downloadPath = `${
          RNFetchBlob.fs.dirs.CacheDir
        }/pxview/ugoira_zip/${zipUrl.split('/').pop()}`;

        if (!(await this.checkCache(downloadPath))) {
          this.task = RNFetchBlob.config({
            fileCache: true,
            appendExt: 'zip',
            key: zipUrl,
            path: downloadPath,
          }).fetch('GET', zipUrl, {
            referer: 'http://www.pixiv.net',
          });
          this.setState({
            isDownloadingZip: true,
          });
          try {
            await this.task;
          } catch (err) {
            this.setState({
              isDownloadingZip: false,
            });
          }
        }
        if (!this.unmounting) {
          try {
            const path = await unzip(downloadPath, ugoiraPath);
            this.setState({
              ugoiraPath: path,
              isDownloadingZip: false,
            });
            // remove zip file after extracted
          } catch (err) {
            this.setState({
              isDownloadingZip: false,
            });
          }
        }
      }
    } catch (err) {
      // console.error('failed to call isDir ', err);
    }
  };

  componentWillUnmount() {
    this.unmounting = true;
    if (this.task) {
      this.task.cancel();
    }
  }

  checkCache = async filePath => {
    const exist = await RNFetchBlob.fs.exists(filePath);
    if (exist) {
      const stat = await RNFetchBlob.fs.stat(filePath);
      if (
        moment(stat.lastModified)
          .add(CACHE_TIMEOUT, 'days')
          .isBefore(moment())
      ) {
        return false;
      }
      return true;
    }
    return false;
  };

  fetchUgoiraMetaOrToggleAnimation = () => {
    const { item, ugoiraMeta, fetchUgoiraMeta } = this.props;
    const { ugoiraPath, isStartPlaying } = this.state;
    if (!isStartPlaying) {
      this.setState({
        isStartPlaying: true,
      });
    }
    if (!ugoiraMeta || !ugoiraMeta.loaded) {
      fetchUgoiraMeta(item.id);
    } else {
      const { zipUrl, frames } = ugoiraMeta.item;
      if (ugoiraPath) {
        if (zipUrl && frames && frames.length) {
          this.setState(state => ({
            paused: !state.paused,
          }));
        }
      } else {
        // when ugoiraMeta is cached
        this.downloadZip();
      }
    }
  };

  render() {
    const { item, ugoiraMeta } = this.props;
    const { ugoiraPath, isDownloadingZip, isStartPlaying, paused } = this.state;
    const width =
      item.width > globalStyleVariables.WINDOW_WIDTH()
        ? globalStyleVariables.WINDOW_WIDTH()
        : item.width;
    const height = Math.floor(
      globalStyleVariables.WINDOW_WIDTH() * item.height / item.width,
    );
    return (
      <TouchableWithoutFeedback
        onPress={this.fetchUgoiraMetaOrToggleAnimation}
        disabled={(ugoiraMeta && ugoiraMeta.loading) || isDownloadingZip}
      >
        <View
          style={[
            styles.imageContainer,
            {
              width: globalStyleVariables.WINDOW_WIDTH(),
              height,
            },
          ]}
        >
          {ugoiraPath ? (
            <UgoiraView
              images={ugoiraMeta.item.frames.map(frame => ({
                uri: `${ugoiraPath}/${frame.file}`,
                delay: frame.delay,
              }))}
              paused={paused}
              width={width}
              height={height}
              resizeMode="contain"
            />
          ) : (
            <PXCacheImage
              uri={item.image_urls.medium}
              width={width}
              height={height}
              style={styles.image}
            />
          )}
          {((ugoiraMeta && ugoiraMeta.loading) || isDownloadingZip) && (
            <Loader absolutePosition />
          )}
          {!isStartPlaying && <OverlayPlayIcon />}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default connect((state, props) => {
  const { ugoiraMeta } = state;
  const { item } = props;
  return {
    ugoiraMeta: ugoiraMeta[item.id],
  };
}, ugoiraMetaActionCreators)(UgoiraViewTouchable);
