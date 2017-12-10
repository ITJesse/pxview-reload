import { takeEvery, select, put } from 'redux-saga/effects';
import Device from 'react-native-device';

import { ORIENTATION } from '../constants/actionTypes';
import { setIllustColumns } from '../actions/orientation';
import { getOrientation } from '../selectors';

function* handleOrientationChange() {
  const orientation = yield select(getOrientation);
  let ILLUST_COLUMNS;
  if (orientation === 'PORTRAIT') {
    if (Device.isIphone()) {
      ILLUST_COLUMNS = 3;
    } else {
      ILLUST_COLUMNS = 4;
    }
  } else if (orientation === 'LANDSCAPE') {
    if (Device.isIphone()) {
      ILLUST_COLUMNS = 3;
    } else {
      ILLUST_COLUMNS = 5;
    }
  }
  yield put(setIllustColumns(ILLUST_COLUMNS));
}

export function* watchOrientationChange() {
  yield takeEvery(ORIENTATION.SET, handleOrientationChange);
}

export default watchOrientationChange;
