import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import IllustList from '../../components/IllustList';
import * as newIllustsActionCreators from '../../common/actions/newIllusts';
import { getNewIllustsItems } from '../../common/selectors';

class NewIllusts extends Component {
  componentDidMount() {
    const {
      fetchNewIllusts,
      clearNewIllusts,
      newIllusts: { timestamp },
      items,
    } = this.props;
    if (
      items.length < 1 ||
      moment(timestamp).add(3, 'hours').isBefore(moment())
    ) {
      clearNewIllusts();
      fetchNewIllusts();
    }
  }

  loadMoreItems = () => {
    const { fetchNewIllusts, newIllusts: { nextUrl, loading } } = this.props;
    if (!loading && nextUrl) {
      fetchNewIllusts(nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { fetchNewIllusts, clearNewIllusts } = this.props;
    clearNewIllusts();
    fetchNewIllusts(null, true);
  };

  render() {
    const { newIllusts, items, listKey } = this.props;
    return (
      <IllustList
        data={{ ...newIllusts, items }}
        listKey={listKey}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect((state, props) => {
  const { newIllusts } = state;
  return {
    newIllusts,
    items: getNewIllustsItems(state),
    listKey: `${props.navigation.state.key}-newUserIllusts`,
  };
}, newIllustsActionCreators)(NewIllusts);
