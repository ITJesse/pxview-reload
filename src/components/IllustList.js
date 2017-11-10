import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  RefreshControl,
  FlatList,
  Platform,
  DeviceEventEmitter,
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import Orientation from 'react-native-orientation';

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
    this.state = {
      orientation: '',
      ILLUST_COLUMNS: 3,
    };
    this.orientationDidChange = this.orientationDidChange.bind(this);
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

  orientationDidChange(orientation) {
    let ILLUST_COLUMNS;
    const width = globalStyleVariables.WINDOW_WIDTH();
    const height = globalStyleVariables.WINDOW_HEIGHT();
    if (orientation === 'PORTRAIT') {
      if (height / width > 1.6) {
        ILLUST_COLUMNS = 3; // iPhone
      } else {
        ILLUST_COLUMNS = 4; // iPad
      }
    } else if (orientation === 'LANDSCAPE') {
      if (height / width > 1.6) {
        ILLUST_COLUMNS = 3; // iPhone
      } else {
        ILLUST_COLUMNS = 5; // iPad
      }
    }
    this.setState({
      orientation,
      ILLUST_COLUMNS,
    });
  }

  componentWillMount() {
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
    Orientation.removeOrientationListener(this.orientationDidChange);
  }

  renderItem = ({ item, index }) =>
    <IllustItem
      key={item.id}
      item={item}
      index={index}
      numColumns={this.state.ILLUST_COLUMNS}
      onPressItem={() => this.handleOnPressItem(item)}
    />;

  renderFooter = () => {
    const { data: { nextUrl, loading } } = this.props;
    return nextUrl && loading
      ? <View style={styles.footer}>
          <Loader />
        </View>
      : null;
  };

  handleOnPressItem = item => {
    const {
      data: { items },
      navigation: { navigate },
      loadMoreItems,
      listKey,
      maxItems,
    } = this.props;
    const index = items.findIndex(i => i.id === item.id);
    navigate(SCREENS.Detail, {
      items: maxItems ? items.slice(0, maxItems) : items,
      index,
      onListEndReached: loadMoreItems,
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
      muteTags,
      muteUsers,
    } = this.props;

    const muteFilter = () => {
      const data =
        maxItems && (items && items.length) ? items.slice(0, maxItems) : items;
      return data.filter(e => {
        const isMute =
          e.tags.some(t => muteTags.items.includes(t.name)) ||
          muteUsers.items.some(m => m === e.user.id);
        return !isMute;
      });
    };

    return (
      <View style={globalStyles.container}>
        {(!items || (!loaded && loading)) && <Loader />}
        {loaded
          ? <FlatList
              onLayout={this.handleOnLayout}
              ref={ref => (this.illustList = ref)}
              data={muteFilter()}
              numColumns={this.state.ILLUST_COLUMNS}
              keyExtractor={item => item.id}
              renderItem={this.renderItem}
              key={this.state.orientation}
              getItemLayout={(data, index) => ({
                length:
                  globalStyleVariables.WINDOW_WIDTH() / this.state.ILLUST_COLUMNS,
                offset:
                  globalStyleVariables.WINDOW_WIDTH() /
                  this.state.ILLUST_COLUMNS *
                  index,
                index,
              })}
              removeClippedSubviews={Platform.OS === 'android'}
              initialNumToRender={5}
              onEndReachedThreshold={0.1}
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
    const { muteTags, muteUsers } = state;
    return {
      muteTags,
      muteUsers,
    };
  }, bookmarkIllustActionCreators)(IllustList),
);
