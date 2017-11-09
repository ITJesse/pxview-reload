import { take, put, call, race } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { FOREGROUND, BACKGROUND } from 'redux-enhancer-react-native-appstate';

import { setShouldCheckTouchID } from '../actions/touchid';

export function* watchBackgroundForTouchID() {
  while (true) {
    yield take(BACKGROUND);
    yield put(setShouldCheckTouchID(true));
    const { foreground } = yield race({
      delay: call(delay, 30000),
      foreground: take(FOREGROUND),
    });
    if (foreground && foreground.type === FOREGROUND) {
      yield put(setShouldCheckTouchID(false));
    }
  }
}
