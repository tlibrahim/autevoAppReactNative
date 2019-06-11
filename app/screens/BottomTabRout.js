import React, { Component } from 'react';
import { createBottomTabNavigator, createAppContainer, createStackNavigator} from 'react-navigation';
import Home from './Home';
import Location from './Location';
import DateTime from './DateTime';
import Services from './Services';
import Car 		from './Car'; 
import Payment from './Payment';
import Confirmation from './Confirmation';
import Wallet from './Wallet';

const BottomTabRout = createStackNavigator(
  {
    Home		  : Home,
    Location 	: Location,
    DateTime 	: DateTime,
    Services 	: Services,
    Car 		  : Car,
    Payment 	: Payment,
    Wallet 	  : Wallet,
    // Confirmation: Confirmation,
  },
  {
    initialRouteName: 'Home',
  }
);
export default createAppContainer(BottomTabRout);