import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import IllustTagList from '../../components/IllustTagList';
import * as trendingIllustTagsActionCreators from '../../common/actions/trendingIllustTags';
import { getTrendingIllustTagsItems } from '../../common/selectors';

class TrendingIllustTags extends Component {
  componentDidMount() {
    const {
      fetchTrendingIllustTags,
      clearTrendingIllustTags,
      trendingIllustTags: { timestamp },
      items,
    } = this.props;
    if (
      items.length < 1 ||
      moment(timestamp)
        .add(1, 'days')
        .isBefore(moment())
    ) {
      clearTrendingIllustTags();
      fetchTrendingIllustTags();
    }
  }

  handleOnRefresh = () => {
    const { fetchTrendingIllustTags, clearTrendingIllustTags } = this.props;
    clearTrendingIllustTags();
    fetchTrendingIllustTags(null, true);
  };

  render() {
    const { trendingIllustTags, items } = this.props;
    if (items.length < 1) {
      return null;
    }
    return (
      <IllustTagList
        data={{ ...trendingIllustTags, items }}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(state => {
  const { trendingIllustTags } = state;
  return {
    trendingIllustTags,
    items: getTrendingIllustTagsItems(state).filter(
      item => !!(item && item.illust),
    ),
  };
}, trendingIllustTagsActionCreators)(TrendingIllustTags);
