import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Text } from 'react-native';
import { withNavigation } from 'react-navigation';

import PXTouchable from '../components/PXTouchable';
import PXThumbnailTouchable from '../components/PXThumbnailTouchable';
import FollowButtonContainer from '../containers/FollowButtonContainer';
import IllustItem from './IllustItem';
import { SCREENS } from '../common/constants';
import { makeGetUserIllustsItems } from '../common/selectors';
import config from '../common/config';
import { globalStyleVariables } from '../styles';

const AVATAR_SIZE = 50;

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  imagePreviews: {
    flex: 1,
    flexDirection: 'row',
  },
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 80,
    marginRight: 5,
    marginVertical: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'absolute',
    left: 10,
    right: 0,
    bottom: 10,
    flex: 1,
    width: AVATAR_SIZE,
  },
});

class UserPreview extends Component {
  handleOnPressImagePreview = (illusts, index) => {
    const { navigate } = this.props.navigation;
    navigate(SCREENS.Detail, { items: illusts, index });
  };

  handleOnPressAvatar = userId => {
    const { navigate } = this.props.navigation;
    navigate(SCREENS.UserDetail, { userId });
  };

  render() {
    const {
      navigation,
      items,
      user,
      orientation: { illustColumns },
    } = this.props;
    return (
      <View key={user.id} style={styles.itemContainer}>
        <View
          style={[
            styles.imagePreviews,
            {
              height: globalStyleVariables.WINDOW_WIDTH() / illustColumns,
            },
          ]}
        >
          {items &&
            items.map((illust, index) =>
              <IllustItem
                key={illust.id}
                item={illust}
                index={index}
                numColumns={illustColumns}
                onPressItem={() => this.handleOnPressImagePreview(items, index)}
              />,
            )}
        </View>
        <View style={styles.userInfoContainer}>
          <PXTouchable
            style={styles.userInfo}
            onPress={() => this.handleOnPressAvatar(user.id)}
          >
            <Text>
              {user.name}
            </Text>
          </PXTouchable>
          <FollowButtonContainer user={user} navigation={navigation} />
        </View>
        <View style={styles.avatarContainer}>
          <PXThumbnailTouchable
            uri={user.profile_image_urls.medium}
            size={AVATAR_SIZE}
            onPress={() => this.handleOnPressAvatar(user.id)}
          />
        </View>
      </View>
    );
  }
}

export default withNavigation(
  connect((state, props) => {
    const { orientation } = state;
    const { item: { user, illusts } } = props;
    if (config.device === 'ipad') {
      const getUserIllustsItems = makeGetUserIllustsItems();
      return {
        user: props.item.user,
        items: getUserIllustsItems(state, props),
        orientation,
      };
    }
    return {
      items: illusts,
      user,
      orientation,
    };
  }, null)(UserPreview),
);
