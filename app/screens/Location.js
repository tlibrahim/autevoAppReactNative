
'use strict';
import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, ImageBackground, Dimensions,
         Picker, TouchableOpacity, Modal, Alert, TouchableHighlight, ActivityIndicator } from 'react-native';
import { ProgressBar, Colors } from 'react-native-paper';
import ModalDropdown from 'react-native-modal-dropdown';
import LocationView from "react-native-location-view";
import MapView from 'react-native-maps';
import AsyncStorage from '@react-native-community/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class Location extends Component<Props> {
constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      latitude: 29.960172,
      longitude: 30.932232,
      cityid: null,
      add: null,
      book_lat: null,
      book_long: null,
      cities:[],
      status: true,
      Indicator: true,
      cityname: null,
    }
  }

  async book_detailes() {
    try {
      await AsyncStorage.setItem('city_id', (this.state.cityid).toString());
      await AsyncStorage.setItem('lat', (this.state.book_lat).toString());
      await AsyncStorage.setItem('long', (this.state.book_long).toString());
      await AsyncStorage.setItem('Address', this.state.add);
      await AsyncStorage.setItem('City_name', this.state.cityname);
    } catch (error) {
      console.log("Error saving data" + error);
    }
  };

  async componentDidMount() {
    navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    );
    try{
      const response = await fetch("http://autevo.net/Api/Cite")
      const json = await response.json()
      this.setState({ cities: json, Indicator: false, })
    }catch{
      console.log("Error retrieving data" + error);
    }
  };
    
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }  

  changestatus(){
    if(this.state.cityid > 0 && this.state.add != '' && this.state.book_lat != '' && this.state.book_long != ''){
        this.setState({
          status: false,
        })
    }
  }

  static navigationOptions = {
    title: 'BOOK A WASH',
  };
 
  render() {
      return (
        <ImageBackground style={styles.background} >  
          <ProgressBar progress={0.05} color={'rgb(28,152,207)'} style={{marginTop:-9, height:2}}/>
          <View style={styles.body}>
          {/* <ActivityIndicator size="large" color="#rgb(28,152,207)" style={{display:this.state.Indicator}} animating={true}/> */}
              <Text style={styles.firstText}>Select a Location</Text>
              <Text style={styles.scoundText}>Choose a Location to wash your lovely car</Text>
              <Text style={styles.selectText}>Select Your City 📍</Text>
              <ModalDropdown 
              style={styles.cities} 
              dropdownStyle={styles.list} animated={true}
              showsVerticalScrollIndicator={true} 
              options={this.state.cities} 
              renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
              renderRow={this._dropdown_2_renderRow.bind(this)}
              onSelect={(id, name_En, lat, lang) => {this.setModalVisible(true);
              }}
              />
              <Text style={styles.selectText}>And Pick Your Location 🗺</Text>
                    <View style={styles._view_map}>
                      <MapView
                          key = {this.state.forceRefresh}
                          initialRegion={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            latitudeDelta: 0.0050,
                            longitudeDelta: 0.0044,
                          }}
                          style={styles.cities_map}
                        >
                        {!!this.state.latitude && !!this.state.longitude && <MapView.Marker
                          coordinate={{"latitude":this.state.latitude,"longitude":this.state.longitude}}
                          title={"My Location"}
                        />}
                        </MapView>
                        <Text style={{marginTop:5, fontSize:14, marginLeft:10, fontWeight:'bold'}}>Your Location</Text>
                        <TouchableOpacity  onPress={() => this.setModalVisible(true)}>
                          <Text style={{marginTop:5, fontSize:12, marginLeft:10}}>Tap to view on map</Text>
                        </TouchableOpacity>
                      </View>
                <Text style={styles.lastText}>Sorry if you don’t found your city , We’ll cover all cities and Governorates soon.</Text>
          </View>
          <TouchableOpacity style={this.state.status ? styles.buttonBookdisabled : styles.buttonBook}  onPress={() => this.props.navigation.navigate('DateTime')} 
          disabled={this.state.status}>
              <Text style={styles.buttonBookText}>Continue</Text>
          </TouchableOpacity>

          <Modal
          style={{borderRadius:10}}
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}>
            <View style={styles.container_model}>
              <View style={styles.container_map}>
                  <LocationView
                      apiKey={"AIzaSyDzZAfb3FZA98o_J4LLELSQSX9ZBpWmXmw"}
                      initialLocation={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                      }}
                      onLocationSelect={(pop) => {
                        this.setState({
                          latitude: pop.latitude,
                          longitude: pop.longitude,
                          book_lat: pop.latitude,
                          book_long: pop.longitude,
                          add: pop.address,
                          forceRefresh: Math.floor(Math.random() * 100),
                        });
                        {this.book_detailes()}
                        this.setModalVisible(!this.state.modalVisible)
                        {this.changestatus()}
                      }}>
                    </LocationView>
            </View>
            </View>
          </Modal>
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
    _dropdown_2_renderButtonText(rowData) {
      const {id, name_En, lat, lang} = rowData;
      this.setState({cityid: id, latitude: parseFloat(lat), longitude: parseFloat(lang), cityname: name_En});
      return `${name_En}`;
    }
    _dropdown_2_renderRow(rowData, rowID, highlighted) {
      return (
        <TouchableHighlight underlayColor='cornflowerblue'>
          <View style={[styles.list,]}>
            <Text style={[styles.cities_drop, highlighted && {color: 'mediumaquamarine'}]}>
              {`${rowData.name_En}`}
            </Text>
          </View>
        </TouchableHighlight>
      );
    }
}

const styles = StyleSheet.create({
  background:{
    backgroundColor:'#F5F5F5',
    height:width,
    width:height,
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
    // marginTop:(height/20),
    // justifyContent: 'center',
    flexDirection: 'column',    
    // alignItems: 'center',
  },

  firstText:{
    fontSize:20,
    fontWeight:'bold',
    marginTop:(height/40),
  },

  container_model: {
    flex: 1,
    marginTop:25,
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    backgroundColor: 'gray',
  },

  container_map: {
    flex:1,
    height:50,
    marginLeft:0,
    marginRight:0,
    marginTop:30,
    // marginBottom:(height/9),
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
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

  cities:{
    width:(width/1.1),
    height:45,
    marginTop:10,
    backgroundColor:'#FFF',
    justifyContent: 'center',
    borderRadius:6,
  },

  cities_drop:{
    width:(width/1.1),
    height:35,
    marginTop:15,
    marginLeft:10,
    // backgroundColor:'#FFF',
    justifyContent: 'center',
  },

  cities_map:{
    width:(width/1.1),
    height:150,
    marginTop:-10,
    backgroundColor:'#FFF',
    justifyContent: 'center',
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
  },

  _view_map:{
    width:(width/1.1),
    height:200,
    marginTop:10,
    backgroundColor:'#FFF',
    justifyContent: 'center',
    borderRadius: 20,
  },

  list:{
    width:(width/1.1),
    marginLeft:0,
  },

  last:{
    width:width,
    justifyContent:'center',
    alignItems:'center',
    alignContent:'center',
    width:'100%',
  },

    lastText:{
    fontSize :12,
    marginTop:20,
    textAlign:'center',
    
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
  
});
