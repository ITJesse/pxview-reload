import { MY_PRIVATE_BOOKMARK_ILLUSTS } from '../constants/actionTypes';

const initState = {
  loading: false,
  loaded: false,
  refreshing: false,
  items: [],
  offset: null,
  nextUrl: null,
};

export default function userIllust(state = initState, action) {
  switch (action.type) {
    case MY_PRIVATE_BOOKMARK_ILLUSTS.CLEAR:
      return initState;
    case MY_PRIVATE_BOOKMARK_ILLUSTS.REQUEST:
      return {
        ...state,
        loading: true,
        refreshing: action.payload.refreshing,
      };
    case MY_PRIVATE_BOOKMARK_ILLUSTS.SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        refreshing: false,
        items: [...new Set([...state.items, ...action.payload.items])],
        offset: action.payload.offset,
        nextUrl: action.payload.nextUrl,
        timestamp: action.payload.timestamp,
      };
    case MY_PRIVATE_BOOKMARK_ILLUSTS.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        refreshing: false,
      };
    case MY_PRIVATE_BOOKMARK_ILLUSTS.REMOVE:
      return {
        ...state,
        items: state.items.filter(item => item !== action.payload.illustId),
      };
    case MY_PRIVATE_BOOKMARK_ILLUSTS.ADD:
      return {
        ...state,
        items: [action.payload.illustId, ...state.items],
      };
    default:
      return state;
  }
}
