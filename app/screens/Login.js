import React, { Component } from 'react';
import { Text, View, Image, Alert, StyleSheet, Dimensions, ImageBackground, Keyboard, TouchableOpacity, Modal, ActivityIndicator} from 'react-native';
import PhoneInput from 'react-native-phone-input';
import { SocialIcon, Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import FBSDK, { LoginManager, } from 'react-native-fbsdk';
import {facebookService} from './FacebookService';
import DeviceInfo from 'react-native-device-info';

const { AccessToken } = FBSDK

export default class Login extends Component<Props> {
constructor(props) {
  super(props)
  this.fblogin = this.fblogin.bind(this)
  this.state = {
    status: 1,
    phonenumber: null,
    uniqueId: null,
    Indicator: false,
    name: '',
    email: '',
    tokin: '',
    user_id: '',
    bb: 1,
  }
}

static navigationOptions = {
  header : null   
};

async componentDidMount() {
  this.setState({uniqueId:DeviceInfo.getUniqueID()});
}

async phonelogin(){
  await AsyncStorage.setItem('Login_Type', '1')
  Keyboard.dismiss();
  if( this.state.phonenumber.length == 13){
    this.setState({Indicator: true})
    try{
      const response = await fetch('https://autevo.net/Api/Login?loginType=1&phone='+this.state.phonenumber+'&device_token='+this.state.uniqueId+'')
      const json = await response.json()
      if(json.status == 1){
        await AsyncStorage.setItem('User_Id', (json.user_id).toString())
        if(json.name != null){
          await AsyncStorage.setItem('User_Name', (json.name).toString())
        }else{
          await AsyncStorage.setItem('User_Name', '')
        }
        if(json.image != null){
          await AsyncStorage.setItem('User_Image', (json.image).toString())
        }else{
          await AsyncStorage.setItem('User_Image', '')
        }
        await AsyncStorage.setItem('User_Token', (json.tokin).toString())
        this.setState({Indicator: false})
        this.props.navigation.navigate('App')
      } if(json.status == 2){
        await AsyncStorage.setItem('User_Id', (json.user_id).toString())
        this.setState({Indicator: false})
        this.props.navigation.navigate('Verification', {
          phoneNumber: (this.state.phonenumber),
          msg: 'Welcome Back'
        })
      }if(json.status == 4){
        await AsyncStorage.setItem('User_Id', (json.user_id).toString())
        this.setState({Indicator: false})
        this.props.navigation.navigate('Verification', {
          phoneNumber: (this.state.phonenumber),
          msg: 'Welcome Back'
        })
      }if(json.status == 3){
        await AsyncStorage.setItem('User_Id', (json.user_id).toString())
        this.setState({Indicator: false})
        this.props.navigation.navigate('Verification', {
          phoneNumber: (this.state.phonenumber),
          msg: 'Welcome to our Family'
        })
      }
    }catch{
      console.log("Error retrieving data" + error);
    }
  }else{
    Alert.alert("Wrong Number")
  }
}

async initUser(token) {
  fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + token)
  .then((response) => response.json())
  .then(async(json) => { 
    // Alert.alert(json)
    // Some user object has been set up somewhere, build that user here
    await AsyncStorage.setItem('User_Name', (json.name))
    await AsyncStorage.setItem('User_Email', (json.email).toString())
    this.setState({name: json.name, email: json.email})
  })
  .catch(() => {
    reject('ERROR GETTING DATA FROM FACEBOOK')
  })
}

async getautevoid(){
  const fbid = await AsyncStorage.getItem('Facebook_Id');
  try{//Alert.alert('99')
    const response = await fetch('https://autevo.net/Api/Login?loginType=2&facebook_id='+fbid+'');
    const json = await response.json()
    // Alert.alert(json)
    if(json.msg == 1){
      await AsyncStorage.setItem('User_Token', (json.tokin).toString());
      await AsyncStorage.setItem('User_Id', (json.user_id).toString());
      await AsyncStorage.setItem('User_Image', ('https://graph.facebook.com/'+fbid+'/picture').toString());
      this.setState({user_id: json.user_id, tokin: json.tokin});
    }
  }catch{
    // console.log("Error retrieving data" + Error.message);
  }
}

async updateinfo(){
  try{
    const response = await fetch('https://autevo.net/Api/UpdateProfile?user_id='+this.state.user_id+'&token='+this.state.tokin+'&name='+this.state.name+'&email='+this.state.email+'&city_id=1');
    const json = await response.json()
  }catch(error){

  }
}

async fblogin(accessToken) {
  this.setState({bb: 0})
  AsyncStorage.setItem('Login_Type', '2')
  AccessToken.getCurrentAccessToken()
    .then(async(data) => {
      await AsyncStorage.setItem('Facebook_Id', (data.userID).toString());
    }).catch(error => {
      console.log(error)
    })
    await AsyncStorage.setItem('Facebook_Token', (accessToken).toString());
    await this.initUser(accessToken)
    await this.getautevoid()
    await this.updateinfo()
    await this.props.navigation.navigate('App')
}

render() {
  return (
    <ImageBackground source={require('../assets/images/pattern.png')} style={{width:'100%',height:'100%'}}>	
        <View style={ styles.logoV }>
          <Image source={require('../assets/images/logo.png')} style={{marginTop:30,height: 100, width: 200,resizeMode: 'contain'}}/>
        </View>	
        <View style={styles.inputeV} display={this.state.bb == 1 ? 'flex' : 'none'}>
          <View style={{flexDirection: 'row',justifyContent: 'flex-start'}}>
          <Text style={styles.fontText}>Enter Your Mobile Number </Text><Icon name="call" style={{width:15, hieght:10,resizeMode: 'contain'}}></Icon>
          </View>

          <PhoneInput style={styles.phoneInput} ref='phone' initialCountry='eg' onChangePhoneNumber={ (p) => this.setState({phonenumber: p, status: 2})} 
          flagStyle={{margin:(width/20),}}/>
                                        {/* Switch between (or text - Fb Button ) and (Login Button)        */}
          <View display={this.state.status == 1 ? 'flex' : 'none'}>
          <View style={styles.Text}>
              <Text style={styles.textOr}> Or </Text>
          </View>
          <View style={{width:(width-(width/5)), height:(height/20), backgroundColor:'rgb(66,103,178)', justifyContent:'center', 
          alignItems:'center', borderRadius:6, marginTop:(height/30)}}>
            {facebookService.makeLoginButton((accessToken) => {
              this.fblogin(accessToken)
            })}
          </View>
          </View>
          
          <View display={this.state.status == 2 ? 'flex' : 'none'}>
          <TouchableOpacity style={{width:(width-(width/5)), height:(height/15), backgroundColor:'rgb(28,152,207)', 
          borderRadius:6, justifyContent:'center', marginTop:(height/30)}} onPress= { () => {this.phonelogin()}}>
            <Text style={{fontSize:22, fontWeight:'600', color:'white', textAlign: "center"}}>Login</Text>
          </TouchableOpacity>
          </View>
        </View>
                                          {/* Progerss Ring during Loading */}
        <Modal
            transparent={true}
            animationType={'none'}
            visible={this.state.Indicator}
            onRequestClose={() => {console.log('close modal')}}>
            <View style={styles.modalBackground}>
              <View style={styles.activityIndicatorWrapper}>
                <ActivityIndicator
                  animating={this.state.Indicator} color="#rgb(28,152,207)"/>
              </View>
            </View>
          </Modal>
    </ImageBackground>  
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

  logoV: {
    flex: 1,
    justifyContent: 'center',
    height: (height/3),
    alignItems: 'center',
    marginBottom:(height /20),
  },

  inputeV: {
    // flex: 1,
    marginBottom : (height/10),
    marginLeft : (width / 10),
    // justifyContent: 'center',
    height: (height/2),
    // position: 'relative',
  },

  fontText: {
    fontWeight: 'bold',
    fontSize:15,
  },

  Text:{
    marginTop:20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textOr: {
    marginRight:(width/10),
    fontWeight: 'bold',
    fontSize:20,
  },

  phoneInput:{
    marginTop:20,
    width: "90%",
    height:50,
    flexShrink:3,
    borderColor: '#ecebed', 
    borderWidth: 1,
    backgroundColor: 'rgb(255,255,255)',
    borderRadius:6
  },

  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },

  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },

});