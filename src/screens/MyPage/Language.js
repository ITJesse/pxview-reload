import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { connect } from 'react-redux';
import { List, ListItem } from 'react-native-elements';
import RNExitApp from 'react-native-exit-app';

import { connectLocalization } from '../../components/Localization';
import * as i18nActionCreators from '../../common/actions/i18n';
import { globalStyleVariables } from '../../styles';

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

const languageList = [
  {
    id: 'en',
    title: 'English',
  },
  {
    id: 'ja',
    title: '日本語',
  },
  {
    id: 'zh',
    ids: ['zh', 'zh-CN', 'zh-SG'],
    title: '中文(简体)',
    multipleId: true,
  },
  {
    id: 'zh-TW',
    ids: ['zh-TW', 'zh-HK', 'zh-MO'],
    title: '中文(繁體)',
    multipleId: true,
  },
];

class Settings extends Component {
  handleOnPressListItem = id => {
    const { setLanguage, i18n, lang } = this.props;
    if (id === lang) return;
    setLanguage(id);
    Alert.alert(
      i18n.exitApp,
      null,
      [{ text: i18n.ok, onPress: RNExitApp.exitApp }],
      { cancelable: false },
    );
  };

  renderList = list => {
    const { lang } = this.props;
    return (
      <List>
        {list.map(item =>
          <ListItem
            key={item.id}
            title={item.title}
            rightIcon={{
              name: 'check',
              type: 'font-awesome',
              color: globalStyleVariables.PRIMARY_COLOR,
            }}
            hideChevron={
              item.multipleId && item.ids
                ? !item.ids.includes(lang)
                : item.id !== lang
            }
            onPress={() => this.handleOnPressListItem(item.id)}
            containerStyle={styles.listItem}
          />,
        )}
      </List>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {
          <ScrollView style={styles.container}>
            {this.renderList(languageList)}
          </ScrollView>
        }
      </View>
    );
  }
}

export default connectLocalization(
  connect(
    state => ({
      lang: state.i18n.lang,
    }),
    i18nActionCreators,
  )(Settings),
);
