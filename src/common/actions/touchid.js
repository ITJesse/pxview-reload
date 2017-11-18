import {
  USE_TOUCHID,
  SHOULD_CHECK_TOUCHID,
  SHOW_TOUCHID_UI,
} from '../constants/actionTypes';

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

export function setShowTouchIDUI(value) {
  if (value) {
    return {
      type: SHOW_TOUCHID_UI.SET,
    };
  }
  return {
    type: SHOW_TOUCHID_UI.CLEAR,
  };
}

export function clearTouchIDSettings() {
  return {
    type: USE_TOUCHID.CLEAR_ALL,
  };
}
