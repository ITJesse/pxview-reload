import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import IllustList from '../../components/IllustList';
import * as newMangasActionCreators from '../../common/actions/newMangas';
import { getNewMangasItems } from '../../common/selectors';

class NewMangas extends Component {
  componentDidMount() {
    const {
      fetchNewMangas,
      clearNewMangas,
      newMangas: { timestamp },
      items,
    } = this.props;
    if (
      items.length < 1 ||
      moment(timestamp).add(3, 'hours').isBefore(moment())
    ) {
      clearNewMangas();
      fetchNewMangas();
    }
  }

  loadMoreItems = () => {
    const { fetchNewMangas, newMangas: { loading, nextUrl } } = this.props;
    if (!loading && nextUrl) {
      fetchNewMangas(nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { fetchNewMangas, clearNewMangas } = this.props;
    clearNewMangas();
    fetchNewMangas(null, true);
  };

  render() {
    const { newMangas, items, listKey } = this.props;
    return (
      <IllustList
        data={{ ...newMangas, items }}
        listKey={listKey}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect((state, props) => {
  const { newMangas } = state;
  return {
    newMangas,
    items: getNewMangasItems(state),
    listKey: `${props.navigation.state.key}-newMangas`,
  };
}, newMangasActionCreators)(NewMangas);
