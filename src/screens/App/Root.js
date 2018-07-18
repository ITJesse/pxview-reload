/* eslint react/prefer-stateless-function:0 */
import React, { Component } from 'react';
import { AppRegistry, StatusBar, NativeModules } from 'react-native';
import { Provider } from 'react-redux';
import RNRestart from 'react-native-restart';
import { setJSExceptionHandler } from 'react-native-exception-handler';
import App from './App';
import { LocalizationProvider } from '../../components/Localization';
import i18n from '../../common/helpers/i18n';
import configureStore from '../../common/store/configureStore';
import configureStoreRollback from '../../common/store/configureStoreRollback';
// GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

const { GYBootingProtection } = NativeModules;
let store = configureStore();

if (process.env.NODE_ENV === 'production') {
  // eslint-disable-line no-undef
  [
    'assert',
    'clear',
    'count',
    'debug',
    'dir',
    'dirxml',
    'error',
    'exception',
    'group',
    'groupCollapsed',
    'groupEnd',
    'info',
    'log',
    'profile',
    'profileEnd',
    'table',
    'time',
    'timeEnd',
    'timeStamp',
    'trace',
    'warn',
  ].forEach(methodName => {
    // eslint-disable-next-line no-console
    console[methodName] = () => {};
  });
}

// console.disableYellowBox = true;

class Root extends Component {
  constructor(props) {
    super(props);
    StatusBar.setBarStyle('light-content', true);
  }

  render() {
    return (
      <Provider store={store}>
        <LocalizationProvider i18n={i18n}>
          <App />
        </LocalizationProvider>
      </Provider>
    );
  }
}

// GYBootingProtection.crashCount(count => {
//   if (count > 2) {
//     store = configureStoreRollback();
//     GYBootingProtection.resetCrashCount();
//     setTimeout(() => RNRestart.Restart(), 2000);
//   }
// });

// setJSExceptionHandler((e, isFatal) => {
//   if (isFatal) {
//     store = configureStoreRollback();
//     GYBootingProtection.resetCrashCount();
//     setTimeout(() => RNRestart.Restart(), 2000);
//   }
// }, true);

AppRegistry.registerComponent('PxView', () => Root);
