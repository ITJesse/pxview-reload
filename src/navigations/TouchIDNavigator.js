import { StackNavigator } from 'react-navigation';
import TouchIDLogin from '../screens/Login/TouchIDLogin';
import { globalStyles, globalStyleVariables } from '../styles';
import { SCREENS } from '../common/constants';

const TouchIDNavigator = StackNavigator(
  {
    [SCREENS.TouchIDLogin]: {
      screen: TouchIDLogin,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    headerMode: 'screen',
    navigationOptions: {
      headerStyle: {
        backgroundColor: globalStyleVariables.HEADER_BACKGROUND_COLOR,
      },
      headerTintColor: globalStyleVariables.HEADER_TINT_COLOR,
      headerBackTitle: null,
    },
    cardStyle: globalStyles.card,
  },
);

export default TouchIDNavigator;
