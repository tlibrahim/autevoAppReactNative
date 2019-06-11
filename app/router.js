import React, { Component } from 'react';
import { Dimensions, Platform, Image, StatusBar, ActivityIndicator, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator, createAppContainer, createStackNavigator, createSwitchNavigator} from 'react-navigation';

import Start from './screens/Start.js';
import Login from './screens/Login.js';
import Profile from './screens/Profile';
import Home from './screens/Home';
import Wallet from './screens/Wallet';
import Verification from './screens/Verification';
import Myorders from './screens/Myorders';

const TabNavigator = createBottomTabNavigator({
  Home: {
            screen: Home,
            navigationOptions: ({ navigation }) => ({
            	labelStyle:{fontWeight:'bold'},
                tabBarIcon: ({ focused, tintColor }) => {
                    return <Image source={ (focused)
                        ? require('./assets/images/home.png')
                        : require('./assets/images/homeInactive.png')} 
                        style={{height:20, width: 20,resizeMode: 'contain'}}/>
                }
            })
        },	
  MyOrders: {
            screen: Myorders,
            navigationOptions: ({ navigation }) => ({
            	labelStyle:{fontWeight:'bold'},
                tabBarIcon: ({ focused, tintColor }) => {
                    return <Image source={ (focused)
                        ? require('./assets/images/myorder.png')
                        : require('./assets/images/myorderInactive.png')} 
                        style={{height:20, width: 20,resizeMode: 'contain'}}/>
                }
		     })
		 },	
  Wallet: {
            screen: Wallet,
            navigationOptions: ({ navigation }) => ({
            	labelStyle:{fontWeight:'bold'},
                tabBarIcon: ({ focused, tintColor }) => {
                    return <Image source={ (focused)
                        ? require('./assets/images/wallet.png')
                        : require('./assets/images/walletInactive.png')} 
                        style={{height:20, width: 20,resizeMode: 'contain'}}/>
                }
             })
        },
   Profile: {
            screen: Profile,
            navigationOptions: ({ navigation }) => ({
            	labelStyle:{fontWeight:'bold'},
                tabBarIcon: ({ focused, tintColor }) => {
                    return <Image source={ (focused)
                        ? require('./assets/images/profile.png')
                        : require('./assets/images/profileInactive.png')} 
                        style={{height:20, width: 20,resizeMode: 'contain'}}/>
                }
             })
        },	      	
},
{
  tabBarOptions: {
    activeTintColor: 'rgb(27,156,204)',
    inactiveTintColor: 'rgb(136,150,156)',
  },
}
);

const LoginNavigator = createStackNavigator({
        Login: {
            screen: Login,
        },
        Verification:{
            screen: Verification,
        }
})

// export default createAppContainer(TabNavigator);

export default createAppContainer(createSwitchNavigator(
    {
      AuthLoading: Start,
      App: TabNavigator,
      Auth: LoginNavigator,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  ));