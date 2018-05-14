import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  RefreshControl,
  FlatList,
  DeviceEventEmitter,
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import IllustItem from './IllustItem';
import Loader from './Loader';
import * as bookmarkIllustActionCreators from '../common/actions/bookmarkIllust';
import { globalStyles, globalStyleVariables } from '../styles';
import { SCREENS } from '../common/constants';

const styles = StyleSheet.create({
  footer: {
    marginBottom: 20,
  },
});

class IllustList extends Component {
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { data: { items: prevItems } } = prevProps;
    const { data: { items }, listKey, maxItems } = this.props;
    if (listKey && items !== prevItems) {
      DeviceEventEmitter.emit('masterListUpdate', {
        listKey,
        items: maxItems ? items.slice(0, maxItems) : items,
      });
    }
  }

  renderItem({ item, index }) {
    const { orientation: { illustColumns }, noBookmark } = this.props;
    return (
      <IllustItem
        key={item.id}
        item={item}
        index={index}
        numColumns={illustColumns}
        onPressItem={() => this.handleOnPressItem(item, index)}
        noBookmark={noBookmark}
      />
    );
  }

  renderFooter = () => {
    const { data: { nextUrl, loading } } = this.props;
    return nextUrl && loading
      ? <View style={styles.footer}>
          <Loader />
        </View>
      : null;
  };

  handleOnPressItem = (item, index) => {
    const {
      data: { items },
      navigation: { navigate },
      listKey,
      maxItems,
    } = this.props;
    navigate(SCREENS.Detail, {
      items: maxItems ? items.slice(0, maxItems) : items,
      index,
      parentListKey: listKey,
    });
  };

  handleOnLayout = e => {
    const { onListLayout } = this.props;
    if (onListLayout) {
      onListLayout(e, this.illustList);
    }
  };

  render() {
    const {
      data: { items, loading, loaded, refreshing },
      onRefresh,
      loadMoreItems,
      onScroll,
      showsVerticalScrollIndicator,
      maxItems,
      orientation: { illustColumns },
    } = this.props;

    return (
      <View style={globalStyles.container}>
        {(!items || (!loaded && loading)) && <Loader />}
        {loaded
          ? <FlatList
              onLayout={this.handleOnLayout}
              ref={ref => (this.illustList = ref)} // eslint-disable-line no-return-assign
              data={
                maxItems && (items && items.length)
                  ? items.slice(0, maxItems)
                  : items
              }
              numColumns={illustColumns}
              keyExtractor={item => item.id}
              renderItem={this.renderItem}
              listKey={illustColumns}
              getItemLayout={(data, index) => ({
                length: globalStyleVariables.WINDOW_WIDTH() / illustColumns,
                offset:
                  globalStyleVariables.WINDOW_WIDTH() / illustColumns * index,
                index,
              })}
              removeClippedSubviews={false}
              initialNumToRender={5}
              onEndReachedThreshold={0.5}
              onEndReached={loadMoreItems}
              ListFooterComponent={this.renderFooter}
              onScroll={onScroll}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              showsVerticalScrollIndicator={
                showsVerticalScrollIndicator !== null
                  ? showsVerticalScrollIndicator
                  : true
              }
            />
          : null}
      </View>
    );
  }
}

export default withNavigation(
  connect(state => {
    const { orientation } = state;
    return {
      orientation,
    };
  }, bookmarkIllustActionCreators)(IllustList),
);
