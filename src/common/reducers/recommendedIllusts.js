import { RECOMMENDED_ILLUSTS } from '../constants/actionTypes';

const initState = {
  loading: false,
  loaded: false,
  refreshing: false,
  items: [],
  offset: 0,
  url: null,
  nextUrl: null,
};

export default function recommendedIllusts(state = initState, action) {
  switch (action.type) {
    case RECOMMENDED_ILLUSTS.CLEAR:
      return initState;
    case RECOMMENDED_ILLUSTS.REQUEST:
      return {
        ...state,
        loading: true,
        refreshing: action.payload.refreshing,
        url: action.payload.url,
      };
    case RECOMMENDED_ILLUSTS.SUCCESS:
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
    case RECOMMENDED_ILLUSTS.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        refreshing: false,
      };
    default:
      return state;
  }
}
