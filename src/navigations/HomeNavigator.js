import { StackNavigator } from 'react-navigation';
import enhanceRouter from './routers/enhanceRouter';
import Home from '../screens/Home/Home';
import { globalStyles, globalStyleVariables } from '../styles';
import config from '../common/config';
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
    headerStyle: config.navigation.tab
      ? globalStyles.header
      : globalStyles.headerWithoutShadow,
    headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
    headerBackTitle: null,
  },
  cardStyle: globalStyles.card,
  headerMode: 'screen',
};

const HomeNavigator = StackNavigator(routeConfig, stackConfig);

export default enhanceRouter(HomeNavigator);
