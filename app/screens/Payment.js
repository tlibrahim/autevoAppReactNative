import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, Alert, ActivityIndicator, Modal } from 'react-native';
import { ProgressBar, RadioButton} from 'react-native-paper';
import Confirmation from './Confirmation';
import AsyncStorage from '@react-native-community/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class Payment extends Component<Props> {
constructor(props) {
  super(props);
  this.state = {
    checked:'first',
    value: '1',
    price: 0,
    pay_type: 1,
    request: [],
    checktype: true,
    Indicator: true,
    status: 0,
    package_name: null,
    package_image: 'null',
    package_msg: null,
    package_totalservices: null,
    package_usedservices: null,
    package_expiredate: null,
    wallet_msg: 'Not Available',
    reminingdate: null,
  }
}

async componentDidMount() {
  try {
    const value = await AsyncStorage.getItem('Price');
    const _id =  await AsyncStorage.getItem('User_Id');
    const _token =  await AsyncStorage.getItem('User_Token');
    const response = await fetch('https://autevo.net/Api/PayWallet?user_id='+_id+'&token='+_token+'')
    const json = await response.json()
    this.setState({price: value, status: json.status, package_msg:json.msg, Indicator: false, });
    if(json.status == 1){
      const remining = json.total_service - json.used_service;
      this.setState({package_name: json.package_name, package_image: json.image, package_totalservices: json.total_service, 
        package_usedservices: json.used_service, package_expiredate: json.expire_date, wallet_msg: remining+' Remaninig'});
      var msDiff = new Date(json.expire_date).getTime() - new Date().getTime();    //Future date - current date
      var daysTill = Math.floor(msDiff / (1000 * 60 * 60 * 24));
      this.setState({reminingdate: daysTill});
    }
  } catch (error) {
    console.log("Error retrieving data" + error);
  }
}

async addpayment(){
  try{
    await AsyncStorage.setItem('Payment_Type', (this.state.pay_type).toString());
  }catch (error){
    console.log("Error saving data" + error);
  }
}

async submitrequest(){
  this.setState({Indicator: true})
  try{
    const _id =  await AsyncStorage.getItem('User_Id');
    const _token =  await AsyncStorage.getItem('User_Token');
    const _city_id = await AsyncStorage.getItem('city_id');
    const _address = await AsyncStorage.getItem('Address');
    const _lat = await AsyncStorage.getItem('lat');
    const _long = await AsyncStorage.getItem('long');
    const _date = await AsyncStorage.getItem('date');
    const _time_id = await AsyncStorage.getItem('timeid');
    const _services = await AsyncStorage.getItem('Services');
    const _promo = await AsyncStorage.getItem('Promo');
    const _car_model = await AsyncStorage.getItem('Car_Model');
    const _car_color = await AsyncStorage.getItem('Car_Color');
    const _car_number = await AsyncStorage.getItem('Car_Number');
    const _car_letter = await AsyncStorage.getItem('Car_Letter');
    const number = _car_letter+_car_number;
    const response = await fetch('https://autevo.net/Api/SubscribeRequest?user_id='+_id+'&token='+_token+'&city_id='+_city_id+'&lat='+_lat+'&lang='+_long+'&adress='+_address+'&date='+_date+'&time_id='+_time_id+'&car_id='+_car_model+'&car_color='+_car_color+'&car_number='+number+'&services='+_services+'&payment_type='+this.state.pay_type+'&promoCode_id='+_promo+'&price='+this.state.price+'')
    this.setState({Indicator: false})
    const json = await response.json()
    if(json.status == 1){
      this.setState({Indicator: false})
      this.props.navigation.navigate('Confirmation')
    }else{
      Alert.alert(json.message)
    }
  }catch(error){
    console.log("Error saving data" + error);
  }
}

static navigationOptions = {
  title: 'BOOK A WASH',
};

render() {const { checked } = this.state;
  return (
    <ImageBackground style={styles.background} >  
    
      <ProgressBar progress={0.95} color={'rgb(28,152,207)'} style={{marginTop:-9, height:2}}/>

      <View style={styles.body}>
      <RadioButton.Group
      onValueChange={value => this.setState({ value })}
      value={this.state.value}>
          <Text style={styles.firstText}>Select a Payment</Text>
          <Text style={styles.scoundText}>Pay your wash with the preferable method 💰</Text>
          <View style={styles.payment}>
            <View style={styles.type}>
              <Image source={this.state.pay_type == 1 ? require('../assets/images/payment/cash.png') : require('../assets/images/payment/cashDisabled.png')}
                  style={{ marginLeft:0, marginTop: '10%',height:50, width: 50,resizeMode: 'contain'}}/>
              <View style={{marginTop:'15%'}}>
                <Text style={styles.paymentTF}>Cash</Text>
                <Text style={styles.paymentTS}>EGP {this.state.price}</Text>
              </View>
              <Text></Text>
              <View style={this.state.pay_type == 1 ? styles.btnchecked : styles.btnunchecked}>
              <RadioButton value="1" color='white' 
              theme='circle' uncheckedColor='black' backgroundColor='gray' onPress={ () => {this.setState({pay_type: 1,}); this.addpayment()}}/>
              </View>
            </View>
            <View style={styles.type}>
              <Image source={require('../assets/images/payment/creditCardDisabled.png')} 
                  style={{ marginLeft:0, marginTop: '10%',height:50, width: 50,resizeMode: 'contain'}}/>
              <View style={{marginTop:'15%'}}>
                <Text style={styles.paymentTF}>Credit Card</Text>
                <Text style={styles.paymentTS}>EGP {this.state.price}</Text>   
              </View>
              <Text></Text>
              <View style={styles.btnunchecked}>
              <RadioButton  disabled={true}/>
              </View> 
            </View>
            <View style={styles.type}>
              <Image source={this.state.pay_type == 2 ? require('../assets/images/payment/wallet.png') : require('../assets/images/payment/walletDisabled.png')}
                  style={{ marginLeft:0, marginTop: '10%',height:50, width: 50,resizeMode: 'contain'}}/>
              <View style={{marginTop:'15%'}}>
                <Text style={styles.paymentTF}>Wallet</Text>
                <Text style={styles.paymentTS}>{this.state.wallet_msg}</Text>
              </View>
              <Text></Text>
              <View style={this.state.pay_type == 2 ? styles.btnchecked : styles.btnunchecked}>
              <RadioButton value="2" color='white' style={{marginTop:'15%'}} 
              theme='circle' uncheckedColor='black' backgroundColor='gray' onPress={() => {this.setState({pay_type: 2,}); this.addpayment()}}/>
              </View>
            </View>
          </View>
          </RadioButton.Group>
      </View>

      <View style={{height:(height/4), marginBottom:(height/20), backgroundColor:'rgb(255,255,255)', borderRadius:6, width:((width)-(width/10)), marginLeft:(width/20)}} 
      display={this.state.status == 1 && this.state.pay_type == 2 ? 'flex' : 'none'}>
        <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:(height/40)}}>
          <Text style={{marginLeft:16, fontWeight:'300',}}>My Current Package</Text>
          <View style={{backgroundColor:'rgb(234,238,242)', borderRadius:10, marginRight:(width/40), justifyContent:'center'}}>
            <Text style={{fontStyle:'italic'}}>  Expires in {this.state.reminingdate} days </Text>
          </View>              
        </View>
        <View style={{flexDirection:'row', marginLeft:(height/40), marginTop:(height/80)}}>
          <Image source={{uri: this.state.package_image}} style={{width:(width/4), resizeMode:'contain'}}/>
          <View style={{marginLeft:(height/40)}}>
            <Text style={{fontWeight:'bold', fontSize:20, marginTop:(height/80)}}>{this.state.package_name}</Text>
            <Text style={{fontWeight:'100', marginTop:(height/40)}}>Remaining washes</Text>
            <Text style={{fontWeight:'bold', fontSize:22,}}><Text style={{fontWeight:'bold', fontSize:22, color:'rgb(28,152,207)'}}>{this.state.package_usedservices}</Text> / {this.state.package_totalservices}</Text>
          </View>
        </View>
      </View>

      <View style={{height:(height/4), marginBottom:(height/20), backgroundColor:'rgb(255,255,255)', borderRadius:6, width:((width)-(width/10)), marginLeft:(width/20), alignItems:'center', justifyContent:'center'}} 
      display={this.state.status == 2 && this.state.pay_type == 2 ? 'flex' : 'none'}>
        <Image source={require('../assets/images/noWallet.png')} style={{width:(width/8), height:(height/10), resizeMode:'contain'}}/>
        <Text style={{fontSize:15, color:'rgb(52,76,87)', marginTop:(height/40)}}>Sorry, You don’t have enough balance currently</Text>
        <Text style={{fontSize:15, color:'rgb(52,76,87)'}}>You can subscribe in one of our</Text>
        <Text style={{fontSize:15, color:'rgb(52,76,87)', fontWeight:'600'}}>Awesome packages!</Text>
      </View>

      <TouchableOpacity style={this.state.status == 2 && this.state.pay_type == 2 ? styles.buttonBookdisabled : styles.buttonBook}  onPress={() => this.submitrequest()} 
      disabled={this.state.status == 2 && this.state.pay_type == 2 ? true : false}>
          <Text style={styles.buttonBookText}>CONTINUE</Text>
      </TouchableOpacity>
      
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

const styles = StyleSheet.create({
  background:{
    backgroundColor:'#F5F5F5',
    width:width,
    height:height,
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'stretch',
  },

  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },

  body: {
    flex: 1,
    width:((width/10)*9),
    marginLeft:(width/20),
    marginRight:(width/20),
    height:(height/3),
    flexDirection: 'column',    
  },

  firstText:{
    fontSize:20,
    fontWeight:'bold',
    marginTop:(height/40),
  },

  scoundText:{
    fontSize :12,
    marginTop:(height/60),
  },

  selectText:{
    fontSize:17,
    fontWeight:'bold',
    marginTop:(height/20),
  },

  payment:{
    marginTop: (height/20),
    flexDirection: 'row',
    alignItems:'center',
  },

  _type:{
    width : ((width/10)*9) / 3 - 5,
    height: (height / 5)+(height/20),
    backgroundColor:'#FFFFFF',
    marginRight:5,
    flexDirection: 'column',
    alignItems:'center',
    borderRadius:10,
    height:(height/4),
  },
  
  type:{
    width : ((width/10)*9) / 3 - 5,
    height: (height / 5)+(height/20),
    backgroundColor:'#FFFFFF',
    marginRight:5,
    flexDirection: 'column',
    alignItems:'center',
    borderRadius:10,
    height:(height/4),
    justifyContent:'space-around'
  },

  paymentTF:{
    fontSize:14,
    fontWeight:'bold',
    // marginTop: '10%',
  },

  paymentTS:{
    fontSize:13,
    // marginTop: '5%',
  },

  buttonBook:{
    marginTop:(width/ 40),
    width:width,
    backgroundColor:'rgb(28,152,207)', 
    borderRadius:5,
    justifyContent: 'center',
    alignItems:'center',
    height: (height / 15),
  },

  buttonBookdisabled:{
    marginTop:(width/ 40),
    width:width,
    backgroundColor:'rgb(210,234,245)', 
    borderRadius:5,
    justifyContent: 'center',
    alignItems:'center',
    height: (height / 15),
  },

  buttonBookText:{
    fontSize:18,
    fontWeight:'bold',
    color: '#FFFFFF',
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

  btnchecked: {
    backgroundColor:'rgb(28,152,207)', 
    width: 36, 
    height:36, 
    borderRadius:25,
    borderColor:'rgb(233,239,242)',
    borderWidth:1,
    // marginBottom: '15%'
  },

  btnunchecked: {
    backgroundColor:'rgb(255,255,255)', 
    width: 36, 
    height:36, 
    borderRadius:25, 
    borderColor:'rgb(233,239,242)', 
    borderWidth:1,
    // marginBottom: '15%'
  },

});