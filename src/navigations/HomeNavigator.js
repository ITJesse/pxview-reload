import { StackNavigator } from 'react-navigation';
import enhanceRouter from './routers/enhanceRouter';
import Home from '../screens/Home/Home';
import { globalStyles, globalStyleVariables } from '../styles';
import { SCREENS } from '../common/constants';

const routeConfig = {
  [SCREENS.Home]: {
    screen: Home,
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

const HomeNavigator = StackNavigator(routeConfig, stackConfig);

export default enhanceRouter(HomeNavigator);
