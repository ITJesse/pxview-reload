import { takeEvery, apply, put, select, call } from 'redux-saga/effects';
import {
  followUserSuccess,
  followUserFailure,
  unfollowUserSuccess,
  unfollowUserFailure,
} from '../actions/followUser';
import {
  removeUserFollowing,
  clearUserFollowing,
  fetchUserFollowing,
} from '../actions/userFollowing';
import { getAuthUser } from '../selectors';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { FOLLOW_USER, UNFOLLOW_USER } from '../constants/actionTypes';
import { FOLLOWING_TYPES } from '../constants';

function* handleFollowUserSuccess(userId, followType) {
  const user = yield select(getAuthUser);
  yield put(
    removeUserFollowing(
      user.id,
      userId,
      followType === FOLLOWING_TYPES.PRIVATE
        ? FOLLOWING_TYPES.PUBLIC
        : FOLLOWING_TYPES.PRIVATE,
    ),
  );
  // yield put(addUserFollowing(user.id, userId, followType));
  yield put(clearUserFollowing(user.id, followType));
  yield put(fetchUserFollowing(user.id, followType));
}

function* handleUnfollowUserSuccess(userId) {
  const user = yield select(getAuthUser);
  yield put(removeUserFollowing(user.id, userId, FOLLOWING_TYPES.PRIVATE));
  yield put(removeUserFollowing(user.id, userId, FOLLOWING_TYPES.PUBLIC));
}

export function* handleFollowUser(action) {
  const { userId, followType } = action.payload;
  try {
    const followTypeString =
      followType === FOLLOWING_TYPES.PRIVATE ? 'private' : 'public';
    yield apply(pixiv, pixiv.followUser, [userId, followTypeString]);
    yield put(followUserSuccess(userId));
    yield call(handleFollowUserSuccess, userId, followType);
  } catch (err) {
    yield put(followUserFailure(userId));
    yield put(addError(err));
  }
}

export function* handleUnfollowUser(action) {
  const { userId } = action.payload;
  try {
    yield apply(pixiv, pixiv.unfollowUser, [userId]);
    yield put(unfollowUserSuccess(userId));
    yield call(handleUnfollowUserSuccess, userId);
  } catch (err) {
    yield put(unfollowUserFailure(userId));
    yield put(addError(err));
  }
}

export function* watchFollowUser() {
  yield takeEvery(FOLLOW_USER.REQUEST, handleFollowUser);
}

export function* watchUnfollowUser() {
  yield takeEvery(UNFOLLOW_USER.REQUEST, handleUnfollowUser);
}
