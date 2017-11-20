import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { globalStyleVariables } from '../styles';

const LIST_WINDOW_SIZE = 5;

class PXViewPager extends Component {
  handleViewPagerPageSelected = e => {
    const { onPageSelected } = this.props;
    const contentOffset = e.nativeEvent.contentOffset;
    const viewSize = e.nativeEvent.layoutMeasurement;
    // Divide the horizontal offset by the width of the view to see which page is visible
    const index = Math.round(contentOffset.x / viewSize.width);
    if (index > -1) {
      onPageSelected(index);
    }
  };

  render() {
    const { items, index, renderContent, onEndReached } = this.props;
    return (
      <FlatList
        ref={ref => (this.flatList = ref)}
        data={items}
        keyExtractor={item => item.id}
        renderItem={renderContent}
        scrollEventThrottle={16}
        onMomentumScrollEnd={this.handleViewPagerPageSelected}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        horizontal
        initialScrollIndex={index}
        windowSize={LIST_WINDOW_SIZE}
        initialNumToRender={3}
        pagingEnabled
        debug={false}
        maxToRenderPerBatch={LIST_WINDOW_SIZE}
        getItemLayout={(data, i) => ({
          length: globalStyleVariables.WINDOW_WIDTH(),
          offset: globalStyleVariables.WINDOW_WIDTH() * i,
          index: i,
        })}
      />
    );
  }
}

export default PXViewPager;
