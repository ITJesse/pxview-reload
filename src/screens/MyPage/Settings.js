import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import RNFetchBlob from 'react-native-fetch-blob';
import { connect } from 'react-redux';
import RNExitApp from 'react-native-exit-app';
import Spinner from 'react-native-loading-spinner-overlay';

import { connectLocalization } from '../../components/Localization';
import { globalStyleVariables } from '../../styles';
import { SCREENS } from '../../common/constants';
import { PasscodeAuth } from '../../common/helpers/touchid';
import * as touchIDActions from '../../common/actions/touchid';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
  },
  listItem: {
    height: 49,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const settingsList = [
  {
    id: 'accountSettings',
    title: 'accountSettings',
  },
  {
    id: 'tagHighlightSettings',
    title: 'tagHighlightSettings',
  },
  {
    id: 'tagMuteSettings',
    title: 'tagMuteSettings',
  },
  {
    id: 'userMuteSettings',
    title: 'userMuteSettings',
  },
  {
    id: 'lang',
    title: 'lang',
  },
  {
    id: 'cacheClear',
    title: 'cacheClear',
    hideChevron: true,
  },
];

const otherList = [
  {
    id: 'about',
    title: 'about',
  },
];

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  formatFileSize = size => {
    if (size < 1024) {
      return `${size}B`;
    } else if (size < 1024 ** 2) {
      return `${Math.ceil(size / 1024)}KB`;
    } else if (size < 1024 ** 3) {
      return `${Math.ceil(size / 1024 / 1024)}MB`;
    }
    return `${Math.ceil(size / 1024 / 1024 / 1024)}GB`;
  };

  handleOnPressListItem = async item => {
    const { navigation: { navigate }, i18n } = this.props;
    switch (item.id) {
      case 'accountSettings': {
        navigate(SCREENS.AccountSettings, {
          hideAdvanceSettings: true,
        });
        break;
      }
      case 'tagHighlightSettings': {
        navigate(SCREENS.HighlightTagsSettings);
        break;
      }
      case 'tagMuteSettings': {
        navigate(SCREENS.MuteTagsSettings);
        break;
      }
      case 'userMuteSettings': {
        navigate(SCREENS.MuteUsersSettings);
        break;
      }
      case 'lang': {
        navigate(SCREENS.Language);
        break;
      }
      case 'about': {
        navigate(SCREENS.About);
        break;
      }
      case 'cacheClear': {
        let size;
        try {
          size = await this.calculateCacheSize();
        } catch (error) {
          await this.setStateAsync({ loading: false });
          return;
        }
        Alert.alert(
          i18n.formatString(
            i18n.cacheClearConfirmation,
            this.formatFileSize(size),
          ),
          null,
          [
            {
              text: i18n.cancel,
              style: 'cancel',
              onPress: () => this.setStateAsync({ loading: false }),
            },
            { text: i18n.ok, onPress: this.handleOnPressConfirmClearCache },
          ],
          { cancelable: false },
        );
        break;
      }
      default:
        break;
    }
  };

  handleCheckPasscode = async () => {
    const { useTouchID, setUseTouchID, i18n } = this.props;
    if (useTouchID) {
      return setUseTouchID(false);
    }
    try {
      await PasscodeAuth.authenticate(i18n.useTouchIDLoginDescription);
    } catch (error) {
      switch (error) {
        case 'LAErrorAuthenticationFailed':
          DeviceEventEmitter.emit('showToast', i18n.touchIdAuthFailed);
          break;
        case 'LAErrorPasscodeNotSet':
        case 'PasscodeAuthNotSet':
          DeviceEventEmitter.emit('showToast', i18n.passcodeNotSet);
          break;
        case 'LAErrorSystemCancel':
        case 'LAErrorUserCancel':
        case 'LAErrorUserFallback':
          break;
        case 'PasscodeAuthNotSupported':
        default:
          DeviceEventEmitter.emit('showToast', i18n.passcodeNotAvailable);
          break;
      }
      return setUseTouchID(false);
    }
    return setUseTouchID(true);
  };

  setStateAsync = state =>
    new Promise(resolve => this.setState(state, resolve));

  delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  calculateCacheSize = async () => {
    await this.setStateAsync({ loading: true });
    const images = await RNFetchBlob.fs.ls(
      `${RNFetchBlob.fs.dirs.CacheDir}/pxview/`,
    );
    let ugoiraZips = [];
    if (
      await RNFetchBlob.fs.exists(
        `${RNFetchBlob.fs.dirs.CacheDir}/pxview/ugoira_zip`,
      )
    ) {
      ugoiraZips = await RNFetchBlob.fs.ls(
        `${RNFetchBlob.fs.dirs.CacheDir}/pxview/ugoira_zip`,
      );
    }
    let ugoiraDirs = [];
    if (
      await RNFetchBlob.fs.exists(
        `${RNFetchBlob.fs.dirs.CacheDir}/pxview/ugoira`,
      )
    ) {
      ugoiraDirs = await RNFetchBlob.fs.ls(
        `${RNFetchBlob.fs.dirs.CacheDir}/pxview/ugoira`,
      );
    }
    const ugoiraTasks = ugoiraDirs.map(dir =>
      RNFetchBlob.fs.ls(`${RNFetchBlob.fs.dirs.CacheDir}/pxview/ugoira/${dir}`),
    );
    const ugoiraDirsFileList = await Promise.all(ugoiraTasks);
    let tasks = [];
    ugoiraDirsFileList.forEach((list, index) => {
      tasks = {
        ...tasks,
        ...list.map(image =>
          RNFetchBlob.fs.stat(
            `${RNFetchBlob.fs.dirs.CacheDir}/pxview/ugoira/${ugoiraDirs[
              index
            ]}/${image}`,
          ),
        ),
      };
    });

    tasks = [
      ...tasks,
      ...images.map(image =>
        RNFetchBlob.fs.stat(`${RNFetchBlob.fs.dirs.CacheDir}/pxview/${image}`),
      ),
      ...ugoiraZips.map(zip =>
        RNFetchBlob.fs.stat(
          `${RNFetchBlob.fs.dirs.CacheDir}/pxview/ugoira_zip/${zip}`,
        ),
      ),
    ];

    const stats = await Promise.all(tasks);
    let size = 0;
    stats.forEach(stat => (size += stat.size)); // eslint-disable-line no-return-assign
    await this.delay(1);
    return size;
  };

  handleOnPressConfirmClearCache = async () => {
    const { i18n } = this.props;
    RNFetchBlob.fs
      .unlink(`${RNFetchBlob.fs.dirs.CacheDir}/pxview/`)
      .then(() => {
        DeviceEventEmitter.emit('showToast', i18n.cacheClearSuccess);
        Alert.alert(
          i18n.exitApp,
          null,
          [{ text: i18n.ok, onPress: RNExitApp.exitApp }],
          { cancelable: false },
        );
      })
      .catch(() => {});
  };

  renderList = list => {
    const { i18n } = this.props;
    return (
      <List>
        {list.map(item =>
          <ListItem
            key={item.id}
            title={i18n[item.title]}
            onPress={() => this.handleOnPressListItem(item)}
            hideChevron={item.hideChevron}
            containerStyle={styles.listItem}
          />,
        )}
      </List>
    );
  };

  renderSwitch = () => {
    const { i18n } = this.props;
    return (
      <List>
        <ListItem
          key="touchIdToggle"
          title={i18n.useTouchID}
          containerStyle={styles.listItem}
          switched={this.props.useTouchID}
          onSwitch={() => this.handleCheckPasscode()}
          switchButton
          hideChevron
        />
      </List>
    );
  };

  render() {
    const { i18n } = this.props;

    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.loading}
          textContent={i18n.calculateCacheSize}
          textStyle={{ color: '#FFF' }}
        />
        {
          <ScrollView style={styles.container}>
            {this.renderList(settingsList)}
            {this.renderSwitch()}
            {this.renderList(otherList)}
          </ScrollView>
        }
      </View>
    );
  }
}

export default connectLocalization(
  connect(
    state => ({
      useTouchID: state.touchid.useTouchID,
    }),
    {
      ...touchIDActions,
    },
  )(Settings),
);
