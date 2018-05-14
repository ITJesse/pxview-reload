import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Modal,
  Switch,
} from 'react-native';
import { connect } from 'react-redux';
import { connectLocalization } from '../components/Localization';
import PXTouchable from '../components/PXTouchable';
import FollowButton from '../components/FollowButton';
import * as userFollowDetailActionCreators from '../common/actions/userFollowDetail';
import * as followUserActionCreators from '../common/actions/followUser';
import * as modalActionCreators from '../common/actions/modal';
import { FOLLOWING_TYPES } from '../common/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    // borderRadius: 10,
    // alignItems: 'center',
    backgroundColor: '#fff',
  },
  titleContainer: {
    backgroundColor: '#E9EBEE',
    padding: 10,
  },
  form: {
    paddingTop: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionContainer: {
    marginTop: 20,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionWithoutRemoveButtonContainer: {
    marginTop: 20,
    padding: 10,
  },
});

class FollowModal extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    isFollow: PropTypes.bool.isRequired,
    fetchUserFollowDetail: PropTypes.func.isRequired,
    clearUserFollowDetail: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isPrivate: false,
    };
  }

  componentDidMount() {
    const { userId, fetchUserFollowDetail, clearUserFollowDetail } = this.props;
    clearUserFollowDetail(userId);
    fetchUserFollowDetail(userId);
  }

  componentWillReceiveProps(nextProps) {
    const {
      userFollowDetail: { item: prevItem },
    } = this.props;
    const {
      userFollowDetail: { item },
    } = nextProps;
    if (item && item !== prevItem) {
      this.setState({
        isPrivate: item.restrict === 'private',
      });
    }
  }

  handleOnChangeIsPrivate = value => {
    this.setState({
      isPrivate: value,
    });
  };

  handleOnPressFollowButton = () => {
    const { userId } = this.props;
    const { isPrivate } = this.state;
    const followType = isPrivate
      ? FOLLOWING_TYPES.PRIVATE
      : FOLLOWING_TYPES.PUBLIC;
    this.followUser(userId, followType);
    this.handleOnModalClose('follow');
  };

  handleOnPressRemoveButton = () => {
    const { userId } = this.props;
    this.unfollowUser(userId);
    this.handleOnModalClose('unfollow');
  };

  handleOnPressModalRemoveButton = userId => {
    this.unfollowUser(userId);
    this.handleOnModalClose('unfollow');
  };

  handleOnModalClose = result => {
    const { closeModal, onClosed } = this.props;
    if (onClosed) onClosed(result);
    closeModal();
  };

  followUser = (userId, followType) => {
    const { followUser } = this.props;
    followUser(userId, followType);
  };

  unfollowUser = userId => {
    const { unfollowUser } = this.props;
    unfollowUser(userId);
  };

  render() {
    const { isFollow, i18n } = this.props;
    const { isPrivate } = this.state;
    return (
      <Modal
        animationType="fade"
        transparent
        visible
        onRequestClose={this.handleOnModalClose}
      >
        <TouchableWithoutFeedback onPress={this.handleOnModalClose}>
          <View style={styles.container}>
            <TouchableWithoutFeedback>
              <View style={styles.innerContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>
                    {isFollow ? i18n.followEdit : i18n.follow}
                  </Text>
                </View>
                <View style={styles.form}>
                  <Text>{i18n.private}</Text>
                  <Switch
                    onValueChange={this.handleOnChangeIsPrivate}
                    value={isPrivate}
                  />
                </View>
                {isFollow ? (
                  <View style={styles.actionContainer}>
                    <PXTouchable onPress={this.handleOnPressRemoveButton}>
                      <Text>{i18n.followRemove}</Text>
                    </PXTouchable>
                    <PXTouchable onPress={this.handleOnPressFollowButton}>
                      <Text>{i18n.follow}</Text>
                    </PXTouchable>
                  </View>
                ) : (
                  <View style={styles.actionWithoutRemoveButtonContainer}>
                    <FollowButton
                      isFollow={isFollow}
                      onPress={this.handleOnPressFollowButton}
                    />
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

export default connectLocalization(
  connect(
    state => ({
      userFollowDetail: state.userFollowDetail,
    }),
    {
      ...userFollowDetailActionCreators,
      ...followUserActionCreators,
      ...modalActionCreators,
    },
  )(FollowModal),
);
