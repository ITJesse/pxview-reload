import React from 'react';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import { Icon } from 'react-native-elements';
import HomeNavigator from './HomeNavigator';
import RankingNavigator from './RankingNavigator';
import TrendingNavigator from './TrendingNavigator';
import NewWorksNavigator from './NewWorksNavigator';
import MyPageNavigator from './MyPageNavigator';
import { SCREENS } from '../common/constants';

const renderTabBarIcon = (tintColor, focused, name, iconType) => (
  <Icon
    name={name}
    type={iconType || 'font-awesome'}
    size={24}
    color={tintColor}
  />
);

const AppTabNavigator = TabNavigator(
  {
    [SCREENS.HomeTab]: {
      screen: HomeNavigator,
      navigationOptions: ({ screenProps: { i18n } }) => ({
        tabBarLabel: i18n.home,
        tabBarIcon: ({ tintColor, focused }) =>
          renderTabBarIcon(tintColor, focused, 'home'),
      }),
    },
    [SCREENS.RankingTab]: {
      screen: RankingNavigator,
      navigationOptions: ({ screenProps: { i18n } }) => ({
        tabBarLabel: i18n.ranking,
        tabBarIcon: ({ tintColor, focused }) =>
          renderTabBarIcon(tintColor, focused, 'trophy'),
      }),
    },
    [SCREENS.TrendingTab]: {
      screen: TrendingNavigator,
      navigationOptions: ({ screenProps: { i18n } }) => ({
        tabBarLabel: i18n.search,
        tabBarIcon: ({ tintColor, focused }) =>
          renderTabBarIcon(tintColor, focused, 'search'),
      }),
    },
    [SCREENS.NewWorksTab]: {
      screen: NewWorksNavigator,
      navigationOptions: ({ screenProps: { i18n } }) => ({
        tabBarLabel: i18n.newest,
        tabBarIcon: ({ tintColor, focused }) =>
          renderTabBarIcon(tintColor, focused, 'fiber-new', 'material'),
      }),
    },
    [SCREENS.MyPageTab]: {
      screen: MyPageNavigator,
      navigationOptions: ({ screenProps: { i18n } }) => ({
        tabBarLabel: i18n.myPage,
        tabBarIcon: ({ tintColor, focused }) =>
          renderTabBarIcon(tintColor, focused, 'user'),
      }),
    },
  },
  {
    headerMode: 'none',
    swipeEnabled: false,
    animationEnabled: false,
    lazy: false,
    tabBarPosition: 'bottom',
    tabBarComponent: props => (
      <TabBarBottom
        {...props}
        getTestIDProps={scene => ({
          testID: scene.route.key,
        })}
      />
    ),
    tabBarOptions: {
      activeTintColor: 'rgb(59,89,152)',
      inactiveTintColor: 'rgb(204,204,204)',
      showIcon: true,
      showLabel: true,
      style: {
        height: 48,
        paddingBottom: 2,
      },
      bottomNavigationOptions: {
        style: {
          borderTopWidth: 0,
          elevation: 8,
        },
        labelColor: 'rgb(59,89,152)',
        tabs: {
          HomeTab: {
            testID: 'homeTab',
          },
          RankingTab: {
            testID: 'RankingTab',
            // barBackgroundColor: '#EEEEEE',
          },
          TrendingTab: {
            // barBackgroundColor: '#EEEEEE',
            // barBackgroundColor: '#EEEEEE',
            // labelColor: '#434343',
          },
          NewWorksTab: {
            // barBackgroundColor: '#EEEEEE',
          },
          MyPageTab: {
            // barBackgroundColor: '#EEEEEE',
          },
        },
      },
    },
  },
);

export default AppTabNavigator;
