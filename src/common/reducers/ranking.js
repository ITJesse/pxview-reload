import { RANKING } from '../constants/actionTypes';
import { RANKING_FOR_UI } from '../constants';

const initState = {
  loading: false,
  loaded: false,
  refreshing: false,
  items: [],
  offset: null,
  nextUrl: null,
};

function getDefaultStateForRankings() {
  return Object.keys(RANKING_FOR_UI).reduce((prev, key) => {
    prev[key] = initState;
    return prev;
  }, {});
}

export default function search(state = getDefaultStateForRankings(), action) {
  switch (action.type) {
    case RANKING.CLEAR:
      return {
        ...state,
        [action.payload.rankingMode]: initState,
      };
    case RANKING.CLEAR_ALL:
      return getDefaultStateForRankings();
    case RANKING.REQUEST:
      return {
        ...state,
        [action.payload.rankingMode]: {
          ...state[action.payload.rankingMode],
          options: action.payload.options,
          offset: action.payload.offset,
          loading: true,
          refreshing: action.payload.refreshing,
        },
      };
    case RANKING.SUCCESS:
      return {
        ...state,
        [action.payload.rankingMode]: {
          ...state[action.payload.rankingMode],
          loading: false,
          loaded: true,
          refreshing: false,
          items:
            state[action.payload.rankingMode] &&
            state[action.payload.rankingMode].items
              ? [
                  ...new Set([
                    ...state[action.payload.rankingMode].items,
                    ...action.payload.items,
                  ]),
                ]
              : action.payload.items,
          nextUrl: action.payload.nextUrl,
          timestamp: action.payload.timestamp,
        },
      };
    case RANKING.FAILURE:
      return {
        ...state,
        [action.payload.rankingMode]: {
          ...state[action.payload.rankingMode],
          loading: false,
          loaded: true,
          refreshing: false,
        },
      };
    default:
      return state;
  }
}
