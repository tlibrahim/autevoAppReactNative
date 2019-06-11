import React, { Component } from 'react';
import { Text, View, Image, Alert, StyleSheet, Dimensions, ImageBackground, Keyboard, TouchableOpacity, Modal, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import OTPInputView from 'react-native-otp-input';

export default class Verification extends Component<Props> {
constructor(props) {
  super(props)
  this.state = {
    bN: null,
    _code: '',
    Indicator: false,
  }
}
static navigationOptions = ({ navigation }) => {
  return {
    title: navigation.getParam('msg', 'Welcome'),
  };
};

async componentDidMount() {
  const { navigation } = this.props;
  const itemId = navigation.getParam('phoneNumber');
  this.setState({pN: itemId});
}

async verify(){
  this.setState({Indicator: true})
  const _id = await AsyncStorage.getItem('User_Id');
  try{
    const response = await fetch('https://autevo.net/Api/Verification?code='+this.state._code+'&user_id='+_id+'')
    this.setState({Indicator: false})
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
      await AsyncStorage.setItem('User_Phone', (this.state.pN).toString())
      this.props.navigation.navigate('App')
    } if(json.status == 0){
      Alert.alert("Wrong Number")
    }
  }catch{
    console.log("Error retrieving data" + error);
  }
}

render() {
  return (
    <ImageBackground source={require('../assets/images/pattern.png')} style={{width:'100%',height:'100%'}}>	
        <View style={{width:((width)-(width/10)), height:(height/2),marginTop:(height/20), marginRight:(width/20), 
          marginLeft:(width/20)}}>
          <Text style={{fontWeight:'500'}}>Verify Your Mobile Number</Text>
          <View style={{flexDirection:'row', justifyContent:"space-between", marginTop:(height/40)}}>
            <Text style={{fontSize:15, fontWeight:'bold'}}>{this.state.pN}</Text>
            <TouchableOpacity style={{backgroundColor:'rgb(210,234,245)', borderRadius:6, width:(width/6), height:(height/30), 
          alignItems:'center', justifyContent:'center'}} onPress={ () => this.props.navigation.goBack()}>
              <Text style={{fontWeight:'500', color:'rgb(28,152,207)'}}>Change</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection:'row', justifyContent:"space-between", marginTop:(height/20)}}>
            <Text style={{fontSize:15, fontWeight:'bold'}}>Verification Code</Text>
            <TouchableOpacity>
              <Text style={{fontSize:15, fontWeight:'bold', textDecorationLine:'underline', color:'rgb(28,152,207)'}}>Re-send code</Text>
            </TouchableOpacity>
          </View>
          <OTPInputView
            style={{height:(height/8), marginTop:(height/40)}}
            autoFocus={true}
            pinCount={4}
            code={this.state._code}
            autoCapitalize={false}
            keyboardType={true}  
            // codeInputFieldStyle={styles.borderStyleBase}
            // codeInputHighlightStyle={styles.borderStyleHighLighted}
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled = { (p) => {this.setState({_code: p})}}
        />
        <TouchableOpacity style={{height:(height/15), marginTop:(height/40), backgroundColor:'rgb(28,152,207)', borderRadius:6, 
      alignItems:'center', justifyContent:'center'}} onPress={ () => this.verify()}>
          <Text style={{fontSize:20, fontWeight:'600', color:'white'}}>VERIFY</Text>
        </TouchableOpacity>
        </View>
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
    height: (height/3),
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
    borderColor: 'lavender', 
    borderWidth: 1,
    backgroundColor: '#ffffff',
  },

  borderStyleBase: {
    width: (width/6),
    height: (height/10),
    borderWidth: 1,
    borderColor: 'rgb(141,203,231)',
  },

  borderStyleHighLighted: {
    borderColor: 'rgb(141,203,231)',
  },

  underlineStyleBase: {
    width: (width/6),
    height: (height/10),
    borderWidth: 1,
    borderColor: 'rgb(141,203,231)',
    borderRadius:8,
    fontWeight:'bold',
    fontSize:25,
  },

  underlineStyleHighLighted: {
    borderColor: 'rgb(141,203,231)',
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