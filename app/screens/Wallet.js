import React, { Component } from 'react';
import { Text, View, Image, Alert, StyleSheet, Dimensions, ImageBackground, ScrollView, TouchableOpacity, Modal, ActivityIndicator} from 'react-native';
import { createBottomTabNavigator, createAppContainer, createStackNavigator} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import Packages from './Packages';
import PackageDetailes from './PackageDetailes';
import Location from './Location';

class Wallet extends Component<Props> {

    async componentDidMount() {
    try{
      const value = await AsyncStorage.getItem('User_Id');
      const response = await fetch("https://autevo.net/Api/Wallet?user_id="+value)
      const json = await response.json()
      if (json.package_id != null ) {
        this.setState({ balance: json.balance, package_id: json.package_id, package_name: json.package_name, package_image: json.package_image,
          expire_date: json.expire_date, total_service: json.total_service, total_used: json.total_used, log: json.log, 
          Indicator: false, })
        var msDiff = new Date(this.state.expire_date).getTime() - new Date().getTime();    //Future date - current date
        var daysTill = Math.floor(msDiff / (1000 * 60 * 60 * 24));
        this.setState({reminingdate: daysTill, status: 2})
        await AsyncStorage.setItem('PackageID', (this.state.package_id).toString());
      }else{
        this.setState({ status: 1, balance: json.balance, Indicator: false})
      }
    }catch(error){
      console.log("Error retrieving data" + error);
    }
  };
  
  constructor(props) {
    super(props);
    // this.checknewdata = this.checknewdata.bind(this);
    this.state = {
      today: new Date().toJSON().slice(0, 10),
      status:1,
      Indicator: true,
      balance: 0.00,
      package_id: null,
      package_name: null,
      package_image: 'https://cdn.zeplin.io/5c48ac1818fc287b29d9fa81/assets/1EC49429-ABD9-4847-B819-90046F413D8D.png',
      expire_date: new Date().toJSON().slice(0, 10),
      total_service: null,
      total_used: null,
      log:[],
      reminingdate: null,
    }
  }



  // async componentDidUpdate() {
  //   try{
  //     const value = await AsyncStorage.getItem('User_Id');
  //     const response = await fetch("https://autevo.net/Api/Wallet?user_id="+value)
  //     const json = await response.json()
  //     if (json.package_id != null ) {
  //       this.setState({ balance: json.balance, package_id: json.package_id, package_name: json.package_name, package_image: json.package_image,
  //         expire_date: json.expire_date, total_service: json.total_service, total_used: json.total_used, log: json.log, 
  //         Indicator: false, })
  //       var msDiff = new Date(this.state.expire_date).getTime() - new Date().getTime();    //Future date - current date
  //       var daysTill = Math.floor(msDiff / (1000 * 60 * 60 * 24));
  //       this.setState({reminingdate: daysTill, status: 2})
  //       await AsyncStorage.setItem('PackageID', (this.state.package_id).toString());
  //     }else{
  //       this.setState({ status: 1, balance: json.balance, Indicator: false})
  //     }
  //   }catch(error){
  //     console.log("Error retrieving data" + error);
  //   }
  // };

  static navigationOptions = ({navigation}) => ({
    headerTitle: ('WALLET'),
    headerRight: (
      <TouchableOpacity>
        <Text style={styles.chargetxt}>CHARGE</Text>
      </TouchableOpacity>
    ),
    headerLeft: null,
  });

  async book(){
    try {
      await AsyncStorage.removeItem('city_id')
      await AsyncStorage.removeItem('Address')
      await AsyncStorage.removeItem('lat')
      await AsyncStorage.removeItem('long')
      await AsyncStorage.removeItem('date')
      await AsyncStorage.removeItem('timeid')
      await AsyncStorage.removeItem('Services')
      await AsyncStorage.removeItem('Promo')
      await AsyncStorage.removeItem('Car_Model')
      await AsyncStorage.removeItem('Car_Color')
      await AsyncStorage.removeItem('Car_Number')
      await AsyncStorage.removeItem('Car_Letter')
      await AsyncStorage.removeItem('Payment_Type')
      await AsyncStorage.removeItem('timehour');
      await AsyncStorage.removeItem('carname');
      await AsyncStorage.removeItem('City_name');
      await AsyncStorage.removeItem('Price');
      this.props.navigation.navigate('Location')
    } catch(e) {
      // remove error
    }
  }

  async subscribe(){
    await AsyncStorage.setItem('User_balance', (this.state.balance).toString());
    await AsyncStorage.setItem('Package_status', (this.state.status).toString());
    this.props.navigation.navigate('Packages')
  }

  async Renew(){
    await AsyncStorage.setItem('User_balance', (this.state.balance).toString())
    await AsyncStorage.setItem('Package_status', '2');
    this.props.navigation.navigate('PackageDetailes', {
      packageId: (this.state.package_id),
    })
  }

  async Browes(){
    await AsyncStorage.setItem('User_balance', (this.state.balance).toString())
    await AsyncStorage.setItem('Package_status', '2');
    this.props.navigation.navigate('Packages')
  }

  render() {
    return (
	    <ImageBackground style={styles.background}>
{/* //////////////////////////////////////////////////////////// if unsubscribe   ////////////////////////////////////////////////// */}
        <View style={styles.body} display={this.state.status == 1 ? 'flex' : 'none'}>
          <View style={styles.balance}>
              <Text style={styles.mybalancetxt}>My Balance</Text>
              <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:(height/60)}}>
                <Text style={styles.mybalancenumber}>EGP {this.state.balance}</Text>
                <Image source={require('../assets/images/emptyWallet.png')}
                style={{height:(height/25), width:(width/8), marginRight:(width/30), resizeMode:'contain'}}/>
              </View>
            </View>
                  <Image source={require('../assets/images/emptyWallet.png')} 
                    style={{marginTop:(height/10), marginLeft:0,height:(height/5), width:(width/3),resizeMode: 'contain'}}/>
                  {/* <Text style={{fontSize:14,marginLeft:(width/20),marginRight:(width/20),marginTop:'3%', textAlign:'center'}}>Sorry, You don’t have any balance currently
                    Your balance will be charged by Cash back of your washes</Text> */}
                  <TouchableOpacity style={styles.add} onPress={ () => this.subscribe()}>
                        <Text style={styles.buttonAddText}>SUBSCRIBE IN A PACKAGE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.book} onPress={ () => this.book()}>
                        <Text style={styles.buttonBookText}>BOOK A WASH</Text>
                  </TouchableOpacity>
          </View>
{/* //////////////////////////////////////////////////////////// if subscribe   ////////////////////////////////////////////////// */}
        <View style={styles.body} display={this.state.status == 2 ? 'flex' : 'none'}>
                                        {/* Balance View */}
          <View style={styles.balance}>
            <Text style={styles.mybalancetxt}>My Balance</Text>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:(height/40)}}>
              <Text style={styles.mybalancenumber}>EGP {this.state.balance}</Text>
              <Image source={require('../assets/images/emptyWallet.png')}
              style={{height:(height/25), width:(width/8), marginRight:(width/30), resizeMode:'contain'}}/>
            </View>
          </View>
                                        {/* Current Package */}
          <View style={styles.currentpackage}>
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
              <Text style={{fontWeight:'bold', fontSize:22,}}>{this.state.total_used} / {this.state.total_service}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.buttonBook} onPress={ () => this.Renew()}>
          <Text style={styles.buttonBookText}>Renew</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles._buttonBook} onPress={ () => this.Browes()}>
          <Text style={styles._buttonBookText}>BROWES ALL PACKAGES</Text>
          </TouchableOpacity>
        </View>
          
          <View style={styles.smallline}></View>
          
          <Text style={styles.transactiontxt}>Transaction Log</Text>
                                        {/* ScrollView Log */}
          <ScrollView>
          {this.state.log.map((l,i) => (
              <View style={{width:width, height:(height/10), marginTop:(height/80)}} key={i}>
              <View style={{flexDirection:'row', height:(97*(height)/1000)}}>
              <Image  style={styles.imageitem}
              source={Math.floor((new Date(l.date).getTime() - new Date().getTime())/ (1000 * 60 * 60 * 24)) >= -1 ? require('../assets/images/down.png') : require('../assets/images/up.png')}/>
              <View style={{flexDirection:'row', justifyContent:'space-between', width:(8*width/10), marginLeft:(height/80)}}>
                <View style={{justifyContent:'center'}}>
                  {/* <Text style={{fontWeight:'bold', fontSize:15}}>EGP 220</Text>
                  <Text style={{fontWeight:'300', marginTop:(height/80)}}>{l.car}</Text> */}
                  <Text style={{fontWeight:'bold', fontSize:15}}>{l.car}</Text>
                </View>
                <View style={{justifyContent:'center', marginRight:(width/20)}}>
                  <Text style={{textAlign:'right', fontWeight:'100'}}>{l.date}</Text>
                  <Text style={{textAlign:'right', fontWeight:'100', marginTop:(height/80)}}>{l.time}</Text>
                </View>
              </View>
              </View>
              <View style={styles.fullline}></View>
              </View>
              ))}
          </ScrollView>
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
const _RootStack = createStackNavigator(
  {
    Location            : Location,
    Wallet 	            : Wallet,
    Packages 	          : Packages,
    PackageDetailes   	: PackageDetailes,
  },
  {
    initialRouteName: 'Wallet',
  }
);
export default createAppContainer(_RootStack);

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({

  hedar:{
    flex: 1,
    // backgroundColor:'#fff',
    flexDirection: 'row',
    height: (height / 8.33),
    justifyContent: 'center',
    marginTop:'10%',
    // marginBottom:(width / 41),
  },

  background:{
    backgroundColor:'#F5F5F5',
    height:width,
    width:height,
    flex: 1,
    flexDirection: 'column',
  },

  body: {
    flex: 1,
    marginTop:(height/40),
    width:width,
    height:(height/1.1),
    flexDirection: 'column',   
    alignItems:'center',
    backgroundColor:'#F5F5F5', 
  },

  head:{
    backgroundColor:'#FFFFFF',
    height:(height/10),
    flexDirection: 'row',    
    alignItems: 'center',
  },

  wallet:{
    marginLeft:(width/2.5),
    alignItems:'center',
    marginTop:'5%',
  },

  charge:{
    marginLeft:(width/5)-5,
    alignItems:'center',
    marginTop:'5%',
  },

  walletButton:{
    color:'black',
    fontSize:16,
    fontWeight:'bold',
  },

  add:{
    marginTop:(width/ 8),
    width:width/1.1,
    backgroundColor:'rgb(28,152,207)', 
    borderRadius:5,
    justifyContent: 'center',
    alignItems:'center',
    height: (height / 12),
  },

  buttonAddText:{
    fontSize:16,
    fontWeight:'bold',
    color: '#FFFFFF',
  },

  book:{
    marginTop:(width/ 20),
    width:width/1.1,
    backgroundColor:'#FFFFFF', 
    borderRadius:5,
    borderWidth:2,
    borderColor: 'rgb(28,152,207)',
    justifyContent: 'center',
    alignItems:'center',
    height: (height / 12),
  },

  buttonBook:{
    height: (height/18),
    width:((width)-(width/5)),
    marginTop:(height/80),
    marginRight:(width/20),
    marginLeft:(width/20),
    backgroundColor:'#d2eaf5', 
    borderRadius:6,
    justifyContent: 'center',
    alignItems:'center',
  },

  _buttonBook:{
    height: (height/20),
    width:((width)-(width/5)),
    marginTop:(height/80),
    marginRight:(width/20),
    marginLeft:(width/20),
    backgroundColor:'rgb(255,255,255)', 
    borderRadius:6,
    justifyContent: 'center',
    alignItems:'center',
  },

  buttonBookText:{
    fontSize:20,
    fontWeight:'500',
    color: 'rgb(28,152,207)',
  },

  _buttonBookText:{
    fontSize:20,
    fontWeight:'500',
    color: 'rgb(28,152,207)',
  },

  balance:{
    width:((width)-(width/10)), 
    height:(height/8), 
    backgroundColor:'rgb(255,255,255)', 
    borderRadius:6,
  },

  mybalancetxt:{
    marginTop:(height/60), 
    fontWeight:'300', 
    fontSize:15, 
    marginLeft:(width/30)
  },

  mybalancenumber:{
    marginLeft:(width/30), 
    fontWeight:'bold', 
    fontSize:32
  },

  transactiontxt:{
    marginLeft:0, 
    fontWeight:'600', 
    fontSize:18, 
    marginTop:(height/40), 
    color:'rgb(52,67,87)', 
    width:((width)-(width/10))
  },

  smallline:{
    backgroundColor:'rgb(233,239,242)', 
    height:2, 
    width:'96%', 
    marginRight:'2%', 
    marginLeft:'2%'
  },

  fullline:{
    backgroundColor:'rgb(233,239,242)', 
    height:1, 
    width:'100%'
  },

  currentpackage:{
    backgroundColor:'rgb(255,255,255)', 
    width:((width)-(width/10)), 
    height: (height/3), 
    margin:(height/40),
    borderWidth: 1,
    borderColor:'rgb(233,239,242)', 
    borderRadius: 6
  },

  listitem:{
    flexDirection:'row', 
    width:'90%', 
    marginTop:'5%', 
    height:'10%',  
    justifyContent:'center'
  },

  imageitem:{
    height:(97*(height)/1000), 
    width:(width/10), 
    marginLeft:(width/20),
    resizeMode:'contain'
  },

  walletbtn:{
    width:(width/3), 
    justifyContent:'center',
  },

  wallettxt:{
    textAlign:'center', 
    fontSize:16, 
    fontWeight:'bold', 
  },

  chargebtn:{
    width:(width/3), 
    justifyContent:'center',
    marginRight:(width/20),
  },

  chargetxt:{
    textAlign:'right', 
    fontSize:16, 
    fontWeight:'bold', 
    color:'rgb(28,152,207)',
    marginRight:(width/20),
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