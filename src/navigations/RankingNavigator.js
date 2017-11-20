import { StackNavigator } from 'react-navigation';
import Ranking from '../screens/Ranking/Ranking';
import enhanceRouter from './routers/enhanceRouter';
import { globalStyles, globalStyleVariables } from '../styles';
import { SCREENS } from '../common/constants';

const routeConfig = {
  [SCREENS.Ranking]: {
    screen: Ranking,
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

const RankingNavigator = StackNavigator(routeConfig, stackConfig);

export default enhanceRouter(RankingNavigator);
