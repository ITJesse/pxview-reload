import { StackNavigator } from 'react-navigation';
import Trending from '../screens/Trending/Trending';
import enhanceRouter from './routers/enhanceRouter';
import { globalStyles, globalStyleVariables } from '../styles';
import config from '../common/config';
import { SCREENS } from '../common/constants';

const routeConfig = {
  [SCREENS.Trending]: {
    screen: Trending,
    navigationOptions: {
      header: null,
    },
  },
};

const stackConfig = {
  navigationOptions: {
    headerStyle: config.navigation.tab
      ? globalStyles.header
      : globalStyles.headerWithoutShadow,
    headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
    headerBackTitle: null,
  },
  cardStyle: globalStyles.card,
  headerMode: 'screen',
};

const TrendingNavigator = StackNavigator(routeConfig, stackConfig);

export default enhanceRouter(TrendingNavigator);
