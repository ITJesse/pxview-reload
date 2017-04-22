import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import equals from 'shallow-equals';
import { denormalize } from 'normalizr';
import { denormalizedData } from '../helpers/normalizrHelper';
import Schemas from '../constants/schemas';

function defaultEqualityCheck(currentVal, previousVal) {
  return currentVal === previousVal
}

// function resultCheckMemoize (func, resultCheck = defaultEqualityCheck, argsCheck = defaultEqualityCheck) {
//   let lastArgs = null
//   let lastResult = null
//   return (...args) => {
//     if (lastArgs !== null &&
//       lastArgs.length === args.length &&
//       args.every((value, index) => argsCheck(value, lastArgs[index]))) {
//       return lastResult
//     }
//     lastArgs = args
//     let result = func(...args)
//     return resultCheck(lastResult, result) ? lastResult : (lastResult = result)
//   }
// }

function specialMemoize(func, resultEqCheck, argEqCheck = defaultEqualityCheck) {
  let lastArgs = null
  let lastResult = null
  const isEqualToLastArg = (value, index) => argEqCheck(value, lastArgs[index])
  return (...args) => {
    if (
      lastArgs === null ||
      lastArgs.length !== args.length ||
      !args.every(isEqualToLastArg)
    ) {
      // Only update result if it has changed according to resultEqCheck
      const nextResult = func(...args)
      if (!resultEqCheck(lastResult, nextResult)) {
        lastResult = nextResult
      }
    }
    lastArgs = args
    return lastResult
  }
}

const getState = (state) => state;
const getProps = (state, props) => props;
const getPropsRankingMode = (state, props) => props.rankingMode
const selectEntities = (state) => state.entities;
const selectRanking = (state) => state.ranking;
const selectRecommendedIllusts = state => state.recommendedIllusts;
const selectRecommendedMangas = state => state.recommendedMangas;
const selectTrendingIllustTags = state => state.trendingIllustTags;
const selectRecommendedUsers = state => state.recommendedUsers;

export const getAuthUser = state => state.auth.user;

const createIllustItemsSelector = createSelectorCreator(specialMemoize, (prev, next) => {
  console.log(equals(prev, next, (p, n) => {
    return (p.id === n.id) && (p.is_bookmarked === n.is_bookmarked) && (p.user.is_followed === n.user.is_followed)
  }));
  return equals(prev, next, (p, n) => {
    return (p.id === n.id) && (p.is_bookmarked === n.is_bookmarked) && (p.user.is_followed === n.user.is_followed) 
  });
});

export const makeGetRankingItems = () => {
  return createIllustItemsSelector([selectRanking, selectEntities, getProps], (ranking, entities, props) => {
    return denormalize(ranking[props.rankingMode].items, Schemas.ILLUST_ARRAY, entities)
  });
}


// const getIntermediateRankingItems = createIllustItemsSelector([selectRanking, selectEntities, getProps], (ranking, entities, props) => {
//   return denormalize(ranking[props.rankingMode].items, Schemas.ILLUST_ARRAY, entities)
// });

export const getRecommendedIllustsItems = createIllustItemsSelector([selectRecommendedIllusts, selectEntities], (recommendedIllusts, entities) => {
  return denormalize(recommendedIllusts.items, Schemas.ILLUST_ARRAY, entities)
})

export const getRecommendedMangasItems = createIllustItemsSelector([selectRecommendedMangas, selectEntities], (recommendedMangas, entities) => {
  return denormalize(recommendedMangas.items, Schemas.ILLUST_ARRAY, entities)
})

export const getTrendingIllustTagsItems = createSelector([selectTrendingIllustTags, selectEntities], (trendingIllustTags, entities) => {
  return denormalize(trendingIllustTags.items, Schemas.ILLUST_TAG_ARRAY, entities)
})

export const getRecommendedUsersItems = createSelector([selectRecommendedUsers, selectEntities], (recommendedUsers, entities) => {
  return denormalize(recommendedUsers.items, Schemas.USER_PREVIEW_ARRAY, entities)
})
