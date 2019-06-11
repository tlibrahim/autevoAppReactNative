import React from 'react';
import { Text, View, StyleSheet, Alert, Image, Dimensions, TouchableOpacity, ImageBackground, ActivityIndicator, Modal } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 1,
      Indicator: true,
      array:[]
    }
  }

  async componentDidMount() {
    try{
      const _id = await AsyncStorage.getItem('User_Id');
      const _token = await AsyncStorage.getItem('User_Token');
      const response = await fetch('https://autevo.net/Api/Notification?user_id='+_id+'&token='+_token+'')
      const json = await response.json()
      if(json != null && json.length){
      this.setState({ array: json, status:2, Indicator: false, })
      }else{
        this.setState({ status:1, Indicator: false, })
      }
    }catch{
      console.log("Error retrieving data" + error);
    }
  };

  static navigationOptions = ({navigation}) => ({
    headerTitle: (
      'Notifications'
    ),
    headerRight: (
      <TouchableOpacity onPress={ () => {navigation.goBack()}}>
        <Image source={require('../assets/images/x.png')} style={{marginRight:16,height: 30, width: 20,resizeMode: 'contain'}}/>
      </TouchableOpacity>
    ),
    headerLeft: null,
    tabBarVisible: false,
  });

  render() {
    return (
      <ImageBackground style={styles.background}>
                                            {/* Empty Notification */}
        <View style={styles.notifi} display={this.state.status == 1 ? 'flex' : 'none'}>
        <Image source={require('../assets/images/Nonotifications.png')} style={{resizeMode:'contain', width:(width/3), 
        height:(height/5), marginTop:(height/5)}}/>
        <Text style={{fontWeight:'500', fontSize:19, marginTop:(height/30)}}>There’s no notification yet,</Text>
        <Text style={{fontWeight:'300', fontSize:19, marginTop:(height/80)}}>Check back later for updates</Text>
        </View>
                                              {/* Notification */}
        <View style={styles.Nonotifi} display={this.state.status == 2 ? 'flex' : 'none'}>
                                              {/* Item */}
        {this.state.array.map((l, i) => (
          <View style={{width:width, height:(height/8)}} key={i}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Image source={{uri:l.image}} style={styles.img}/>
              <Text style={styles.item}>{l.description}</Text>
            </View>
            <View style={styles.line}></View>
          </View>
        ))}
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

  background:{
    backgroundColor:'rgb(255,255,255)',
    width:width,
    height:height,
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'stretch',
  },

  notifi:{
    width:(width-(width/10)), 
    height:(height), 
    // marginTop:(height/10), 
    marginLeft:(width/20), 
    alignItems:'center'
  },

  Nonotifi:{
    width:(width), 
    height:(height), 
    // marginTop:(height/20), 
  },

  line:{
    width:width, 
    height:1, 
    backgroundColor:'rgb(240,240,240)'
  },

  item:{
    fontWeight:'400', 
    textAlign:"left", 
    fontSize:16, 
    marginLeft:(width/20), 
    width:((4*(width/5))-(width/8)), 
    textAlignVertical:'center'
  },

  img:{ 
    resizeMode:'contain', 
    marginLeft:(width/20), 
    width:(width/5), 
    height:(height/8), 
    // borderRadius:45, 
    borderColor:'black'
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

