import { delay } from 'redux-saga';
import {
  take,
  takeEvery,
  call,
  apply,
  put,
  race,
  select,
  fork,
  cancel,
} from 'redux-saga/effects';
import moment from 'moment';
import { REHYDRATE } from 'redux-persist/constants';
import { FOREGROUND, BACKGROUND } from 'redux-enhancer-react-native-appstate';
import { Answers } from 'react-native-fabric';

import {
  login,
  logout,
  loginSuccess,
  loginFailure,
  signUpSuccess,
  signUpFailure,
  refreshAccessToken,
  refreshAccessTokenSuccess,
  refreshAccessTokenFailure,
  rehydrateSuccess,
} from '../actions/auth';
import { clearTouchIDSettings } from '../actions/touchid';
import { setLanguage } from '../actions/i18n';
import { addError } from '../actions/error';
import { clearRecommendedIllusts } from '../../common/actions/recommendedIllusts';
import { clearRecommendedMangas } from '../../common/actions/recommendedMangas';
import { clearTrendingIllustTags } from '../../common/actions/trendingIllustTags';
import { clearRecommendedUsers } from '../../common/actions/recommendedUsers';
import pixiv from '../helpers/apiClient';
import { getAuth, getAuthUser, getLang } from '../selectors';
import {
  AUTH_LOGIN,
  AUTH_SIGNUP,
  AUTH_LOGOUT,
  AUTH_REFRESH_ACCESS_TOKEN,
} from '../constants/actionTypes';

const setProvisionalAccountOptions = (isProvisionalAccount, password) => ({
  isProvisionalAccount,
  password,
});

export function* authorize(email, password, isProvisionalAccount) {
  // use apply instead of call to pass this to function
  const loginResponse = yield apply(pixiv, pixiv.login, [
    email,
    password,
    false,
  ]);
  const options = setProvisionalAccountOptions(isProvisionalAccount, password);
  yield put(loginSuccess(loginResponse, options));
  return loginResponse;
}

export function* handleRefreshAccessToken(refreshToken) {
  try {
    const response = yield apply(pixiv, pixiv.refreshAccessToken, [
      refreshToken,
    ]);
    const user = yield select(getAuthUser);
    const options = setProvisionalAccountOptions(
      user.isProvisionalAccount,
      user.password,
    );

    yield put(refreshAccessTokenSuccess(response, options));
    return response;
  } catch (err) {
    yield put(refreshAccessTokenFailure());
    // yield put(logout());
  }
  return null;
}

export function* scheduleRefreshAccessToken(refreshToken, delayMilisecond) {
  yield call(delay, delayMilisecond);
  const response = yield call(handleRefreshAccessToken, refreshToken);
  return response;
}

export function* refreshAccessTokenOnExpiry(authResponse) {
  // refresh token 5 min before expire
  // convert expires in to milisecond
  let delayMilisecond = (authResponse.expires_in - 300) * 1000;
  while (true) {
    const authUser = yield select(getAuthUser);
    if (authUser) {
      // cancel scheduleRefreshAccessToken if app state changed to background
      const { background, refreshAccessTokenResponse } = yield race({
        background: take(BACKGROUND),
        refreshAccessTokenResponse: call(
          scheduleRefreshAccessToken,
          authUser.refreshToken,
          delayMilisecond,
        ),
      });
      // wait for app back to foreground before scheduleRefreshAccessToken
      if (background && background.type === BACKGROUND) {
        yield take(FOREGROUND);
        const auth = yield select(getAuth);
        const now = moment();
        const end = moment(auth.timestamp);
        const duration = moment.duration(now.diff(end));
        const ms = duration.asMilliseconds();
        delayMilisecond -= ms;
      } else if (refreshAccessTokenResponse) {
        delayMilisecond = (refreshAccessTokenResponse.expires_in - 300) * 1000;
      }
    }
  }
}

export function* handleLogout() {
  yield apply(pixiv, pixiv.logout);
}

export function* watchLoginRequestTask() {
  while (true) {
    try {
      const action = yield take(AUTH_LOGIN.REQUEST);
      const { email, password, isProvisionalAccount } = action.payload;
      const authResponse = yield call(
        authorize,
        email,
        password,
        isProvisionalAccount,
      );
      yield race([
        take(AUTH_LOGOUT.SUCCESS),
        call(refreshAccessTokenOnExpiry, authResponse),
      ]);
      yield call(handleLogout);
      // user logged out, next while iteration will wait for the
      // next AUTH_LOGIN.REQUEST action
    } catch (err) {
      const errMessage =
        err.errors && err.errors.system && err.errors.system.message
          ? err.errors.system.message
          : '';
      yield put(loginFailure());
      yield put(addError(errMessage));
    }
  }
}

export function* watchLoginRequest() {
  while (true) {
    const loginRequestTask = yield fork(watchLoginRequestTask);
    yield take(AUTH_LOGIN.STOP);
    yield cancel(loginRequestTask);
  }
}

export function* watchRefreshAccessTokenRequestTask() {
  while (true) {
    try {
      const action = yield take(AUTH_REFRESH_ACCESS_TOKEN.REQUEST);
      const { refreshToken } = action.payload;
      const authResponse = yield call(handleRefreshAccessToken, refreshToken);
      yield race([
        take(AUTH_LOGOUT.SUCCESS),
        call(refreshAccessTokenOnExpiry, authResponse),
      ]);
      yield call(handleLogout);
      // user logged out, next while iteration will wait for the
      // next AUTH_REFRESH_ACCESS_TOKEN.REQUEST action
    } catch (err) {
      const errMessage =
        err.errors && err.errors.system && err.errors.system.message
          ? err.errors.system.message
          : '';
      yield put(refreshAccessTokenFailure());
      yield put(addError(errMessage));
    }
  }
}

export function* watchRefreshAccessTokenRequest() {
  while (true) {
    const refreshAccessTokenTask = yield fork(
      watchRefreshAccessTokenRequestTask,
    );
    yield take(AUTH_LOGIN.STOP);
    yield cancel(refreshAccessTokenTask);
  }
}

export function* signUp(nickname) {
  const signUpResponse = yield apply(pixiv, pixiv.createProvisionalAccount, [
    nickname,
  ]);
  yield put(signUpSuccess(signUpResponse));
  return signUpResponse;
}

export function* watchSignUpRequest() {
  while (true) {
    try {
      const action = yield take(AUTH_SIGNUP.REQUEST);
      const { nickname } = action.payload;
      const signUpResponse = yield call(signUp, nickname);
      yield put(
        login(signUpResponse.user_account, signUpResponse.password, true),
      );
    } catch (err) {
      const errMessage =
        err.errors && err.errors.system && err.errors.system.message
          ? err.errors.system.message
          : '';
      yield put(signUpFailure());
      yield put(addError(errMessage));
    }
  }
}

// wait rehydrate complete, login if authUser exist, then run other api
export function* watchRehydrate() {
  while (true) {
    try {
      yield take(REHYDRATE);
      const user = yield select(getAuthUser);
      if (user) {
        yield put(refreshAccessToken(user.refreshToken));
        yield take([
          AUTH_REFRESH_ACCESS_TOKEN.SUCCESS,
          AUTH_REFRESH_ACCESS_TOKEN.FAILURE,
          AUTH_LOGOUT.SUCCESS,
        ]);
      } else {
        yield put(logout());
      }
      const lang = yield select(getLang);
      yield put(setLanguage(lang));
    } catch (err) {
      // todo logout user
      // console.log('err in watchRehydrate ', err);
    } finally {
      yield put(rehydrateSuccess());
    }
  }
}

export function* watchLoginSuccess() {
  yield takeEvery(AUTH_LOGIN.SUCCESS, function*() {
    // eslint-disable-next-line no-undef
    if (!__DEV__) {
      yield call(Answers.logLogin, 'Account', true);
    }
  });
}

export function* watchLoginFailure() {
  yield takeEvery(AUTH_LOGIN.FAILURE, function*() {
    // eslint-disable-next-line no-undef
    if (!__DEV__) {
      yield call(Answers.logLogin, 'Account', false);
    }
  });
}

export function* watchSignUpSuccess() {
  yield takeEvery(AUTH_SIGNUP.SUCCESS, function*() {
    // eslint-disable-next-line no-undef
    if (!__DEV__) {
      yield call(Answers.logSignUp, 'Provisional', true);
    }
  });
}

export function* watchSignUpFailure() {
  yield takeEvery(AUTH_SIGNUP.FAILURE, function*() {
    // eslint-disable-next-line no-undef
    if (!__DEV__) {
      yield call(Answers.logSignUp, 'Provisional', false);
    }
  });
}

export function* watchLogoutSuccess() {
  yield takeEvery(AUTH_LOGOUT.SUCCESS, function*() {
    yield put(clearTouchIDSettings());
    yield put(clearRecommendedIllusts());
    yield put(clearRecommendedMangas());
    yield put(clearRecommendedUsers());
    yield put(clearTrendingIllustTags());
  });
}
