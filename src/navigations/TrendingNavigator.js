import { StackNavigator } from 'react-navigation';
import Trending from '../screens/Trending/Trending';
import enhanceRouter from './routers/enhanceRouter';
import { globalStyles, globalStyleVariables } from '../styles';
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
    headerStyle: globalStyles.header,
    headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
    headerBackTitle: null,
  },
  cardStyle: globalStyles.card,
  headerMode: 'screen',
};

const TrendingNavigator = StackNavigator(routeConfig, stackConfig);

export default enhanceRouter(TrendingNavigator);
