import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  InteractionManager,
  LayoutAnimation,
  DeviceEventEmitter,
} from 'react-native';
import { connect } from 'react-redux';
import Share from 'react-native-share';
import ActionButton from 'react-native-action-button';
import { Answers } from 'react-native-fabric';

import enhanceSaveImage from '../../components/HOC/enhanceSaveImage';
import DetailImageList from '../../components/DetailImageList';
import PXHeader from '../../components/PXHeader';
import PXViewPager from '../../components/PXViewPager';
import PXBottomSheet from '../../components/PXBottomSheet';
import PXBottomSheetButton from '../../components/PXBottomSheetButton';
import PXBottomSheetCancelButton from '../../components/PXBottomSheetCancelButton';
import BookmarkButton from '../../components/BookmarkButton';
import Loader from '../../components/Loader';
import PXTouchable from '../../components/PXTouchable';
import PXThumbnail from '../../components/PXThumbnail';
import HeaderSaveImageButton from '../../components/HeaderSaveImageButton';
import HeaderMenuButton from '../../components/HeaderMenuButton';
import * as browsingHistoryActionCreators from '../../common/actions/browsingHistory';
import * as muteUsersActionCreators from '../../common/actions/muteUsers';
import * as illustDetailActionCreators from '../../common/actions/illustDetail';
import { makeGetDetailItem } from '../../common/selectors';
import { SCREENS } from '../../common/constants';
import firebase from '../../common/helpers/firebase';
import { globalStyleVariables } from '../../styles';

const THUMBNAIL_SIZE = 30;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    maxWidth: globalStyleVariables.WINDOW_WIDTH - 150,
  },
  headerThumnailNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  headerText: {
    color: '#fff',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActionButtonVisible: true,
      isOpenMenuBottomSheet: false,
      selectedImageIndex: null,
    };
    this.listViewOffset = 0;
  }

  componentDidMount() {
    const {
      illustId,
      item,
      isFromDeepLink,
      addBrowsingHistory,
      fetchIllustDetail,
    } = this.props;
    // eslint-disable-next-line no-undef
    if (!__DEV__) {
      Answers.logContentView('Detail', 'Illust', `${illustId}`, { ...item });
    }
    InteractionManager.runAfterInteractions(() => {
      if (isFromDeepLink) {
        fetchIllustDetail(illustId);
      } else {
        this.masterListUpdateListener = DeviceEventEmitter.addListener(
          'masterListUpdate',
          this.handleOnMasterListUpdate,
        );
        addBrowsingHistory(item.id);
      }
    });
    this.ref = firebase.database().ref('report');
  }

  componentWillReceiveProps(nextProps) {
    const { illustDetail: prevIllustDetail } = this.props;
    const {
      illustId,
      isFromDeepLink,
      illustDetail,
      addBrowsingHistory,
    } = nextProps;
    if (
      illustId &&
      isFromDeepLink &&
      illustDetail &&
      illustDetail.loaded &&
      illustDetail.loaded !== prevIllustDetail.prevLoaded &&
      illustDetail.item
    ) {
      // only add browsing history if item is loaded for illust that open from deep link
      addBrowsingHistory(illustId);
    }
  }

  componentWillUnmount() {
    if (this.masterListUpdateListener) {
      this.masterListUpdateListener.remove();
    }
    this.ref.off();
  }

  handleOnScrollDetailImageList = e => {
    // Simple fade-in / fade-out animation
    const CustomLayoutLinear = {
      duration: 100,
      create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
      delete: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
    };
    // Check if the user is scrolling up or down by confronting the new scroll position with your own one
    const currentOffset = e.nativeEvent.contentOffset.y;
    const direction =
      currentOffset > 0 && currentOffset >= this.listViewOffset ? 'down' : 'up';
    // If the user is scrolling down (and the action-button is still visible) hide it
    const isActionButtonVisible = direction === 'up' || currentOffset === 0;
    if (isActionButtonVisible !== this.state.isActionButtonVisible) {
      LayoutAnimation.configureNext(CustomLayoutLinear);
      this.setState({ isActionButtonVisible });
    }
    this.listViewOffset = currentOffset;
  };

  handleOnPressImage = index => {
    const { navigation, item } = this.props;
    const images =
      item.page_count > 1
        ? item.meta_pages.map(page => page.image_urls.original)
        : [item.meta_single_page.original_image_url];
    navigation.navigate(SCREENS.ImagesViewer, {
      images,
      viewerIndex: index,
    });
  };

  handleOnLongPressImage = index => {
    this.handleOnPressOpenMenuBottomSheet(index);
  };

  handleOnViewPagerPageSelected = index => {
    const { items, addBrowsingHistory, navigation } = this.props;
    if (this.props.index !== undefined && this.props.index !== index) {
      const { setParams } = navigation;
      setParams({
        index,
      });
      InteractionManager.runAfterInteractions(() => {
        addBrowsingHistory(items[index].id);
      });
    }
  };

  handleOnListEndReached = () => {
    const { onListEndReached } = this.props;
    if (onListEndReached) {
      onListEndReached();
    }
  };

  handleOnMasterListUpdate = ({ listKey, items }) => {
    const { parentListKey, navigation: { setParams } } = this.props;
    if (parentListKey === listKey) {
      setParams({ items });
    }
  };

  handleOnPressHeaderBackButton = () => {
    const { goBack } = this.props.navigation;
    goBack();
  };

  handleOnPressOpenMenuBottomSheet = selectedImageIndex => {
    const newState = {
      isOpenMenuBottomSheet: true,
    };
    if (selectedImageIndex !== null) {
      newState.selectedImageIndex = selectedImageIndex;
    }
    this.setState(newState);
  };

  handleOnCancelMenuBottomSheet = () => {
    this.setState({
      isOpenMenuBottomSheet: false,
      selectedImageIndex: null,
    });
  };

  handleOnPressToggleMuteUser = () => {
    const { item, isMuteUser, addMuteUser, removeMuteUser } = this.props;
    if (isMuteUser) {
      removeMuteUser(item.user.id);
    } else {
      addMuteUser(item.user.id);
    }
    this.handleOnCancelMenuBottomSheet();
  };

  handleOnPressReportUser = () => {
    const { item, i18n } = this.props;
    this.ref
      .push()
      .set({
        userId: item.user.id,
        name: item.user.name,
        title: item.title,
      })
      .then(() => {
        DeviceEventEmitter.emit('showToast', i18n.feedbackSuccess);
        this.handleOnCancelMenuBottomSheet();
      })
      .catch(() => {
        this.handleOnCancelMenuBottomSheet();
      });
  };

  handleOnPressShareIllust = () => {
    const { item } = this.props;
    const shareOptions = {
      message: `${item.title} | ${item.user.name} #pxview`,
      url: `http://www.pixiv.net/member_illust.php?illust_id=${item.id}&mode=medium`,
    };
    Share.open(shareOptions)
      .then(() => {
        this.handleOnCancelMenuBottomSheet();
        // eslint-disable-next-line no-undef
        if (!__DEV__) {
          Answers.logShare('Share', item.title, 'Illust', `${item.id}`, {
            ...item,
          });
        }
      })
      .catch(this.handleOnCancelMenuBottomSheet);
  };

  handleOnPressSaveImage = () => {
    const { saveImage, item } = this.props;
    const { selectedImageIndex } = this.state;
    const images =
      item.page_count > 1
        ? item.meta_pages.map(page => page.image_urls.original)
        : [item.meta_single_page.original_image_url];
    saveImage([images[selectedImageIndex]]);
    // eslint-disable-next-line no-undef
    if (!__DEV__) {
      Answers.logCustom('SaveImage', { ...item });
    }
    this.handleOnCancelMenuBottomSheet();
  };

  renderHeaderTitle = item => {
    const { navigation: { navigate } } = this.props;
    return (
      <View style={styles.headerTitleContainer}>
        <PXTouchable
          style={styles.headerThumnailNameContainer}
          onPress={() => navigate(SCREENS.UserDetail, { userId: item.user.id })}
        >
          <PXThumbnail
            uri={item.user.profile_image_urls.medium}
            size={THUMBNAIL_SIZE}
          />
          <View style={styles.nameContainer}>
            <Text
              style={styles.headerText}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {item.user.name}
            </Text>
            <Text
              style={styles.headerText}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {item.user.account}
            </Text>
          </View>
        </PXTouchable>
      </View>
    );
  };

  renderHeaderRight = item => {
    const images =
      item.page_count > 1
        ? item.meta_pages.map(page => page.image_urls.original)
        : [item.meta_single_page.original_image_url];
    return (
      <View style={styles.headerRightContainer}>
        <HeaderSaveImageButton imageUrls={images} saveAll />
        <HeaderMenuButton
          onPress={() => this.handleOnPressOpenMenuBottomSheet(null)}
        />
      </View>
    );
  };

  renderContent = ({ item }) => {
    const { navigation, i18n, authUser } = this.props;
    return (
      <View key={item.id} testID="Detail">
        <PXHeader
          headerTitle={this.renderHeaderTitle(item)}
          headerRight={this.renderHeaderRight(item)}
          darkTheme
          showBackButton
          onPressBackButton={this.handleOnPressHeaderBackButton}
        />
        <DetailImageList
          item={item}
          navigation={navigation}
          i18n={i18n}
          authUser={authUser}
          onPressImage={this.handleOnPressImage}
          onLongPressImage={this.handleOnLongPressImage}
          onScroll={this.handleOnScrollDetailImageList}
        />
      </View>
    );
  };

  renderMainContent() {
    const { items, item, index, isFromDeepLink } = this.props;
    if (isFromDeepLink) {
      if (!item) {
        return <Loader />;
      }
      return (
        <PXViewPager
          items={[item]}
          index={0}
          renderContent={this.renderContent}
          onPageSelected={this.handleOnViewPagerPageSelected}
          onEndReached={this.handleOnListEndReached}
        />
      );
    }
    return (
      <PXViewPager
        items={items}
        index={index}
        renderContent={this.renderContent}
        onPageSelected={this.handleOnViewPagerPageSelected}
        onEndReached={this.handleOnListEndReached}
      />
    );
  }

  render() {
    const { item, isMuteUser, i18n, authUser } = this.props;
    const {
      isActionButtonVisible,
      isOpenMenuBottomSheet,
      selectedImageIndex,
    } = this.state;
    const isSelf = item.user.id === authUser.id;
    return (
      <View
        style={styles.container}
        ref={ref => (this.detailView = ref)} // eslint-disable-line no-return-assign
      >
        {this.renderMainContent()}
        {isActionButtonVisible &&
          item &&
          !isSelf &&
          <ActionButton
            buttonColor="rgba(255,255,255,1)"
            bgColor="red"
            renderIcon={() => <BookmarkButton item={item} />}
          />}
        <PXBottomSheet
          visible={isOpenMenuBottomSheet}
          onCancel={this.handleOnCancelMenuBottomSheet}
        >
          {selectedImageIndex !== null &&
            <PXBottomSheetButton
              onPress={this.handleOnPressSaveImage}
              iconName="content-save"
              iconType="material-community"
              text={i18n.saveImage}
            />}
          <PXBottomSheetButton
            onPress={this.handleOnPressShareIllust}
            iconName="share"
            iconType="entypo"
            text={i18n.share}
          />
          {!isSelf &&
            <PXBottomSheetButton
              onPress={this.handleOnPressToggleMuteUser}
              iconName="user-times"
              iconType="font-awesome"
              textStyle={{
                marginLeft: 28,
              }}
              text={isMuteUser ? i18n.userMuteRemove : i18n.userMuteAdd}
            />}
          {!isSelf &&
            <PXBottomSheetButton
              onPress={this.handleOnPressReportUser}
              iconName="ban"
              iconType="font-awesome"
              textStyle={{
                marginLeft: 34,
              }}
              text={i18n.reportUser}
            />}
          <PXBottomSheetCancelButton
            onPress={this.handleOnCancelMenuBottomSheet}
            textStyle={{
              marginLeft: 38,
            }}
            text={i18n.cancel}
          />
        </PXBottomSheet>
      </View>
    );
  }
}

export default enhanceSaveImage(
  connect(
    () => {
      const getDetailItem = makeGetDetailItem();
      return (state, props) => {
        const item = getDetailItem(state, props);
        const isMuteUser = item
          ? state.muteUsers.items.some(m => m === item.user.id)
          : false;
        const {
          illust_id: illustIdFromQS,
          illustId,
          items,
          index,
          onListEndReached,
          parentListKey,
        } = props.navigation.state.params;
        const id = parseInt(illustIdFromQS || illustId, 0);
        return {
          illustId: id || item.id,
          illustDetail: state.illustDetail[id], // get illustDetail from api if load from deep link
          item,
          isMuteUser,
          isFromDeepLink: !!id,
          items,
          index,
          onListEndReached,
          parentListKey,
          authUser: state.auth.user,
        };
      };
    },
    {
      ...browsingHistoryActionCreators,
      ...muteUsersActionCreators,
      ...illustDetailActionCreators,
    },
  )(Detail),
);
