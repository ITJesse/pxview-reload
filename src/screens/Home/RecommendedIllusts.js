import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import IllustList from '../../components/IllustList';
import * as recommendedIllustsActionCreators from '../../common/actions/recommendedIllusts';
import { getRecommendedIllustsItems } from '../../common/selectors';

class RecommendedIllusts extends Component {
  componentDidMount() {
    const {
      fetchRecommendedIllusts,
      clearRecommendedIllusts,
      recommendedIllusts: { timestamp },
      items,
    } = this.props;
    if (
      items.length < 1 ||
      moment(timestamp).add(1, 'days').isBefore(moment())
    ) {
      clearRecommendedIllusts();
      fetchRecommendedIllusts();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { user: prevUser } = this.props;
    const { user } = nextProps;
    if ((!user && prevUser) || (user && !prevUser)) {
      const { fetchRecommendedIllusts, clearRecommendedIllusts } = this.props;
      clearRecommendedIllusts();
      fetchRecommendedIllusts();
    }
  }

  loadMoreItems = () => {
    const {
      recommendedIllusts: { nextUrl, loading },
      fetchRecommendedIllusts,
    } = this.props;
    if (!loading && nextUrl) {
      fetchRecommendedIllusts(null, nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { clearRecommendedIllusts, fetchRecommendedIllusts } = this.props;
    clearRecommendedIllusts();
    fetchRecommendedIllusts(null, null, true);
  };

  render() {
    const { recommendedIllusts, items, listKey } = this.props;
    return (
      <IllustList
        data={{ ...recommendedIllusts, items }}
        listKey={listKey}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect((state, props) => {
  const { recommendedIllusts, user } = state;
  return {
    recommendedIllusts,
    items: getRecommendedIllustsItems(state, props).filter(item => !!item),
    user,
    listKey: `${props.navigation.state.key}-recommendedIllusts`,
  };
}, recommendedIllustsActionCreators)(RecommendedIllusts);
