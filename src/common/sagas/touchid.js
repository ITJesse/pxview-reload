import { take, put, call, race, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { FOREGROUND, BACKGROUND } from 'redux-enhancer-react-native-appstate';
import BackgroundTimer from 'react-native-background-timer';

import { setShouldCheckTouchID, setShowTouchIDUI } from '../actions/touchid';
import { selectShouldCheckTouchID } from '../selectors';

export function* watchBackgroundForTouchID() {
  while (true) {
    yield take(BACKGROUND);
    BackgroundTimer.start();
    const shouldCheckTouchID = yield select(selectShouldCheckTouchID);
    yield put(setShouldCheckTouchID(true));
    yield put(setShowTouchIDUI(shouldCheckTouchID));
    const { timeout } = yield race({
      timeout: call(delay, 30000),
      foreground: take(FOREGROUND),
    });
    BackgroundTimer.stop();
    if (timeout) {
      yield put(setShouldCheckTouchID(true));
      yield put(setShowTouchIDUI(true));
    } else {
      yield put(setShowTouchIDUI(shouldCheckTouchID));
      yield put(setShouldCheckTouchID(shouldCheckTouchID));
    }
  }
}

export default watchBackgroundForTouchID;
