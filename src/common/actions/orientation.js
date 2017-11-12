import { ORIENTATION, ILLUST_COLUMNS } from '../constants/actionTypes';

export function setOrientation(orientation) {
  return {
    type: ORIENTATION.SET,
    payload: orientation,
  };
}

export function setIllustColumns(value) {
  return {
    type: ILLUST_COLUMNS.SET,
    payload: value,
  };
}
