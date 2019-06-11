import React, { Component } from 'react';
import { Text, View, Image, Alert, StyleSheet, Dimensions, ImageBackground, ScrollView, TouchableOpacity, 
         Modal, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class Packages extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      pagetitle: 'Monthly Package',
      Indicator: true,
      array:[],
      id_Package: null
    }
  }

  static navigationOptions = {
    title: 'Packages',
  };

  async componentDidMount() {
    try{
      const response = await fetch("https://autevo.net/Api/Packages")
      const value = await AsyncStorage.getItem('PackageID');
      const json = await response.json()
      this.setState({ array: json, id_Package: value, Indicator: false, })
    }catch{
      console.log("Error retrieving data" + error);
    }
    };

  render() {
    return (
	   	<ImageBackground  style={{width:width,height:height,backgroundColor:'#F5F5F5'}}>	

	        <View style={ styles.body }>
          <ScrollView contentContainerStyle={styles.contentContainer} contentInset={{top: 0, left: 0, bottom: (height/6), right: 0}}>
          {this.state.array.map((l,i) => (
              <View style={styles.item} key={i}>
              <Text style={styles.itemtitle}>{l.name}</Text>
              <View style={styles.line}></View>
              <View style={{flexDirection:'row', justifyContent:'space-around', marginTop:(height/40), height:(height/8)}}>
                <Image source={{uri: l.image}} style={styles.itemphoto}/>
                <View justifyContent='space-between'>
                  <View>
                    <Text style={styles.itemtxt}>EGP {l.old_price}</Text>
                    <Text style={{fontWeight:'bold', fontSize:18}}>EGP {l.price}</Text>
                  </View>
                  <View>
                    <Text style={{fontWeight:'300', fontSize:13}}>No. of Washes</Text>
                    <Text style={{fontWeight:'bold', fontSize:18}}>{l.service_count} Washes!</Text>
                  </View>
                </View>
              </View>
              {l.package_id == this.state.id_Package ?
              <TouchableOpacity style={styles._buttonBook} onPress={ () => this.props.navigation.navigate('PackageDetailes', {
                packageId: (l.package_id),
                packagetitle: (l.name),
              })}>
                <Text style={styles._buttonBookText}>RENEW</Text>
                </TouchableOpacity> :
              <TouchableOpacity style={styles.buttonBook} onPress={ () => this.props.navigation.navigate('PackageDetailes', {
                packageId: (l.package_id),
                packagetitle: (l.name),
              })}>
                <Text style={styles.buttonBookText}>Select</Text>
                </TouchableOpacity>
              }
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
  
  contentContainer:{
    // paddingVertical:-200,
    // height:'120%'
  },

  body: {
    flex: 1,
    width:((width/10)*9),
    marginLeft:(width/20),
    marginRight:(width/20),
    height:(height/3),
    // marginTop:(height/20),
    // justifyContent: 'center',
    flexDirection: 'column',    
    // alignItems: 'center',
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
    height: (height/15),
    width:(3*width/4),
    marginTop: (height/40),
    marginRight:(width/20),
    marginLeft:(width/20),
    backgroundColor:'#1c98cf', 
    borderRadius:6,
    justifyContent: 'center',
    alignItems:'center',
  },

  buttonBookText:{
    fontSize:22,
    fontWeight:'bold',
    color: 'rgb(255,255,255)',
  },

  _buttonBook:{
    height: (height/15),
    width:(3*width/4),
    marginTop: (height/40),
    marginRight:(width/20),
    marginLeft:(width/20),
    backgroundColor:'#d2eaf5', 
    borderRadius:6,
    justifyContent: 'center',
    alignItems:'center',
  },

  _buttonBookText:{
    fontSize:22,
    fontWeight:'bold',
    color: 'rgb(28,152,207)',
  },

  //  status:{
  //   marginLeft:(width/ 40),
  //   marginRight:(width/ 40),
  //   width:width-((width/20)),
  //   height: (height / 10),
  //   backgroundColor:'#FFFFFF',
  // },

  item:{
    backgroundColor:'rgb(255,255,255)',
    height: (height/3), 
    margin:(width/40),
    borderWidth: 1,
    borderColor:'rgb(233,239,242)', 
    borderRadius: 6,
  },

  itemtitle:{
    fontSize:22, 
    fontWeight:'bold', 
    height:(height/20), 
    marginLeft:16, 
    marginTop:(height/60), 
    justifyContent:'center'
  },

  itemphoto:{
    width:(width/5), 
    resizeMode:'contain'
  },

  line:{
    backgroundColor:'rgb(233,239,242)', 
    height:1, 
    width:'96%', 
    marginRight:'2%', 
    marginLeft:'2%'
  },

  itemtxt:{
    fontWeight:'300', 
    fontSize:13,
    textDecorationLine: 'line-through', 
    textDecorationStyle: 'solid'
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