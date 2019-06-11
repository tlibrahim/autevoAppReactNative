import React, { Component } from 'react';
import { Text, View, Image, Platform, StyleSheet, Dimensions, ImageBackground, TextInput,TouchableOpacity, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class Success extends Component<Props> {
constructor(props) {
  super(props);
  this.state = {
    imgs:[],
  }
}

async gohome(){
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
    this.props.navigation.navigate('Home')
  } catch(e) {
    // remove error
  }
}

async componentDidMount(){
  try {
      const value = await AsyncStorage.getItem('City_name');
      this.setState({PickerValue: value});
      const value1 = await AsyncStorage.getItem('Address');
      this.setState({PickerValue1: value1});
      const value2 = await AsyncStorage.getItem('date');
      this.setState({PickerValue2: value2});
      const value3 = await AsyncStorage.getItem('timehour');
      this.setState({PickerValue3: value3});      
      const value4 = await AsyncStorage.getItem('Services');
      this.setState({PickerValue4: JSON.parse(value4)});
      const value5 = await AsyncStorage.getItem('carname');
      this.setState({PickerValue5: value5});
      const value6 = await AsyncStorage.getItem('Car_Color');
      this.setState({PickerValue6: value6});
      const value7 = await AsyncStorage.getItem('Price');
      this.setState({price: value7});
      const value8 = await AsyncStorage.getItem('ImgSer');
      this.setState({imgs: JSON.parse(value8)})
    } catch (error) {
      console.log("Error retrieving data" + error);
    }
}

static navigationOptions = ({navigation}) => ({
  headerTitle: null,
  headerRight: null,
  headerLeft: null,
  tabBarVisible: false,
});

render() {
  return (
    <ImageBackground style={{width:width, height:height, backgroundColor:'rgb(50,180,219)'}}>	
        <View style={ styles.logoV }>
          <Image source={require('../assets/images/successIcon.png')} style={{marginTop:(height/20),height: 150, width: 250,resizeMode: 'contain'}}/>
          <Text style={styles.textWelcome}>Success!</Text>
        </View>	
        <View style={styles.statusBody}>
            <Text style={styles.textBody}>Your wash booked successfully,  We’ll contact you on time</Text>
        </View>
        <View style={styles.services}>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <View style={{}}>
              <Text style={{marginTop:(height/60), marginLeft:16,}}>📍Wash Location</Text>
              <Text style={{marginTop:(height/60), marginLeft:16, fontWeight:'bold'}}>{this.state.PickerValue}</Text>
            </View>
            <View style={{}}>
              <Text style={{marginTop:(height/60), marginRight:16,}}>💰Wash Price</Text>
              <Text style={{marginTop:(height/60), marginRight:0, fontWeight:'bold'}}>     EGP {this.state.price}</Text>
            </View>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:(height/60)}}>
            <View style={{}}>
              <Text style={{marginTop:(height/60), marginLeft:16,}}>🕒 Wash time</Text>
              <Text style={{marginTop:(height/60), marginLeft:16, fontWeight:'bold'}}>{this.state.PickerValue2}</Text>
              <Text style={{marginTop:(height/60), marginLeft:16, fontWeight:'bold'}}>( {this.state.PickerValue3} )</Text>
            </View>
            <View style={{}}>
              <Text style={{marginTop:(height/60), marginRight:16,}}>🚙 Your lovely car</Text>
              <Text style={{marginTop:(height/60), marginRight:16, fontWeight:'bold', textAlign: 'right'}}>  {this.state.PickerValue6} {this.state.PickerValue5} </Text>
            </View>
          </View>
          <Text style={{marginTop:(height/60), marginLeft:16,}}>🌟 Wash Details</Text>
          <View style={{marginTop:(height/60), flexDirection:'row'}}>
          {this.state.imgs.map((l, i) => (
            <Image style={{width:48, height:48, resizeMode: 'contain', borderRadius:24, borderColor:'#d2eaf5', borderWidth:1, marginLeft:(width/20),}} 
            source={{uri: l}} key={i}/>
            ))}
          </View>
        </View>
        <TouchableOpacity style={styles.buttonBook} onPress={() => this.gohome()}>
          <Text style={styles.buttonBookText}>BACK TO HOME</Text>
        </TouchableOpacity>      
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

  logoV:{
    height: (height/5),
    alignItems: 'center',
    flexDirection: 'column',
  },

  textWelcome:{
    // marginTop: (height/80),
    fontSize:36,
    fontWeight:'bold',
    textAlign:'center',
    color:'#FFF',
  },

  statusBody:{
    width: width,
    fontSize:15,
    // marginLeft: '15%',
    marginTop: (height/7),
    alignItems:'center'
  },

  textBody:{
    fontSize:13,
    fontWeight:'normal',
    textAlign:'center',
    color:'#FFF',
  },

  services:{
    marginTop: (height/40),
    height:(height/3)+(height/25),
    backgroundColor:'#FFFFFF80',
    borderRadius:5,
    marginLeft:(width/ 40),
    marginRight:(width/ 40),
    width:width-((width/20)),
  },

  buttonBook:{
    marginTop:(height/ 40),
    // marginBottom:(width/ 40),
    marginLeft:(width/ 40),
    marginRight:(width/ 40),
    width:width-((width/20)),
    backgroundColor:'rgb(250,250,250)', 
    borderRadius:5,
    justifyContent: 'center',
    alignItems:'center',
    height: (height / 12),
  },

  buttonBookText:{
    fontSize:18,
    fontWeight:'bold',
    color: 'rgb(50,180,219)',
  },

  //  status:{
  //   marginLeft:(width/ 40),
  //   marginRight:(width/ 40),
  //   width:width-((width/20)),
  //   height: (height / 10),
  //   backgroundColor:'#FFFFFF',
  // },

});