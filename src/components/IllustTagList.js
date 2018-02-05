import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import Loader from './Loader';
import PXTouchable from './PXTouchable';
import PXImage from './PXImage';
import { SEARCH_TYPES, SCREENS } from '../common/constants';
import * as searchHistoryActionCreators from '../common/actions/searchHistory';
import { globalStyles, globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  tag: {
    backgroundColor: 'transparent',
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  imageContainer: {
    marginBottom: 1,
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
  },
  image: {
    resizeMode: 'cover',
  },
});

class IllustTagList extends Component {
  renderItem = (item, itemStyles) => (
    <PXTouchable
      style={[styles.imageContainer, itemStyles.imageContainerStyle]}
      key={item.tag}
      onPress={() => this.handleOnPressItem(item)}
    >
      <View>
        <PXImage
          uri={item.illust.image_urls.square_medium}
          style={[styles.image, itemStyles.imageStyle]}
        />
        <View style={[styles.tagContainer, itemStyles.tagContainerStyle]}>
          <Text style={styles.tag}>{item.tag}</Text>
        </View>
      </View>
    </PXTouchable>
  );

  renderItemPortrait = (item, index) => {
    const { illustColumns } = this.props;
    let imageContainerStyle = {};
    let imageStyle = {};
    let tagContainerStyle = {};
    if (index === 0) {
      const width = globalStyleVariables.WINDOW_WIDTH();
      const height =
        globalStyleVariables.WINDOW_WIDTH() / illustColumns * 1.5 - 1;
      imageContainerStyle = {
        width,
        height,
      };
      imageStyle = {
        width,
        height,
      };
      tagContainerStyle = {
        width,
        height,
      };
    } else {
      const width = globalStyleVariables.WINDOW_WIDTH() / illustColumns - 1;
      const height = globalStyleVariables.WINDOW_WIDTH() / illustColumns - 1;
      imageContainerStyle = {
        marginRight: (index - 1) % illustColumns < illustColumns - 1 ? 1 : 0,
        width,
        height,
      };
      imageStyle = {
        width,
        height,
      };
      tagContainerStyle = {
        height: globalStyleVariables.WINDOW_WIDTH() / illustColumns - 1,
        width: globalStyleVariables.WINDOW_WIDTH() / illustColumns - 1,
      };
    }
    return this.renderItem(item, {
      imageContainerStyle,
      imageStyle,
      tagContainerStyle,
    });
  };

  renderItemLandscape = (item, index) => {
    const { illustColumns } = this.props;
    let imageContainerStyle = {};
    let imageStyle = {};
    let tagContainerStyle = {};
    if (index <= 2) {
      const width = globalStyleVariables.WINDOW_WIDTH() / 3 - 1;
      const height = globalStyleVariables.WINDOW_WIDTH() / illustColumns * 1.5;
      imageContainerStyle = {
        width,
        height,
        marginRight: index % illustColumns < illustColumns - 1 ? 1 : 0,
      };
      imageStyle = {
        width,
        height,
      };
      tagContainerStyle = {
        width,
        height,
      };
    } else {
      const width = globalStyleVariables.WINDOW_WIDTH() / illustColumns - 1;
      const height = globalStyleVariables.WINDOW_WIDTH() / illustColumns - 1;
      imageContainerStyle = {
        marginRight: (index - 3) % illustColumns < illustColumns - 1 ? 1 : 0,
        width,
        height,
      };
      imageStyle = {
        width,
        height,
      };
      tagContainerStyle = {
        height: globalStyleVariables.WINDOW_WIDTH() / illustColumns - 1,
        width: globalStyleVariables.WINDOW_WIDTH() / illustColumns - 1,
      };
    }
    return this.renderItem(item, {
      imageContainerStyle,
      imageStyle,
      tagContainerStyle,
    });
  };

  handleOnPressItem = item => {
    const {
      addSearchHistory,
      navigation: { navigate },
    } = this.props;
    addSearchHistory(item.tag);
    navigate(SCREENS.SearchResult, {
      word: item.tag,
      searchType: SEARCH_TYPES.ILLUST,
    });
  };

  render() {
    const {
      data: { items, loading, loaded, refreshing },
      onRefresh,
      orientation,
    } = this.props;
    return (
      <View style={globalStyles.container}>
        {(!items || (!loaded && loading)) && <Loader />}
        {items && items.length ? (
          <ScrollView
            contentContainerStyle={styles.contentContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {orientation === 'PORTRAIT'
              ? items.map(this.renderItemPortrait)
              : items.map(this.renderItemLandscape)}
          </ScrollView>
        ) : null}
      </View>
    );
  }
}

export default withNavigation(
  connect(
    state => ({
      orientation: state.orientation.orientation,
      illustColumns: state.orientation.illustColumns,
    }),
    searchHistoryActionCreators,
  )(IllustTagList),
);
