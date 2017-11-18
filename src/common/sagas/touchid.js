import { take, put, call, race, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { FOREGROUND, BACKGROUND } from 'redux-enhancer-react-native-appstate';

import { setShouldCheckTouchID, setShowTouchIDUI } from '../actions/touchid';
import { selectShouldCheckTouchID } from '../selectors';

export function* watchBackgroundForTouchID() {
  while (true) {
    yield take(BACKGROUND);
    const shouldCheckTouchID = yield select(selectShouldCheckTouchID);
    yield put(setShouldCheckTouchID(true));
    yield put(setShowTouchIDUI(false));
    const { foreground } = yield race({
      delay: call(delay, 30000),
      foreground: take(FOREGROUND),
    });
    if (foreground && foreground.type === FOREGROUND) {
      yield put(setShouldCheckTouchID(shouldCheckTouchID));
      if (shouldCheckTouchID) {
        yield put(setShowTouchIDUI(true));
      }
    } else {
      yield put(setShowTouchIDUI(true));
    }
  }
}

export default watchBackgroundForTouchID;
