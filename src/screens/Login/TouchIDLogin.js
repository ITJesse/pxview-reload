import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  DeviceEventEmitter,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import TouchID from 'react-native-touch-id';
import CookieManager from 'react-native-cookies';

import { connectLocalization } from '../../components/Localization';
import * as authActionCreators from '../../common/actions/auth';
import * as modalActionCreators from '../../common/actions/modal';
import * as touchIDActions from '../../common/actions/touchid';
import { globalStyleVariables } from '../../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    paddingHorizontal: 5,
    paddingTop: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    margin: 15,
    paddingBottom: 15,
  },
  buttonContainer: {
    marginTop: 15,
  },
  outlineButtonContainer: {
    borderColor: globalStyleVariables.PRIMARY_COLOR,
    borderWidth: 1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
});

class TouchIDLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeout: false,
    };
    this.timer = null;
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.setState({ timeout: true });
    }, 1500);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleTouchIDLogin = () => {
    const { i18n, setShouldCheckTouchID } = this.props;
    TouchID.authenticate(i18n.useTouchIDLoginDescription)
      .then(() => {
        // Success code
        setShouldCheckTouchID(false);
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
          case 'LAErrorUserFallback':
            this.handleOnPressLogout();
            break;
          case 'RCTTouchIDNotSupported':
            DeviceEventEmitter.emit('showToast', i18n.touchIDHasLocked);
            break;
          case 'LAErrorUserCancel':
            break;
          default:
            DeviceEventEmitter.emit('showToast', i18n.touchIDNotAvailable);
            break;
        }
      });
  };

  handleOnPressLogout = () => {
    const { auth: { user }, i18n } = this.props;
    if (user.isProvisionalAccount) {
      Alert.alert(
        i18n.logoutConfirmNoRegisterTitle,
        i18n.logoutConfirmNoRegisterDescription,
        [
          { text: i18n.cancel, style: 'cancel' },
          {
            text: i18n.commentRequireAccountRegistrationAction,
            onPress: this.handleOnPressRegisterAccount,
          },
          {
            text: i18n.logout,
            style: 'destructive',
            onPress: this.handleOnPressConfirmLogout,
          },
        ],
        { cancelable: false },
      );
    } else {
      Alert.alert(
        i18n.logoutConfirm,
        null,
        [
          { text: i18n.cancel, style: 'cancel' },
          {
            text: i18n.logout,
            style: 'destructive',
            onPress: this.handleOnPressConfirmLogout,
          },
        ],
        { cancelable: false },
      );
    }
  };

  handleOnPressConfirmLogout = () => {
    const { clearBrowsingHistory, logout } = this.props;
    logout();
    clearBrowsingHistory();
    // clear cookies set from webview for advance account settings
    CookieManager.clearAll();
  };

  render() {
    const { i18n } = this.props;
    return (
      <View style={styles.container}>
        {this.state.timeout &&
          <View style={styles.innerContainer}>
            <KeyboardAvoidingView behavior="padding">
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../images/logo.png')} // eslint-disable-line global-require
                  style={styles.logo}
                />
              </View>
              <View style={styles.formContainer}>
                <Button
                  title={i18n.touchIDLogin}
                  containerViewStyle={styles.buttonContainer}
                  backgroundColor={globalStyleVariables.PRIMARY_COLOR}
                  raised
                  onPress={this.handleTouchIDLogin}
                />
                <Button
                  title={i18n.logout}
                  containerViewStyle={styles.buttonContainer}
                  backgroundColor={globalStyleVariables.PRIMARY_COLOR}
                  raised
                  onPress={this.handleOnPressLogout}
                />
              </View>
            </KeyboardAvoidingView>
          </View>}
      </View>
    );
  }
}

export default connectLocalization(
  connect(
    (state, props) => ({
      auth: state.auth,
      modal: state.modal,
      useTouchID: state.touchid.useTouchID,
      onLoginSuccess:
        props.onLoginSuccess ||
        (props.navigation.state &&
          props.navigation.state.params &&
          props.navigation.state.params.onLoginSuccess),
    }),
    {
      ...authActionCreators,
      ...modalActionCreators,
      ...touchIDActions,
    },
  )(TouchIDLogin),
);