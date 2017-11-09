import { USE_TOUCHID, SHOULD_CHECK_TOUCHID } from '../constants/actionTypes';

export function setUseTouchID(value) {
  if (value) {
    return {
      type: USE_TOUCHID.SET,
    };
  }
  return {
    type: USE_TOUCHID.CLEAR,
  };
}

export function setShouldCheckTouchID(value) {
  if (value) {
    return {
      type: SHOULD_CHECK_TOUCHID.SET,
    };
  }
  return {
    type: SHOULD_CHECK_TOUCHID.CLEAR,
  };
}

export function clearTouchIDSettings() {
  return {
    type: USE_TOUCHID.CLEAR_ALL,
  };
}
