import { StackNavigator } from 'react-navigation';
import enhanceRouter from './routers/enhanceRouter';
import MyPage from '../screens/MyPage/MyPage';
import { globalStyles, globalStyleVariables } from '../styles';
import config from '../common/config';
import { SCREENS } from '../common/constants';

const routeConfig = {
  [SCREENS.MyPage]: {
    screen: MyPage,
    navigationOptions: {
      header: null,
    },
  },
};

const stackConfig = {
  headerMode: 'screen',
  navigationOptions: {
    headerStyle: config.navigation.tab
      ? globalStyles.header
      : globalStyles.headerWithoutShadow,
    headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
    headerBackTitle: null,
  },
  cardStyle: globalStyles.card,
};

const MyPageNavigator = StackNavigator(routeConfig, stackConfig);

export default enhanceRouter(MyPageNavigator);
