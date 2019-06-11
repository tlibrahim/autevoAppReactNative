import React, { Component } from 'react';
import { Dimensions, View, Image, StyleSheet, ImageBackground, ActivityIndicator, StatusBar, Alert } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage'
import FBSDK from 'react-native-fbsdk'

const { AccessToken } = FBSDK

export default class Start extends Component<Props> {
  constructor() {
    super();
    this.state = {
      accessToken: null,
      isLogined: false,
    }
  }

  async componentDidMount(){
    SplashScreen.hide()
    const a = await AsyncStorage.getItem('User_Token')
    const b = await AsyncStorage.getItem('Facebook_Token')
    if(a != null || b != null ){//Alert.alert("TesT")
    if(a != null){//Alert.alert('1')
      const _userToken = await AsyncStorage.getItem('User_Token');
      const _userID = await AsyncStorage.getItem('User_Id');
      if(_userID != null && _userToken != null){
      this.setState({isLogined: true})
      }
    }if(b != null){
      const fbid = await AsyncStorage.getItem('Facebook_Id');
      if( fbid != null){
      //   try{//Alert.alert('99')
      //   const response = await fetch('https://autevo.net/Api/Login?loginType=2&facebook_id='+fbid+'');
      //   const json = await response.json()
      //   // Alert.alert(json)
      //   if(json.msg == 1){
      //     const _userToken = await AsyncStorage.setItem('User_Token', (json.tokin).toString());
      //     const _userID = await AsyncStorage.setItem('User_Id', (json.user_id).toString());
      //     if(json.name != null){
      //       await AsyncStorage.setItem('User_Name', (json.name).toString())
      //     }else{
      //       await AsyncStorage.setItem('User_Name', '')
      //     }
      //     if(json.image != null){
      //       await AsyncStorage.setItem('User_Image', (json.image).toString())
      //     }else{
      //       await AsyncStorage.setItem('User_Image', '')
      //     }
      //     if(_userID != null && _userToken != null){
      //       this.setState({isLogined: true})
      //     }
      //   }
      // }catch{
      //   // console.log("Error retrieving data" + Error.message);
      // }
      const _userToken = await AsyncStorage.getItem('User_Token');
      const _userID = await AsyncStorage.getItem('User_Id');
      if(_userID != null && _userToken != null){
      this.setState({isLogined: true})
      }
    }
  }
  }else{
    this.setState({isLogined: false})
  }
  // This will switch to the App screen or Auth screen and this loading
  // screen will be unmounted and thrown away.
  this.props.navigation.navigate(this.state.isLogined ? 'App' : 'Auth');
  }

  render() {
    return (
        <View>
          <ImageBackground source={require('../assets/images/pattern.png')} style={{width: width,height: height}}> 
            <View style={ styles.logo }>
              <Image source={require('../assets/images/logo.png')} style={{width:(width-(width/5)), resizeMode:'contain'}}/>
              <ActivityIndicator size="large" color="rgb(105,175,219)" style={{justifyContent:'center', marginTop:(height/6),}}/>
              <StatusBar barStyle="default" />
            </View> 
          </ImageBackground>  
        </View>
   		 );
  	}
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },

  logo: {
  	flex: 1,
    // justifyContent: 'center',
    height: (height/20), // 50% of screen height
    alignItems: 'center',
    marginLeft:(width/40),
    marginRight:(width/40),
    marginTop:(height/10),
  },
});
