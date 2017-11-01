import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { SCREENS } from '../../../common/constants';


const styles = StyleSheet.create({
  container: {
  },
  listItem: {
    height: 49,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const list = [
  {
    id: 'pxviewReload',
    title: 'PxView Reload',
  },
  {
    id: 'pxview',
    title: 'PxView',
  },
  {
    id: 'react',
    title: 'React',
  },
  {
    id: 'reactNative',
    title: 'React Native',
  },
  {
    id: 'redux',
    title: 'Redux',
  },
];

const OpenSourceLicenseList = (props) => {
  const handleOnPressListItem = item => {
    const { navigation: { navigate } } = props;
    navigate(SCREENS.OpenSourceLicense, item);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <List>
          {list.map(item =>
            <ListItem
              key={item.id}
              title={item.title}
              onPress={() => handleOnPressListItem(item)}
              containerStyle={styles.listItem}
            />,
          )}
        </List>
      </ScrollView>
    </View>
  );
}

export default OpenSourceLicenseList;
