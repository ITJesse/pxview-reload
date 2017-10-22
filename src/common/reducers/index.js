import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import entities from './entities';
import walkthroughIllusts from './walkthroughIllusts';
import recommendedIllusts from './recommendedIllusts';
import recommendedMangas from './recommendedMangas';
import relatedIllusts from './relatedIllusts';
import trendingIllustTags from './trendingIllustTags';
import recommendedUsers from './recommendedUsers';
import illustDetail from './illustDetail';
import illustComments from './illustComments';
import searchAutoComplete from './searchAutoComplete';
import search from './search';
import searchUsers from './searchUsers';
import searchUsersAutoComplete from './searchUsersAutoComplete';
import searchHistory from './searchHistory';
import userDetail from './userDetail';
import userIllusts from './userIllusts';
import userMangas from './userMangas';
import userBookmarkIllusts from './userBookmarkIllusts';
import myPrivateBookmarkIllusts from './myPrivateBookmarkIllusts';
import userFollowing from './userFollowing';
import userFollowers from './userFollowers';
import userMyPixiv from './userMyPixiv';
import bookmarkTags from './bookmarkTags';
import ranking from './ranking';
import followingUserIllusts from './followingUserIllusts';
import newIllusts from './newIllusts';
import newMangas from './newMangas';
import myPixiv from './myPixiv';
import bookmarkIllust from './bookmarkIllust';
import illustBookmarkDetail from './illustBookmarkDetail';
import userFollowDetail from './userFollowDetail';
import addIllustComment from './addIllustComment';
import ugoiraMeta from './ugoiraMeta';
import browsingHistory from './browsingHistory';
import highlightTags from './highlightTags';
import muteTags from './muteTags';
import muteUsers from './muteUsers';
import auth from './auth';
import myAccountState from './myAccountState';
import editAccount from './editAccount';
import verificationEmail from './verificationEmail';
import modal from './modal';
// import nav from './nav';
import i18n from './i18n';
import error from './error';

const rootReducer = combineReducers({
  error,
  entities,
  walkthroughIllusts,
  recommendedIllusts,
  recommendedMangas,
  relatedIllusts,
  trendingIllustTags,
  recommendedUsers,
  illustDetail,
  illustComments,
  search,
  ranking,
  searchAutoComplete,
  searchUsers,
  searchUsersAutoComplete,
  searchHistory,
  userDetail,
  userIllusts,
  userMangas,
  userBookmarkIllusts,
  myPrivateBookmarkIllusts,
  userFollowing,
  userFollowers,
  userFollowDetail,
  userMyPixiv,
  followingUserIllusts,
  newIllusts,
  newMangas,
  myPixiv,
  bookmarkTags,
  bookmarkIllust,
  illustBookmarkDetail,
  addIllustComment,
  ugoiraMeta,
  browsingHistory,
  highlightTags,
  muteTags,
  muteUsers,
  auth,
  myAccountState,
  editAccount,
  verificationEmail,
  modal,
  // nav,
  i18n,
  form: formReducer,
});

export default rootReducer;
