import React from 'react';
import {Dimensions} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Settings from './Settings';
import Remote from './Remote';
import Favourites from './Favourites';
import {Icon} from 'react-native-elements';
const {width} = Dimensions.get('screen');
// design for bottom tab navigator
const TabNavigator = createBottomTabNavigator(
  {
    Settings: {
      screen: Settings,
      navigationOptions: {
        tabBarLabel: 'Settings',
        tabBarIcon: ({tintColor}) => (
          <Icon
            name="person"
            type="material"
            color={tintColor}
            size={width / 19}
          />
        ),
      },
    },
    Remote: {
      screen: Remote,
      navigationOptions: {
        tabBarLabel: 'Remote',
        tabBarIcon: ({tintColor}) => (
          <Icon
            name="apps"
            type="material"
            color={tintColor}
            size={width / 19}
          />
        ),
      },
    },
    Favourites: {
      screen: Favourites,
      navigationOptions: {
        tabBarLabel: 'Favourites',

        tabBarIcon: ({tintColor}) => (
          <Icon name="favorite" color={tintColor} size={width / 19} />
        ),
      },
    },
  }, //background changed into black
  {
    initialRouteName: 'Remote',
    tabBarOptions: {
      activeTintColor: 'white',
      style: {backgroundColor: 'black', marginVertical: -20},
    },
  },
);
//design end
export default Appcontainer = createAppContainer(TabNavigator);
