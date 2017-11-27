import React, { Component } from 'react';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';

import IllustList from '../../components/IllustList';
import * as rankingActionCreators from '../../common/actions/ranking';
import { makeGetRankingItems } from '../../common/selectors';

class RankingList extends Component {
  componentDidMount() {
    const {
      rankingMode,
      options,
      fetchRanking,
      clearRanking,
      ranking: { timestamp },
      items,
    } = this.props;
    InteractionManager.runAfterInteractions(() => {
      if (
        items.length < 1 ||
        moment(timestamp).add(1, 'days').isBefore(moment())
      ) {
        clearRanking(rankingMode);
        fetchRanking(rankingMode, options);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { options: prevOptions } = this.props;
    const { options, rankingMode, fetchRanking, clearRanking } = nextProps;
    if (
      options &&
      (options.mode !== prevOptions.mode || options.date !== prevOptions.date)
    ) {
      InteractionManager.runAfterInteractions(() => {
        clearRanking(rankingMode);
        fetchRanking(rankingMode, options);
      });
    }
  }

  loadMoreItems = () => {
    const {
      ranking: { nextUrl, loading },
      rankingMode,
      options,
      fetchRanking,
    } = this.props;
    if (!loading && nextUrl) {
      fetchRanking(rankingMode, options, nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { rankingMode, fetchRanking, clearRanking } = this.props;
    clearRanking(rankingMode);
    fetchRanking(rankingMode, null, null, true);
  };

  render() {
    const { ranking, items, listKey } = this.props;
    return (
      <IllustList
        data={{ ...ranking, items }}
        listKey={listKey}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(() => {
  const getRankingItems = makeGetRankingItems();
  return (state, props) => {
    const { ranking } = state;
    return {
      ranking: ranking[props.rankingMode],
      items: getRankingItems(state, props).filter(item => !!item),
      listKey: `${props.navigation.state.key}-${props.rankingMode}`,
    };
  };
}, rankingActionCreators)(RankingList);
