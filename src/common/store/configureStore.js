import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import invariant from 'redux-immutable-state-invariant';
import { persistStore, autoRehydrate, createTransform } from 'redux-persist';
import { REHYDRATE } from 'redux-persist/constants';
import createActionBuffer from 'redux-action-buffer';
import applyAppStateListener from 'redux-enhancer-react-native-appstate';
import { AsyncStorage } from 'react-native';
import rootReducer from '../reducers';
import rootSaga from '../sagas';

export default function configureStore() {
  let enhancer;
  const sagaMiddleware = createSagaMiddleware();
  if (process.env.NODE_ENV !== 'production') {
    const composeEnhancers =
      // eslint-disable-next-line no-underscore-dangle
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(
      autoRehydrate({ log: true }),
      applyAppStateListener(),
      applyMiddleware(
        invariant(),
        createActionBuffer(REHYDRATE),
        sagaMiddleware,
      ),
      // devTools(),
    );
  } else {
    enhancer = compose(
      autoRehydrate(),
      applyAppStateListener(),
      applyMiddleware(createActionBuffer(REHYDRATE), sagaMiddleware),
    );
  }
  const store = createStore(rootReducer, undefined, enhancer);
  sagaMiddleware.run(rootSaga);

  const myTransform = createTransform(
    (inboundState, key) => {
      switch (key) {
        case 'entities': {
          const {
            entities,
            browsingHistory,
            myPrivateBookmarkIllusts,
            userBookmarkIllusts,
            followingUserIllusts,
            walkthroughIllusts,
            trendingIllustTags,
            recommendedIllusts,
            recommendedMangas,
            recommendedUsers,
            userFollowing,
            newIllusts,
            newMangas,
            myPixiv,
            muteUsers,
            ranking,
          } = store.getState();
          const selectedUsersEntities = {};
          let savedItemList = [
            ...browsingHistory.items,
            ...followingUserIllusts.items,
            ...walkthroughIllusts.items,
            ...trendingIllustTags.illusts,
            ...recommendedIllusts.items,
            ...recommendedMangas.items,
            ...newIllusts.items,
            ...newMangas.items,
            ...myPixiv.items,
            ...recommendedUsers.illusts,
            ...myPrivateBookmarkIllusts.items,
          ];
          Object.keys(ranking).forEach(rankingKey => {
            savedItemList = [...savedItemList, ...ranking[rankingKey].items];
          });
          Object.keys(userBookmarkIllusts).forEach(userId => {
            savedItemList = [
              ...savedItemList,
              ...userBookmarkIllusts[userId].items,
            ];
          });
          let selectedIllustsEntities = savedItemList
            .filter(id => entities.illusts[id])
            .reduce((prev, id) => {
              prev[id] = entities.illusts[id];
              const userId = entities.illusts[id].user;
              selectedUsersEntities[userId] = entities.users[userId];
              return prev;
            }, {});

          const selectedUsersEntities2 = muteUsers.items
            .filter(id => entities.users[id])
            .reduce((prev, id) => {
              prev[id] = entities.users[id];
              return prev;
            }, {});
          const selectedUsersEntities3 = recommendedUsers.items
            .filter(id => entities.users[id])
            .reduce((prev, id) => {
              prev[id] = entities.users[id];
              return prev;
            }, {});
          let finalSelectedUsersEntities = {
            ...selectedUsersEntities,
            ...selectedUsersEntities2,
            ...selectedUsersEntities3,
          };

          Object.keys(userFollowing).forEach(type => {
            Object.keys(userFollowing[type]).forEach(userId => {
              const users = userFollowing[type][userId].items.filter(
                id => entities.users[id],
              );
              const usersIllustsEntities = {};
              Object.keys(entities.illusts).forEach(illustId => {
                if (users.indexOf(entities.illusts[illustId].user) !== -1)
                  usersIllustsEntities[illustId] = entities.illusts[illustId];
              });
              const usersEntities = users.reduce((prev, id) => {
                prev[id] = entities.users[id];
                return prev;
              }, {});
              finalSelectedUsersEntities = {
                ...finalSelectedUsersEntities,
                ...usersEntities,
              };
              selectedIllustsEntities = {
                ...selectedIllustsEntities,
                ...usersIllustsEntities,
              };
            });
          });
          return {
            ...inboundState,
            illusts: selectedIllustsEntities,
            users: finalSelectedUsersEntities,
          };
        }
        case 'browsingHistory': {
          const { entities, browsingHistory } = store.getState();
          return {
            ...inboundState,
            items: browsingHistory.items.filter(id => entities.illusts[id]),
          };
        }
        default:
          return inboundState;
      }
    },
    outboundState => outboundState,
    { whitelist: ['entities', 'browsingHistory', 'muteUsers'] },
  );

  persistStore(store, {
    whitelist: [
      'myPrivateBookmarkIllusts',
      'followingUserIllusts',
      'userBookmarkIllusts',
      'walkthroughIllusts',
      'trendingIllustTags',
      'recommendedIllusts',
      'recommendedMangas',
      'recommendedUsers',
      'browsingHistory',
      'highlightTags',
      'userFollowing',
      'searchHistory',
      'newIllusts',
      'newMangas',
      'myPixiv',
      'ranking',
      'touchid',
      'muteTags',
      'muteUsers',
      'entities',
      'auth',
      'i18n',
    ],
    storage: AsyncStorage,
    transforms: [myTransform],
  });
  if (module.hot) {
    module.hot.accept('../reducers', () => store.replaceReducer(rootReducer));
  }

  return store;
}
