import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ToggleSwitch from 'toggle-switch-react-native'
import {facebookService} from './FacebookService'
import FBSDK from 'react-native-fbsdk';
const { LoginButton, AccessToken, GraphRequest, GraphRequestManager, LoginManager } = FBSDK

export default class Settings extends Component<Props> {
constructor(props) {
    super(props);
    this.state = {
      confirmationtogglestatus: true,
      donetogglestatus: true,
      promotiontogglestatus: true,
    }
  }

async componentDidMount() {
  try {
  } catch (error) {
    console.log("Error retrieving data" + error);
  }
}

static navigationOptions = ({navigation}) => ({
  headerTitle: (
    'Settings'
  ),
  headerRight: (
    <TouchableOpacity onPress={ () => {navigation.goBack()}}>
      <Image source={require('../assets/images/x.png')} style={{marginRight:16,height: 30, width: 20,resizeMode: 'contain'}}/>
    </TouchableOpacity>
  ),
  headerLeft: null,
  tabBarVisible: false,
});

async changeconfirmation(isOn){
  await AsyncStorage.setItem('ConfirmationNotificatios', (isOn).toString());
}

async changedone(isOn){
  await AsyncStorage.setItem('DoneNotificatios', (isOn).toString());
}

async changepromotion(isOn){
  await AsyncStorage.setItem('PromotionNotificatios', (isOn).toString());
}

async signout(){
  const id = await AsyncStorage.getItem('Facebook_Id');
  if(id != null){
    // {facebookService.makeLoginButton((accessToken) => {
    // })}
    LoginManager.logOut();
  }
  await AsyncStorage.clear();
  this.props.navigation.navigate('Auth');
}

render() {
  return (
    <ImageBackground style={styles.background}>
      <View style={{width:(width-(width/10)), height:(height), marginTop:(height/20), marginLeft:(width/20), }}>
        <Text style={{fontWeight:'bold', fontSize:22}}>Notifications Settings</Text>
        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:(height/40), height:(height/20)}}>
          <Text style={{fontWeight:'400', fontSize:15}}>Confirmation Notificatios</Text>
          <ToggleSwitch
            isOn={this.state.confirmationtogglestatus}
            onColor='rgb(29,156,201)'
            offColor='gray'
            onToggle={ confirmationtogglestatus => {this.setState({confirmationtogglestatus}); this.changeconfirmation(confirmationtogglestatus)} }
          />
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:(height/40), height:(height/20)}}>
          <Text style={{fontWeight:'400', fontSize:15}}>Done Notifications</Text>
          <ToggleSwitch
            isOn={this.state.donetogglestatus}
            onColor='rgb(29,156,201)'
            offColor='gray'
            onToggle={ donetogglestatus => {this.setState({donetogglestatus}); this.changedone(donetogglestatus)} }
          />
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:(height/40), height:(height/20)}}>
          <Text style={{fontWeight:'400', fontSize:15}}>Promotion Notifications</Text>
          <ToggleSwitch
            isOn={this.state.promotiontogglestatus}
            onColor='rgb(29,156,201)'
            offColor='gray'
            onToggle={ promotiontogglestatus => {this.setState({promotiontogglestatus}); this.changepromotion(promotiontogglestatus)} }
          />
        </View>
        <View style={{backgroundColor:'rgb(233,239,242)', height:1, width:(width-(width/10)), borderRedius:2, marginTop:(height/40)}}></View>
        <TouchableOpacity style={{marginTop:(height/40), height:(height/20), marginTop:(height/40)}} onPress={ () => this.signout()}>
          <Text style={{color:'rgb(255,100,124)', fontWeight:'bold', fontSize:18}}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
    );
  }
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  background:{
    backgroundColor:'rgb(255,255,255)',
    width:width,
    height:height,
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'stretch',
  },

});