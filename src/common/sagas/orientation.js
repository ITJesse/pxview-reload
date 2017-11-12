import { takeEvery, select, put } from 'redux-saga/effects';

import { ORIENTATION } from '../constants/actionTypes';
import { setIllustColumns } from '../actions/orientation';
import { getOrientation } from '../selectors';
import { globalStyleVariables } from '../../styles';

function* handleOrientationChange() {
  const orientation = yield select(getOrientation);
  let ILLUST_COLUMNS;
  const width = globalStyleVariables.WINDOW_WIDTH();
  const height = globalStyleVariables.WINDOW_HEIGHT();
  if (orientation === 'PORTRAIT') {
    if (height / width > 1.6) {
      ILLUST_COLUMNS = 3; // iPhone
    } else {
      ILLUST_COLUMNS = 4; // iPad
    }
  } else if (orientation === 'LANDSCAPE') {
    if (height / width > 1.6) {
      ILLUST_COLUMNS = 3; // iPhone
    } else {
      ILLUST_COLUMNS = 5; // iPad
    }
  }
  yield put(setIllustColumns(ILLUST_COLUMNS));
}

export function* watchOrientationChange() {
  yield takeEvery(ORIENTATION.SET, handleOrientationChange);
}
