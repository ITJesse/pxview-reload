import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import DetailFooter from './DetailFooter';
import PXCacheImageTouchable from './PXCacheImageTouchable';
import UgoiraViewTouchable from './UgoiraViewTouchable';
import PXBottomSheet from './PXBottomSheet';
import PXBottomSheetButton from './PXBottomSheetButton';
import PXBottomSheetCancelButton from './PXBottomSheetCancelButton';
import OverlayMutedIndicator from './OverlayMutedIndicator';
import * as searchHistoryActionCreators from '../common/actions/searchHistory';
import * as highlightTagsActionCreators from '../common/actions/highlightTags';
import * as muteTagsActionCreators from '../common/actions/muteTags';
import { makeGetTagsWithStatus } from '../common/selectors';
import { SEARCH_TYPES, SCREENS } from '../common/constants';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
    width: globalStyleVariables.WINDOW_WIDTH,
  },
  imagePageNumberContainer: {
    top: 10,
    right: 10,
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: 'grey',
    borderRadius: 10,
    paddingHorizontal: 8,
    // height: 32,
  },
  imagePageNumber: {
    color: '#fff',
    padding: 2,
  },
  multiImageContainer: {
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'gray',
  },
  imageContainer: {
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
  },
  image: {
    resizeMode: 'contain',
  },
  mutedImageContainer: {
    flex: 1,
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
    height: 200,
  },
});

class DetailImageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInitState: true,
      isScrolling: false,
      imagePageNumber: null,
      isOpenTagBottomSheet: false,
      selectedTag: null,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      item: prevItem,
      tags: prevTags,
      isMuteUser: prevIsMuteUser,
    } = this.props;
    const { item, tags, isMuteUser } = nextProps;
    const {
      isInitState: prevIsInitState,
      isScrolling: prevIsScrolling,
      imagePageNumber: prevImagePageNumber,
      isOpenTagBottomSheet: prevIsOpenTagBottomSheet,
      selectedTag: prevSelectedTag,
    } = this.state;
    const {
      isInitState,
      isScrolling,
      imagePageNumber,
      isOpenTagBottomSheet,
      selectedTag,
    } = nextState;
    if (item.user.is_followed !== prevItem.user.is_followed) {
      return true;
    }
    if (
      isInitState !== prevIsInitState ||
      isScrolling !== prevIsScrolling ||
      imagePageNumber !== prevImagePageNumber ||
      isOpenTagBottomSheet !== prevIsOpenTagBottomSheet ||
      selectedTag !== prevSelectedTag ||
      tags !== prevTags ||
      isMuteUser !== prevIsMuteUser
    ) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleOnPressTag = tag => {
    const { addSearchHistory, navigation: { navigate } } = this.props;
    addSearchHistory(tag);
    navigate(SCREENS.SearchResult, {
      word: tag,
      searchType: SEARCH_TYPES.ILLUST,
    });
  };

  handleOnLongPressTag = tag => {
    this.setState({
      isOpenTagBottomSheet: true,
      selectedTag: tag,
    });
  };

  handleOnCancelTagBottomSheet = () => {
    this.setState({
      isOpenTagBottomSheet: false,
    });
  };

  handleOnPressOpenEncyclopedia = () => {
    const { navigate } = this.props.navigation;
    const { selectedTag } = this.state;
    if (selectedTag) {
      this.handleOnCancelTagBottomSheet();
      navigate(SCREENS.Encyclopedia, {
        word: selectedTag,
      });
    }
  };

  handleOnPressToggleHighlightTag = () => {
    const { highlightTags, addHighlightTag, removeHighlightTag } = this.props;
    const { selectedTag } = this.state;
    this.handleOnCancelTagBottomSheet();
    if (highlightTags.includes(selectedTag)) {
      removeHighlightTag(selectedTag);
    } else {
      addHighlightTag(selectedTag);
    }
  };

  handleOnPressToggleMuteTag = () => {
    const { muteTags, addMuteTag, removeMuteTag } = this.props;
    const { selectedTag } = this.state;
    this.handleOnCancelTagBottomSheet();
    if (muteTags.includes(selectedTag)) {
      removeMuteTag(selectedTag);
    } else {
      addMuteTag(selectedTag);
    }
  };

  handleOnPressAvatar = userId => {
    const { navigate } = this.props.navigation;
    navigate(SCREENS.UserDetail, { userId });
  };

  handleOnPressLink = url => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          return null;
        }
        return Linking.openURL(url);
      })
      .catch(err => err);
  };

  handleOnScrollMultiImagesList = () => {
    const { isInitState, isScrolling } = this.state;
    if (isInitState) {
      this.setState({
        isInitState: false,
      });
    }
    if (!isScrolling) {
      this.setState({
        isScrolling: true,
      });
    }
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({ isScrolling: false });
    }, 2000);
  };

  handleOnScroll = e => {
    const { item, onScroll } = this.props;
    if (item.page_count > 1) {
      this.handleOnScrollMultiImagesList();
    }
    const { imagePageNumber } = this.state;
    // Check if the user is scrolling up or down by confronting the new scroll position with your own one
    const currentOffset = e.nativeEvent.contentOffset.y;
    const contentHeight = e.nativeEvent.contentSize.height;
    const offsetToHideImagePageNumber = contentHeight - this.footerViewHeight;
    if (currentOffset > offsetToHideImagePageNumber && imagePageNumber) {
      this.setState({
        imagePageNumber: null,
      });
    }
    if (onScroll) {
      onScroll(e);
    }
  };

  handleOnViewableItemsChanged = ({ viewableItems }) => {
    const { item } = this.props;
    if (
      item.meta_pages &&
      item.meta_pages.length &&
      viewableItems &&
      viewableItems.length
    ) {
      this.setState({
        imagePageNumber: `${viewableItems[0].index + 1} / ${item.meta_pages
          .length}`,
      });
    }
  };

  handleOnLayoutFooter = e => {
    this.footerViewHeight = e.nativeEvent.layout.height;
  };

  renderItem = ({ item, index }) => {
    const { onPressImage, onLongPressImage } = this.props;
    return (
      <PXCacheImageTouchable
        key={item.image_urls.medium}
        uri={item.image_urls.medium}
        initWidth={globalStyleVariables.WINDOW_HEIGHT}
        initHeight={200}
        style={styles.multiImageContainer}
        imageStyle={styles.image}
        pageNumber={index + 1}
        index={index}
        onPress={onPressImage}
        onLongPress={onLongPressImage}
      />
    );
  };

  renderImageOrUgoira = isMute => {
    const { item, onPressImage, onLongPressImage } = this.props;
    if (isMute) {
      return (
        <View style={styles.mutedImageContainer}>
          <OverlayMutedIndicator />
        </View>
      );
    } else if (item.type === 'ugoira') {
      return <UgoiraViewTouchable item={item} />;
    }
    return (
      <PXCacheImageTouchable
        uri={item.image_urls.medium}
        initWidth={
          item.width > globalStyleVariables.WINDOW_WIDTH
            ? globalStyleVariables.WINDOW_WIDTH
            : item.width
        }
        initHeight={
          globalStyleVariables.WINDOW_WIDTH * item.height / item.width
        }
        style={styles.imageContainer}
        imageStyle={styles.image}
        onPress={onPressImage}
        onLongPress={onLongPressImage}
        index={0}
      />
    );
  };

  renderFooter = () => {
    const { item, navigation, i18n, authUser, tags } = this.props;
    return (
      <DetailFooter
        onLayoutView={this.handleOnLayoutFooter}
        item={item}
        tags={tags}
        navigation={navigation}
        i18n={i18n}
        authUser={authUser}
        onPressAvatar={this.handleOnPressAvatar}
        onPressTag={this.handleOnPressTag}
        onLongPressTag={this.handleOnLongPressTag}
        onPressLink={this.handleOnPressLink}
      />
    );
  };

  render() {
    const {
      item,
      onScroll,
      i18n,
      tags,
      highlightTags,
      muteTags,
      isMuteUser,
    } = this.props;
    const {
      imagePageNumber,
      isScrolling,
      isInitState,
      isOpenTagBottomSheet,
      selectedTag,
    } = this.state;
    const isMute = tags.some(t => t.isMute) || isMuteUser;
    return (
      <View key={item.id} style={styles.container}>
        {!isMute && item.page_count > 1
          ? <View>
              <FlatList
                data={item.meta_pages}
                keyExtractor={page => page.image_urls.large}
                renderItem={this.renderItem}
                removeClippedSubviews={false}
                ListFooterComponent={this.renderFooter}
                onScroll={this.handleOnScroll}
                onViewableItemsChanged={this.handleOnViewableItemsChanged}
                scrollEventThrottle={16}
                bounces={false}
              />
              {(isInitState || isScrolling) &&
                imagePageNumber &&
                <View style={styles.imagePageNumberContainer}>
                  <Text style={styles.imagePageNumber}>
                    {imagePageNumber}
                  </Text>
                </View>}
            </View>
          : <ScrollView
              onScroll={onScroll}
              scrollEventThrottle={16}
              bounces={false}
            >
              {this.renderImageOrUgoira(isMute)}
              {this.renderFooter()}
            </ScrollView>}
        <PXBottomSheet
          visible={isOpenTagBottomSheet}
          onCancel={this.handleOnCancelTagBottomSheet}
        >
          <PXBottomSheetButton
            onPress={this.handleOnPressOpenEncyclopedia}
            iconName="book"
            iconType="font-awesome"
            text={i18n.encyclopedia}
          />
          <PXBottomSheetButton
            onPress={this.handleOnPressToggleHighlightTag}
            iconName="tag"
            iconType="font-awesome"
            text={
              highlightTags.includes(selectedTag)
                ? i18n.tagHighlightRemove
                : i18n.tagHighlightAdd
            }
          />
          <PXBottomSheetButton
            onPress={this.handleOnPressToggleMuteTag}
            iconName="tag"
            iconType="font-awesome"
            text={
              muteTags.includes(selectedTag)
                ? i18n.tagMuteRemove
                : i18n.tagMuteAdd
            }
          />
          <PXBottomSheetCancelButton
            onPress={this.handleOnCancelTagBottomSheet}
            text={i18n.cancel}
          />
        </PXBottomSheet>
      </View>
    );
  }
}

export default connect(
  () => {
    const getTagsWithStatus = makeGetTagsWithStatus();
    return (state, props) => ({
      highlightTags: state.highlightTags.items,
      muteTags: state.muteTags.items,
      isMuteUser: state.muteUsers.items.some(m => m === props.item.user.id),
      tags: getTagsWithStatus(state, props),
    });
  },
  {
    ...searchHistoryActionCreators,
    ...highlightTagsActionCreators,
    ...muteTagsActionCreators,
  },
)(DetailImageList);
