import { ORIENTATION, ILLUST_COLUMNS } from '../constants/actionTypes';

export default function orientation(
  state = {
    orientation: 'PORTRAIT',
    illustColumns: 3,
  },
  action = {},
) {
  switch (action.type) {
    case ORIENTATION.SET: {
      return {
        ...state,
        orientation: action.payload,
      };
    }
    case ILLUST_COLUMNS.SET: {
      return {
        ...state,
        illustColumns: action.payload,
      };
    }
    default:
      return state;
  }
}
