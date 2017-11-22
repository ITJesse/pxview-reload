import { normalize } from 'normalizr';
import { takeEvery, apply, put, all } from 'redux-saga/effects';
import {
  fetchUserFollowingSuccess,
  fetchUserFollowingFailure,
} from '../actions/userFollowing';
import { fetchUserIllusts } from '../actions/userIllusts';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { USER_FOLLOWING } from '../constants/actionTypes';
import Schemas from '../constants/schemas';
import { FOLLOWING_TYPES } from '../constants';
import config from '../config';

export function* handleFetchUserFollowing(action) {
  const { userId, followingType, nextUrl } = action.payload;
  try {
    let response;
    if (nextUrl) {
      response = yield apply(pixiv, pixiv.requestUrl, [nextUrl]);
    } else {
      const options = {
        restrict:
          followingType === FOLLOWING_TYPES.PRIVATE ? 'private' : 'public',
      };
      response = yield apply(pixiv, pixiv.userFollowing, [userId, options]);
    }
    const transformedResult = {
      ...response,
      user_previews: response.user_previews.map(result => ({
        ...result,
        id: result.user.id,
      })),
    };

    const normalized = normalize(
      transformedResult.user_previews,
      Schemas.USER_PREVIEW_ARRAY,
    );
    yield put(
      fetchUserFollowingSuccess(
        normalized.entities,
        normalized.result,
        userId,
        followingType,
        response.next_url,
      ),
    );
    if (config.device === 'ipad') {
      const tasks = response.user_previews.map(user =>
        put(fetchUserIllusts(user.user.id)),
      );
      yield all(tasks);
    }
  } catch (err) {
    yield put(fetchUserFollowingFailure(userId));
    yield put(addError(err));
  }
}

export function* watchFetchUserFollowing() {
  yield takeEvery(USER_FOLLOWING.REQUEST, handleFetchUserFollowing);
}

// function shouldFetchUserFollowing(state, userId, followingType) {
//   //todo
//   const results = state.userFollowing[followingType][userId];
//   if (results && results.loading) {
//     return false;
//   }
//   else {
//     return true;
//   }
// }
