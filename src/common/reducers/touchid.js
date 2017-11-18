import {
  USE_TOUCHID,
  SHOULD_CHECK_TOUCHID,
  SHOW_TOUCHID_UI,
} from '../constants/actionTypes';

export default function touchid(
  state = {
    useTouchID: false,
    shouldCheckTouchID: false,
    showTouchIDUI: true,
  },
  action = {},
) {
  switch (action.type) {
    case USE_TOUCHID.SET: {
      return {
        ...state,
        useTouchID: true,
        shouldCheckTouchID: false,
      };
    }
    case USE_TOUCHID.CLEAR: {
      return {
        ...state,
        useTouchID: false,
        shouldCheckTouchID: false,
      };
    }
    case USE_TOUCHID.CLEAR_ALL: {
      return {
        ...state,
        useTouchID: false,
        shouldCheckTouchID: false,
      };
    }
    case SHOULD_CHECK_TOUCHID.SET: {
      return {
        ...state,
        shouldCheckTouchID: true,
      };
    }
    case SHOULD_CHECK_TOUCHID.CLEAR: {
      return {
        ...state,
        shouldCheckTouchID: false,
      };
    }
    case SHOW_TOUCHID_UI.SET: {
      return {
        ...state,
        showTouchIDUI: true,
      };
    }
    case SHOW_TOUCHID_UI.CLEAR: {
      return {
        ...state,
        showTouchIDUI: false,
      };
    }
    default:
      return state;
  }
}
