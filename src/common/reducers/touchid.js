import { USE_TOUCHID, SHOULD_CHECK_TOUCHID } from '../constants/actionTypes';

export default function touchid(
  state = {
    useTouchID: false,
    shouldCheckTouchID: false,
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
    default:
      return state;
  }
}
