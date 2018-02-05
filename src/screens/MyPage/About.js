import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { List, ListItem } from 'react-native-elements';
// import AppStoreReview from 'react-native-app-store-review';

import { connectLocalization } from '../../components/Localization';
import { globalStyles } from '../../styles';
import { SCREENS } from '../../common/constants';

const appStoreUrl =
  'itms-apps://itunes.apple.com/us/app/pxview-reload/id1286972382?l=zh&ls=1&mt=8';
// const sourceUrl = 'https://github.com/ITJesse/pxview-reload';

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
  nameContainer: {
    flexDirection: 'row',
  },
  name: {
    fontSize: 20,
  },
  listItem: {
    height: 49,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const list = [
  {
    id: 'contactUs',
    title: 'contactUs',
    icon: 'envelope',
    type: 'font-awesome',
    hideChevron: true,
  },
  {
    id: 'rateApp',
    title: 'rateApp',
    icon: 'star',
    type: 'font-awesome',
    hideChevron: true,
  },
  // {
  //   id: 'sourceCode',
  //   title: 'sourceCode',
  //   subtitle: sourceUrl,
  //   icon: 'github',
  //   type: 'font-awesome',
  //   hideChevron: true,
  // },
  {
    id: 'openSourceLicenses',
    title: 'openSourceLicenses',
    icon: 'legal',
    type: 'font-awesome',
    hideChevron: false,
  },
];

class About extends Component {
  handleOnPressListItem = item => {
    const {
      navigation: { navigate },
    } = this.props;
    switch (item.id) {
      case 'contactUs': {
        this.openUrl('mailto:jesse@itjesse.com?subject=About PxView Reload');
        break;
      }
      case 'rateApp': {
        this.openUrl(appStoreUrl);
        break;
      }
      // case 'sourceCode': {
      //   this.openUrl(sourceUrl);
      //   break;
      // }
      case 'openSourceLicenses': {
        navigate(SCREENS.OpenSourceLicenseList);
        break;
      }
      default:
        break;
    }
  };

  openUrl = url => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          return null;
        }
        return Linking.openURL(url);
      })
      .catch(err => err);
  };

  render() {
    const { i18n } = this.props;
    return (
      <View style={globalStyles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../images/logo.png')} // eslint-disable-line global-require
            style={styles.logo}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>
              PxView Reload v{DeviceInfo.getVersion()}
            </Text>
          </View>
        </View>
        <List>
          {list.map(item => (
            <ListItem
              key={item.id}
              title={i18n.formatString(i18n[item.title], 'App Store')}
              leftIcon={{
                name: item.icon,
                type: item.type,
                style: { width: 30, textAlign: 'center' },
              }}
              onPress={() => this.handleOnPressListItem(item)}
              subtitle={item.subtitle}
              hideChevron={item.hideChevron}
              containerStyle={styles.listItem}
            />
          ))}
        </List>
      </View>
    );
  }
}

export default connectLocalization(About);
