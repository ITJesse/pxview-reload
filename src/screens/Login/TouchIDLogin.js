import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  View,
  Modal,
  DeviceEventEmitter,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import CookieManager from 'react-native-cookies';
import { Answers } from 'react-native-fabric';
import SplashScreen from 'react-native-splash-screen';

import { PasscodeAuth } from '../../common/helpers/touchid';
import { connectLocalization } from '../../components/Localization';
import * as authActionCreators from '../../common/actions/auth';
import * as modalActionCreators from '../../common/actions/modal';
import * as touchIDActions from '../../common/actions/touchid';
import * as browsingHistoryActionCreators from '../../common/actions/browsingHistory';
import { globalStyleVariables } from '../../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 5,
    paddingTop: 0,
    justifyContent: 'center',
    marginTop: 32,
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
  componentDidMount() {
    SplashScreen.hide();
  }

  handleTouchIDLogin = () => {
    const { i18n, setShouldCheckTouchID } = this.props;
    PasscodeAuth.authenticate(i18n.useTouchIDLoginDescription)
      .then(() => {
        // Success code
        Answers.logLogin('Touch ID', true);
        setShouldCheckTouchID(false);
      })
      .catch(error => {
        // Failure code
        Answers.logLogin('Touch ID', false, { error });
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
    const { i18n, showTouchIDUI } = this.props;
    return (
      <Modal style={styles.container}>
        {showTouchIDUI &&
          <View style={styles.innerContainer}>
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
          </View>}
      </Modal>
    );
  }
}

export default connectLocalization(
  connect(
    (state, props) => ({
      auth: state.auth,
      modal: state.modal,
      useTouchID: state.touchid.useTouchID,
      showTouchIDUI: state.touchid.showTouchIDUI,
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
      ...browsingHistoryActionCreators,
    },
  )(TouchIDLogin),
);
