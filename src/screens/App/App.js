import React, { Component } from 'react';
import { View, StyleSheet, DeviceEventEmitter, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { MessageBar, MessageBarManager } from 'react-native-message-bar';
import Toast, { DURATION } from 'react-native-easy-toast';
import PrivacySnapshot from 'react-native-privacy-snapshot';
import Orientation from 'react-native-orientation';
import { Answers } from 'react-native-fabric';

import AppNavigator from '../../navigations/AppNavigator';
import LoginNavigator from '../../navigations/LoginNavigator';
import TouchIDNavigator from '../../navigations/TouchIDNavigator';
import { connectLocalization } from '../../components/Localization';
import Loader from '../../components/Loader';
import ModalRoot from '../../containers/ModalRoot';
import * as routeActionCreators from '../../common/actions/route';
import * as touchIDActions from '../../common/actions/touchid';
import * as orientationActions from '../../common/actions/orientation';
import { globalStyleVariables } from '../../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.orientationDidChange = this.orientationDidChange.bind(this);
  }

  componentDidMount() {
    MessageBarManager.registerMessageBar(this.messageBarAlert);
    this.showToastListener = DeviceEventEmitter.addListener(
      'showToast',
      text => {
        this.toast.show(text, DURATION.LENGTH_LONG);
      },
    );
    const { rehydrated, setShouldCheckTouchID, setShowTouchIDUI } = this.props;
    if (rehydrated) {
      // call when reopen app after exit by back button on android
      setTimeout(SplashScreen.hide, 1000);
    } else {
      setShouldCheckTouchID(true);
      setShowTouchIDUI(true);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { rehydrated: prevRehydrated } = this.props;
    const { rehydrated, useTouchID, shouldCheckTouchID } = nextProps;
    if (!prevRehydrated && rehydrated && !(useTouchID && shouldCheckTouchID)) {
      SplashScreen.hide();
    }
  }

  componentWillMount() {
    PrivacySnapshot.enabled(true);
    const initial = Orientation.getInitialOrientation();
    this.orientationDidChange(initial);
    const width = globalStyleVariables.WINDOW_WIDTH();
    const height = globalStyleVariables.WINDOW_HEIGHT();
    if (height / width < 1.6) {
      // iPad
      Orientation.addOrientationListener(this.orientationDidChange);
    }
  }

  componentWillUnmount() {
    MessageBarManager.unregisterMessageBar();
    this.showToastListener.remove();
    PrivacySnapshot.enabled(false);
  }

  orientationDidChange(orientation) {
    const { setOrientation } = this.props;
    setOrientation(orientation);
  }

  handleOnNavigationStateChange = (prevState, newState) => {
    const currentScreen = this.getCurrentRouteName(newState);
    const prevScreen = this.getCurrentRouteName(prevState);

    if (prevScreen !== currentScreen) {
      Answers.logCustom('PageView', { page: currentScreen });
      if (currentScreen === 'Trending' || currentScreen === 'SearchResult') {
        StatusBar.setBarStyle('default', true);
      } else {
        StatusBar.setBarStyle('light-content', true);
      }
    }
  };

  getCurrentRouteName = navigationState => {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return this.getCurrentRouteName(route);
    }
    return route.routeName;
  };

  render() {
    const {
      rehydrated,
      user,
      i18n,
      useTouchID,
      shouldCheckTouchID,
    } = this.props;
    let renderComponent;
    if (!rehydrated) {
      renderComponent = <Loader />;
    } else if (user) {
      renderComponent = (
        <AppNavigator
          onNavigationStateChange={this.handleOnNavigationStateChange}
          screenProps={{ i18n }}
          uriPrefix={/^(?:https?:\/\/)?(?:www|touch)\.pixiv\.net\/|^pixiv:\/\//}
        />
      );
    } else {
      renderComponent = <LoginNavigator screenProps={{ i18n }} />;
    }
    return (
      <View style={styles.container}>
        {useTouchID &&
          shouldCheckTouchID &&
          <TouchIDNavigator screenProps={{ i18n }} />}
        {renderComponent}
        <MessageBar
          ref={ref => (this.messageBarAlert = ref)} // eslint-disable-line no-return-assign
        />
        <Toast
          ref={ref => (this.toast = ref)} // eslint-disable-line no-return-assign
          opacity={0.7}
        />
        <ModalRoot />
      </View>
    );
  }
}

export default connectLocalization(
  connect(
    state => ({
      error: state.error,
      rehydrated: state.auth.rehydrated,
      user: state.auth.user,
      useTouchID: state.touchid.useTouchID,
      shouldCheckTouchID: state.touchid.shouldCheckTouchID,
    }),
    {
      ...routeActionCreators,
      ...touchIDActions,
      ...orientationActions,
    },
  )(App),
);
