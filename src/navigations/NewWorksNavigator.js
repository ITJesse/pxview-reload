import { StackNavigator } from 'react-navigation';
import NewWorks from '../screens/NewWorks/NewWorks';
import enhanceRouter from './routers/enhanceRouter';
import { globalStyles, globalStyleVariables } from '../styles';
import { SCREENS } from '../common/constants';

const routeConfig = {
  [SCREENS.NewWorks]: {
    screen: NewWorks,
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

const NewWorksNavigator = StackNavigator(routeConfig, stackConfig);

export default enhanceRouter(NewWorksNavigator);
