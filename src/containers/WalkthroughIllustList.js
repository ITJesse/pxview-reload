/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */

import React, { Component } from 'react';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';

import IllustList from '../components/IllustList';
import * as walkthroughIllustsActionCreators from '../common/actions/walkthroughIllusts';
import { getWalkthroughIllustsItems } from '../common/selectors';

class WalkthroughIllustList extends Component {
  componentDidMount() {
    const {
      fetchWalkthroughIllusts,
      clearWalkthroughIllusts,
      walkthroughIllusts: { timestamp },
      items,
    } = this.props;
    InteractionManager.runAfterInteractions(() => {
      if (
        items.length < 1 ||
        moment(timestamp).add(1, 'days').isBefore(moment())
      ) {
        clearWalkthroughIllusts();
        fetchWalkthroughIllusts();
      }
    });
  }

  render() {
    const { walkthroughIllusts, items, listKey } = this.props;
    return (
      <IllustList
        data={{ ...walkthroughIllusts, items }}
        listKey={listKey}
        onListLayout={this.handleOnListLayout}
        showsVerticalScrollIndicator={false}
      />
    );
  }
}

export default connect((state, props) => {
  const { walkthroughIllusts } = state;
  return {
    walkthroughIllusts,
    items: getWalkthroughIllustsItems(state, props).filter(item => !!item),
    listKey: 'walkthroughIllustList',
  };
}, walkthroughIllustsActionCreators)(WalkthroughIllustList);
