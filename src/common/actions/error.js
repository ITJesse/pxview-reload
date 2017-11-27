import { ERROR } from '../constants/actionTypes';

export function addError(error) {
  let message;
  if (typeof error === 'string') {
    message = error;
  } else if (
    error.error &&
    typeof error.error.user_message === 'string' &&
    error.error.user_message.length > 0
  ) {
    message = error.error.user_message;
  } else if (
    error.error &&
    typeof error.error.message === 'string' &&
    error.error.message.length > 0
  ) {
    message = error.error.message;
  } else {
    message = 'Something bad happened';
  }
  return {
    type: ERROR.ADD,
    error: true,
    payload: message,
  };
}

export function clearError() {
  return {
    type: ERROR.CLEAR,
    error: false,
  };
}
