import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import UserListContainer from '../../containers/UserListContainer';
import * as recommendedUsersActionCreators from '../../common/actions/recommendedUsers';
import { getRecommendedUsersItems } from '../../common/selectors';

class RecommendedUsers extends Component {
  componentDidMount() {
    const {
      fetchRecommendedUsers,
      clearRecommendedUsers,
      recommendedUsers: { timestamp },
      items,
    } = this.props;
    if (
      items.length < 1 ||
      moment(timestamp).add(1, 'days').isBefore(moment())
    ) {
      clearRecommendedUsers();
      fetchRecommendedUsers();
    }
  }

  loadMoreItems = () => {
    const {
      fetchRecommendedUsers,
      recommendedUsers: { nextUrl, loading },
    } = this.props;
    if (!loading && nextUrl) {
      fetchRecommendedUsers(null, nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { fetchRecommendedUsers, clearRecommendedUsers } = this.props;
    clearRecommendedUsers();
    fetchRecommendedUsers(null, null, true);
  };

  render() {
    const { recommendedUsers, items } = this.props;
    return (
      <UserListContainer
        userList={{ ...recommendedUsers, items }}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(state => {
  const { recommendedUsers } = state;
  const items = getRecommendedUsersItems(state).filter(item => {
    if (!item.user) {
      return false;
    }
    if (item.illusts.length > 0) {
      return !item.illusts.some(illust => !illust);
    }
    return true;
  });
  return {
    recommendedUsers,
    items,
  };
}, recommendedUsersActionCreators)(RecommendedUsers);
