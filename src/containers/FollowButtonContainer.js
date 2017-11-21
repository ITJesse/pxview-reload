import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FollowButton from '../components/FollowButton';
import * as followUserActionCreators from '../common/actions/followUser';
import * as modalActionCreators from '../common/actions/modal';
import { FOLLOWING_TYPES, MODAL_TYPES, SCREENS } from '../common/constants';

class FollowButtonContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFollow: false,
    };
  }

  static propTypes = {
    authUser: PropTypes.object,
    user: PropTypes.object.isRequired,
    followUser: PropTypes.func.isRequired,
    unfollowUser: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired, // need to pass navigation manually, withNavigation will not work in static function
    openModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    authUser: null,
  };

  componentWillReciveProps(nextProps) {
    const { user } = nextProps;
    this.setState({
      isFollow: user.is_followed,
    });
  }

  handleOnPress = () => {
    const { authUser, user, workaround, navigation: { navigate } } = this.props;
    if (!authUser) {
      navigate(SCREENS.Login, {
        onLoginSuccess: () => {
          this.followUser(user.id, FOLLOWING_TYPES.PUBLIC);
        },
      });
    } else if (workaround ? this.state.isFollow : user.is_followed) {
      this.unfollowUser(user.id);
    } else {
      this.followUser(user.id, FOLLOWING_TYPES.PUBLIC);
    }
  };

  handleOnLongPress = () => {
    const { authUser, user, navigation: { navigate }, openModal } = this.props;
    if (!authUser) {
      navigate(SCREENS.Login, {
        onLoginSuccess: () => {
          this.followUser(user.id, FOLLOWING_TYPES.PUBLIC);
        },
      });
    } else {
      openModal(MODAL_TYPES.FOLLOW, {
        userId: user.id,
        isFollow: user.is_followed,
      });
    }
  };

  followUser = (userId, followType) => {
    const { followUser } = this.props;
    followUser(userId, followType);
    this.setState({
      isFollow: true,
    });
  };

  unfollowUser = userId => {
    const { unfollowUser } = this.props;
    unfollowUser(userId);
    this.setState({
      isFollow: false,
    });
  };

  render() {
    const { user, workaround, ...restProps } = this.props;
    return (
      <FollowButton
        isFollow={workaround ? this.state.isFollow : user.is_followed}
        onLongPress={this.handleOnLongPress}
        onPress={this.handleOnPress}
        {...restProps}
      />
    );
  }
}

export default connect(
  state => ({
    authUser: state.auth.user,
  }),
  { ...followUserActionCreators, ...modalActionCreators },
)(FollowButtonContainer);
