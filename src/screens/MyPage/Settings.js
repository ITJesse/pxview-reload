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
import TouchID from 'react-native-touch-id';
import { connect } from 'react-redux';

import { connectLocalization } from '../../components/Localization';
import { globalStyleVariables } from '../../styles';
import { SCREENS } from '../../common/constants';
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
      isTouchIDUsable: false,
    };
  }

  componentWillMount() {
    TouchID.isSupported()
      .then(() => {
        console.log('TouchID usable');
        this.setState({ isTouchIDUsable: true });
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleOnPressListItem = item => {
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
        Alert.alert(
          i18n.cacheClearConfirmation,
          null,
          [
            { text: i18n.cancel, style: 'cancel' },
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

  handleOnSwitchListItem = () => {
    const { useTouchID, setUseTouchID, i18n } = this.props;
    if (useTouchID) {
      setUseTouchID(false);
      return;
    }
    TouchID.authenticate(i18n.useTouchIDLoginDescription)
      .then(() => {
        // Success code
        console.log('User authenticated with TouchID');
        setUseTouchID(true);
      })
      .catch(error => {
        // Failure code
        switch (error.name) {
          case 'LAErrorTouchIDNotAvailable':
            DeviceEventEmitter.emit('showToast', i18n.touchIDNotAvailable);
            break;
          case 'LAErrorTouchIDNotEnrolled':
            DeviceEventEmitter.emit('showToast', i18n.touchIDNotEnrolled);
            break;
          case 'RCTTouchIDUnknownError':
            DeviceEventEmitter.emit('showToast', i18n.touchIDUnknownError);
            break;
          case 'RCTTouchIDNotSupported':
            DeviceEventEmitter.emit('showToast', i18n.touchIDHasLocked);
            break;
          case 'LAErrorUserCancel':
          case 'LAErrorUserFallback':
            break;
          default:
            DeviceEventEmitter.emit('showToast', i18n.touchIDNotAvailable);
            break;
        }
        setUseTouchID(false);
      });
  };

  handleOnPressConfirmClearCache = () => {
    const { i18n } = this.props;
    RNFetchBlob.fs
      .unlink(`${RNFetchBlob.fs.dirs.CacheDir}/pxview/`)
      .then(() => {
        DeviceEventEmitter.emit('showToast', i18n.cacheClearSuccess);
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
          onSwitch={() => this.handleOnSwitchListItem()}
          switchDisabled={!this.state.isTouchIDUsable}
          switchButton
          hideChevron
        />
        {/* <ListItem
          key="touchIdAutoLockTime"
          title={i18n.touchIdAutoLockTime}
          onPress={() => this.handleOnPressListItem('touchIdAutoLockTime')}
          containerStyle={styles.listItem}
        /> */}
      </List>
    );
  };

  render() {
    return (
      <View style={styles.container}>
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
