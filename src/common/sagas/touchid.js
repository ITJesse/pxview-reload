import { take, put, select } from 'redux-saga/effects';
import { FOREGROUND, BACKGROUND } from 'redux-enhancer-react-native-appstate';
import moment from 'moment';

import { setShouldCheckTouchID, setShowTouchIDUI } from '../actions/touchid';
import { selectShouldCheckTouchID } from '../selectors';

export function* watchBackgroundForTouchID() {
  while (true) {
    yield take(BACKGROUND);
    const shouldCheckTouchID = yield select(selectShouldCheckTouchID);
    yield put(setShouldCheckTouchID(true));
    yield put(setShowTouchIDUI(false));
    const backgroundTime = moment();
    yield take(FOREGROUND);
    const foregroundTime = moment();
    const duration = moment.duration(foregroundTime.diff(backgroundTime));
    if (duration < 30000) {
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
