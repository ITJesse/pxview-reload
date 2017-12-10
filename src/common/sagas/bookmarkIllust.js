import { takeEvery, apply, put, select, call } from 'redux-saga/effects';
import {
  bookmarkIllustSuccess,
  bookmarkIllustFailure,
  unbookmarkIllustSuccess,
  unbookmarkIllustFailure,
} from '../actions/bookmarkIllust';
import {
  addUserBookmarkIllusts,
  removeUserBookmarkIllusts,
} from '../actions/userBookmarkIllusts';
import {
  addPrivateBookmarkIllusts,
  removePrivateBookmarkIllusts,
} from '../actions/myPrivateBookmarkIllusts';
import { getAuthUser } from '../selectors';
import { addError } from '../actions/error';
import pixiv from '../helpers/apiClient';
import { BOOKMARK_ILLUST, UNBOOKMARK_ILLUST } from '../constants/actionTypes';
import { BOOKMARK_TYPES } from '../constants';

function* handleBookmarkIllustSuccess(illustId, bookmarkType) {
  const user = yield select(getAuthUser);
  if (bookmarkType === BOOKMARK_TYPES.PRIVATE) {
    yield put(addPrivateBookmarkIllusts(illustId));
    yield put(removeUserBookmarkIllusts(user.id, illustId));
  } else {
    yield put(addUserBookmarkIllusts(user.id, illustId));
    yield put(removePrivateBookmarkIllusts(illustId));
  }
}

function* handleUnbookmarkIllustSuccess(illustId) {
  const user = yield select(getAuthUser);
  yield put(removeUserBookmarkIllusts(user.id, illustId));
  yield put(removePrivateBookmarkIllusts(illustId));
}

export function* handleBookmarkIllust(action) {
  const { illustId, bookmarkType, tags } = action.payload;
  try {
    const bookmarkTypeString =
      bookmarkType === BOOKMARK_TYPES.PRIVATE ? 'private' : 'public';
    yield apply(pixiv, pixiv.bookmarkIllust, [
      illustId,
      bookmarkTypeString,
      tags,
    ]);
    yield put(bookmarkIllustSuccess(illustId));
    yield call(handleBookmarkIllustSuccess, illustId, bookmarkType);
  } catch (err) {
    yield put(bookmarkIllustFailure(illustId));
    yield put(addError(err));
  }
}

export function* handleUnbookmarkIllust(action) {
  const { illustId } = action.payload;
  try {
    yield apply(pixiv, pixiv.unbookmarkIllust, [illustId]);
    yield put(unbookmarkIllustSuccess(illustId));
    yield call(handleUnbookmarkIllustSuccess, illustId);
  } catch (err) {
    yield put(unbookmarkIllustFailure(illustId));
    yield put(addError(err));
  }
}

export function* watchBookmarkIllust() {
  yield takeEvery(BOOKMARK_ILLUST.REQUEST, handleBookmarkIllust);
}

export function* watchUnbookmarkIllust() {
  yield takeEvery(UNBOOKMARK_ILLUST.REQUEST, handleUnbookmarkIllust);
}
