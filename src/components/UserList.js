import React, { Component } from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import Loader from '../components/Loader';
import { globalStyleVariables } from '../styles';
import UserPreview from './UserPreview';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
  },
  footer: {
    marginBottom: 20,
  },
});

class UserList extends Component {
  renderItem = ({ item }) => <UserPreview item={item} userId={item.user.id} />;

  renderFooter = () => {
    const {
      userList: { nextUrl },
    } = this.props;
    return nextUrl ? (
      <View style={styles.footer}>
        <Loader />
      </View>
    ) : null;
  };

  render() {
    const {
      userList: { items, loading, loaded, refreshing },
      loadMoreItems,
      onRefresh,
    } = this.props;
    return (
      <View style={styles.container}>
        {!loaded && loading && <Loader />}
        {items && items.length ? (
          <FlatList
            data={items}
            keyExtractor={item => item.user.id}
            renderItem={this.renderItem}
            onEndReachedThreshold={2}
            onEndReached={loadMoreItems}
            ListFooterComponent={this.renderFooter}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : null}
      </View>
    );
  }
}

export default UserList;
