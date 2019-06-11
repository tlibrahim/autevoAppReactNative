import React, { Component } from 'react';
import { createBottomTabNavigator, createAppContainer, createStackNavigator} from 'react-navigation';
import Home from './Home';
import Location from './Location';
import Wallet from './Wallet';
import Packages from './Packages';
import PackageDetailes from './PackageDetailes';

const BottomPackages = createStackNavigator(
  {
    Home		          : Home,
    Location 	        : Location,
    Wallet 	          : Wallet,
    Packages 	        : Packages,
    PackageDetailes 	: PackageDetailes,
  },
  {
    initialRouteName: 'Wallet',
  }
);
export default createAppContainer(BottomPackages);