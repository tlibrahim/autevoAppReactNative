import React, { Component } from 'react';
import { Text, View, Image, Alert, StyleSheet, Dimensions, ImageBackground, ScrollView, TouchableOpacity, 
         Modal, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class PackageDetailes extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      Indicator: true,
      name: null,
      price: null,
      old_Price: null,
      image: 'https://cdn.zeplin.io/5c48ac1818fc287b29d9fa81/assets/1EC49429-ABD9-4847-B819-90046F413D8D.png',
      duration: null,
      array:[],
      id_Package: null,
    }
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('packagetitle', 'Package'),
    };
  };

  async componentDidMount() {
    try{
      const { navigation } = this.props;
      const itemId = navigation.getParam('packageId');
      const response = await fetch("https://autevo.net/Api/PackageDetails?package_id="+itemId)
      const json = await response.json()
      this.setState({ array: json.services, name: json.name, price: json.price, old_Price: json.old_Price, 
        image: json.image, duration: json.duration, id_Package: itemId, Indicator: false})
    }catch{
      console.log("Error retrieving data" + error);
    }
    };

  async subscribeInpackage(){
    const _balance = await AsyncStorage.getItem('User_balance');
    const _status = await AsyncStorage.getItem('Package_status');
    const _id = await AsyncStorage.getItem('PackageID');
    if(this.state.price <= _balance){
      // if(_id == this.state.id_Package){
      //   //Renew
      //   Alert.alert('Renew')
      // }else{
      //   //First Time
      //   Alert.alert('First Time')
      // }
      // // Alert.alert('Congrats')
      const { navigation } = this.props;
      const itemId = navigation.getParam('packageId');
      const _id = await AsyncStorage.getItem('User_Id');
      const _token = await AsyncStorage.getItem('User_Token');
      const response = await fetch('https://autevo.net/Api/SubscribePackage?user_id='+_id+'&token='+_token+'&package_id='+itemId+'')
      const json = await response.json()
      if(json.status == 1){
        await AsyncStorage.setItem('PackageID', (itemId).toString());
        Alert.alert(json.msg)
      }else{
        Alert.alert(json.msg)
      }
    }else{
      Alert.alert('Sorry You mast charge first')
    }
  }

render() {
  return (
    <ImageBackground  style={styles.allpage}>	
                                    {/* Package Name */}
        <View style={{height:(height/4),}}>
          <Text style={styles.packagetxt}>{this.state.name}</Text>
          <View style={styles.packagestyle}>
            <Image style={styles.itemphoto} source={{uri: this.state.image}}/>
            <View style={{justifyContent:'space-between', marginRight:(width/3),}}>
              <View>
                <Text style={styles.itemtxt}>EGP {this.state.old_Price}</Text>
                <Text style={{fontWeight:'bold', fontSize:18}}>EGP {this.state.price}</Text>
              </View>
              <View>
                <Text style={{fontWeight:'300', fontSize:13}}>No. of Washes</Text>
                <Text style={{fontWeight:'bold', fontSize:18}}>{this.state.duration} Washes!</Text>
              </View>
            </View>
          </View>

          <View style={styles.line}></View>
        </View>
                                    {/* Array of Package Detailes */}
        <View style={{height:(height/2)}}>
          <View style={styles.detailesview}>
            <Text style={{fontStyle:'italic', textAlign:'left'}}>  This Package is Valid for 30 days from subscription date    </Text>
          </View>
          <Text style={styles.packageincluds}>{this.state.name} include:</Text>
          <ScrollView style={{margin:(width/20), height:(height/4)}}>
          {this.state.array.map((l, i) => (
            <View style={{height:(height/8), justifyContent:'space-around',}} key={i}>
              <View style={{flexDirection:'row'}}>
                <View style={{width:(width/6), justifyContent:'center'}}>
                  <Text style={{fontWeight:'bold', fontSize:25}}>×{l.quantity}</Text>
                  <Text style={{fontWeight:'300'}}>Washes</Text>
                </View>
                <Image source={{uri: l.service_image}} style={{resizeMode:'contain', width:(width/6)}}/>
                <View style={{width:(2*width/3), justifyContent:'center', marginLeft:(width/40), height:(height/10)}}>
                  <Text style={{fontWeight:'500', fontSize:16}}>{l.service_name}</Text>
                  <Text style={{fontWeight:'200', width:'80%'}}>{l.description}</Text>
                </View>
              </View>
              <View style={styles._line}></View>
            </View>
          ))}
          </ScrollView>
        </View>
                                    {/* Subscribe Button */}
        <View style={styles.subscribeview}>
          <TouchableOpacity style={styles.subscribetouch} onPress={ () => this.subscribeInpackage()}>
            <Text style={styles.subscribetxt}>Subscribe in this Package</Text>
          </TouchableOpacity>
        </View>
                                    {/* Progress Ring */}
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

  backgroundImage: {
    resizeMode: 'cover', // or 'stretch'
  },

  logoV: {
    height: (height/2.5),
    alignItems: 'center',
    flexDirection: 'column',
  },

  textWelcome:{
    marginTop: (width/20),
    fontSize:36,
    fontWeight:'bold',
    textAlign:'center',
    color:'#FFF',
  },

  statusBody:{
    width: '70%',
    fontSize:15,
    marginLeft: '15%',
  },

  textBody:{
    fontSize:13,
    fontWeight:'normal',
    textAlign:'center',
    color:'#FFF',
  },

  services:{
    marginTop: '5%',
    height:(height / 3.5),
    backgroundColor:'#FFFFFF80',
    borderRadius:5,
    marginLeft:(width/ 40),
    marginRight:(width/ 40),
    width:width-((width/20)),
  },

  buttonBook:{
    marginTop:(width/ 10),
    marginBottom:(width/ 40),
    marginLeft:(width/ 40),
    marginRight:(width/ 40),
    width:width-((width/20)),
    backgroundColor:'rgb(250,250,250)', 
    borderRadius:5,
    justifyContent: 'center',
    alignItems:'center',
    height: (height / 15),
  },

  buttonBookText:{
    fontSize:18,
    fontWeight:'bold',
    color: 'rgb(50,180,219)',
  },

  item:{
    backgroundColor:'rgb(255,255,255)', 
    width:'90%', 
    height: '33%', 
    margin:'5%',
    borderWidth: 1,
    borderColor:'rgb(233,239,242)', 
    borderRadius: 6,
  },

  itemtitle:{
    fontSize:20, 
    fontWeight:'bold', 
    height:(height/20), 
    marginLeft:16, 
    marginTop:(height/40), 
    justifyContent:'center'
  },

  itemphoto:{
    width:(width/6), 
    height:(height/10),
    resizeMode:'contain',
    // marginRight:(width/2),
  },

  line:{
    backgroundColor:'rgb(233,239,242)', 
    height:1, 
    width:'96%', 
    marginRight:'2%', 
    marginLeft:'2%',
    marginTop: (height/20)
  },

  _line:{
    backgroundColor:'rgb(233,239,242)', 
    height:1, 
    width:'96%', 
    marginRight:'2%', 
    marginLeft:'2%',
    // marginTop: (height/20)
  },

  itemtxt:{
    fontWeight:'300', 
    fontSize:13,
    textDecorationLine: 'line-through', 
    textDecorationStyle: 'solid'
  },

  allpage:{
    width:width,
    height:height,
    backgroundColor:'rgb(255,255,255)'
  },

  packagetxt:{
    fontSize:22, 
    fontWeight:'bold', 
    marginLeft:(width/20), 
    marginTop:(height/30)
  },

  packagestyle:{
    flexDirection:'row', 
    justifyContent:'space-around', 
    marginLeft:(width/20), 
    marginTop:(height/50)
  },

  detailesview:{
    backgroundColor:'rgb(233,239,242)', 
    borderRadius:14, 
    justifyContent:'center',
    width:(width-(width/10)), 
    margin:(width/20)
  },

  packageincluds:{
    marginLeft:(width/20), 
    fontSize:15, 
    fontWeight:'400'
  },

  subscribeview:{
    height:(height/4),
    width:(width-(width/10)), 
    marginLeft:(width/20),
    marginTop:(-height/20)
  },

  subscribetouch:{
    backgroundColor:'#1c98cf', 
    height:(height/12), 
    borderRadius:6, 
    justifyContent:'center',
  },

  subscribetxt:{
    color:'rgb(255,255,255)', 
    textAlign:'center', 
    fontSize:22, 
    fontWeight:'bold'
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



