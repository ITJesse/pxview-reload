import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import IllustList from '../../../components/IllustList';
import * as myPrivateBookmarkIllustActionCreators from '../../../common/actions/myPrivateBookmarkIllusts';
import { getMyPrivateBookmarkIllustsItems } from '../../../common/selectors';

class MyPrivateBookmarkIllusts extends Component {
  componentDidMount() {
    const {
      userId,
      tag,
      myPrivateBookmarkIllusts: { items, timestamp },
      fetchMyPrivateBookmarkIllusts,
      clearMyPrivateBookmarkIllusts,
    } = this.props;
    if (
      items.length < 1 ||
      !timestamp ||
      moment(timestamp).add(1, 'days').isBefore(moment())
    ) {
      clearMyPrivateBookmarkIllusts(userId);
      fetchMyPrivateBookmarkIllusts(userId, tag);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { userId: prevUserId, tag: prevTag } = this.props;
    const {
      userId,
      tag,
      fetchMyPrivateBookmarkIllusts,
      clearMyPrivateBookmarkIllusts,
    } = nextProps;
    if (userId !== prevUserId || tag !== prevTag) {
      clearMyPrivateBookmarkIllusts(userId);
      fetchMyPrivateBookmarkIllusts(userId, tag);
    }
  }

  loadMoreItems = () => {
    const {
      myPrivateBookmarkIllusts: { loading, nextUrl },
      tag,
      userId,
      fetchMyPrivateBookmarkIllusts,
    } = this.props;
    if (!loading && nextUrl) {
      fetchMyPrivateBookmarkIllusts(userId, tag, nextUrl);
    }
  };

  handleOnRefresh = () => {
    const {
      userId,
      tag,
      fetchMyPrivateBookmarkIllusts,
      clearMyPrivateBookmarkIllusts,
    } = this.props;
    clearMyPrivateBookmarkIllusts(userId);
    fetchMyPrivateBookmarkIllusts(userId, tag, null, true);
  };

  render() {
    const { myPrivateBookmarkIllusts, items, listKey } = this.props;
    return (
      <IllustList
        data={{ ...myPrivateBookmarkIllusts, items }}
        listKey={listKey}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect((state, props) => {
  const { myPrivateBookmarkIllusts } = state;
  const userId = props.userId || props.navigation.state.params.userId;
  return {
    myPrivateBookmarkIllusts,
    items: getMyPrivateBookmarkIllustsItems(state),
    userId,
    listKey: props.navigation.state.key,
  };
}, myPrivateBookmarkIllustActionCreators)(MyPrivateBookmarkIllusts);
