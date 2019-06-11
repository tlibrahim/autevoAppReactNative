import React from 'react';
import { Text, View, StyleSheet, Alert, Image, Dimensions, TouchableOpacity, ImageBackground, ScrollView, Modal, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createBottomTabNavigator, createAppContainer, createStackNavigator} from 'react-navigation';
import SegmentedControlTab from "react-native-segmented-control-tab";
import orderDetailes from './orderDetailes'

class Myorders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 2,
      up:[
        //  {car:'BMW X5', price:'80', adress:'NASR CITY', time:'18:30', date:'10-MAY-2019'},
        //  {car:'BMW X5', price:'80', adress:'NASR CITY', time:'18:30', date:'10-MAY-2019'},
        //  {car:'BMW X5', price:'80', adress:'NASR CITY', time:'18:30', date:'10-MAY-2019'},
        //  {car:'BMW X5', price:'80', adress:'NASR CITY', time:'18:30', date:'10-MAY-2019'},
        //  {car:'BMW X5', price:'80', adress:'NASR CITY', time:'18:30', date:'10-MAY-2019'},
        //  {car:'BMW X5', price:'80', adress:'NASR CITY', time:'18:30', date:'10-MAY-2019'},
        //  {car:'BMW X5', price:'80', adress:'NASR CITY', time:'18:30', date:'10-MAY-2019'},
      ],
      pre:[
        //  {car:'BMW X5', price:'80', adress:'NASR CITY', time:'18:30', date:'10-MAY-2019'},
        //  {car:'BMW X5', price:'80', adress:'NASR CITY', time:'18:30', date:'10-MAY-2019'},
        //  {car:'BMW X5', price:'80', adress:'NASR CITY', time:'18:30', date:'10-MAY-2019'},
        //  {car:'BMW X5', price:'80', adress:'NASR CITY', time:'18:30', date:'10-MAY-2019'},
        //  {car:'BMW X5', price:'80', adress:'NASR CITY', time:'18:30', date:'10-MAY-2019'},
        //  {car:'BMW X5', price:'80', adress:'NASR CITY', time:'18:30', date:'10-MAY-2019'},
        //  {car:'BMW X5', price:'80', adress:'NASR CITY', time:'18:30', date:'10-MAY-2019'},
      ],
      selectedIndex: 0,
      Indicator: true,
    }
  }

  async componentDidMount() {
    try{
      const _id = await AsyncStorage.getItem('User_Id');
      const _token = await AsyncStorage.getItem('User_Token');
      const response = await fetch('https://autevo.net/Api/Orders?user_id='+_id+'&token='+_token+'')
      const json = await response.json()
      // Alert.alert(json)
      this.setState({ up: json.upcoming, pre:json.previous, Indicator: false, })
      // this.setState({ Indicator: false, })
    }catch{
      console.log("Error retrieving data" + error);
    }
  };

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

  static navigationOptions = {
    header: null,
  };

  handleIndexChange = index => {
    this.setState({
      ...this.state,
      selectedIndex: index
    });
  };

  render() {
    return (
      <ImageBackground style={styles.background}>
        <View style={{backgroundColor:'rgb(255,255,255)', height:(height/8), justifyContent:'center', alignItems:'center'}}>
          <Text style={{marginTop:(height/35), fontWeight:'600', fontSize:16}}>MY ORDERS</Text>
          <SegmentedControlTab
            values={["Upcoming", "Previous",]}
            selectedIndex={this.state.selectedIndex}
            onTabPress={this.handleIndexChange}
            tabsContainerStyle={{marginTop:(height/80), width:(width-(width/10)), marginLeft:(width/20), marginRight:(width/20),}}
            activeTabStyle={{backgroundColor:'rgb(28,152,207)', borderColor:'rgb(28,152,207)'}}
            activeTabTextStyle={{color:'rgb(255,255,255)'}}
            tabStyle={{backgroundColor:'rgb(255,255,255)', borderColor:'rgb(28,152,207)'}}
            tabTextStyle={{color:'rgb(28,152,207)'}}
          />
        </View>
        
        { this.state.selectedIndex == 0 ? 
          (this.state.up.length > 0 ? 
            <View style={{alignItems:'center'}}>
              <ScrollView contentInset={{top: 0, left: 0, bottom: (height/10), right: 0}}>
                {this.state.up.map((l, i) => (
                  <TouchableOpacity onPress={ () => this.props.navigation.navigate('orderDetailes', {orderID: (l.Order_id),})} key={i}>
                    <View style={{width:(width-(width/10)), height:(height/8), marginTop:(height/30)}} key={i}>
                      <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', height:(height/25)}}>
                        <Text style={{fontWeight:'bold', fontSize:15}}>{l.car}</Text>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                          { l.paymen_type == 1 ? 
                          <Image source={require('../assets/images/cashSign.png')} style={{ width:20,resizeMode:'contain'}}/>
                          :
                          <Image source={require('../assets/images/walletSign.png')} style={{ width:20,resizeMode:'contain'}}/>
                          }
                          <Text style={{fontWeight:'bold', fontSize:15}}>   EGP {l.price}</Text>
                        </View>
                      </View>
                      <View style={{marginTop:(height/90), flexDirection:'row', alignItems:'center', height:(height/30)}}>
                        <Image source={require('../assets/images/locationSign.png')} style={{ width:20, resizeMode:'contain'}}/>
                        <Text style={{}}>{l.adress}</Text>
                      </View>
                      <View style={{marginTop:(height/90), flexDirection:'row', alignItems:'center', height:(height/30)}}>
                        <Image source={require('../assets/images/calendarSign.png')} style={{ width:20, resizeMode:'contain'}}/>
                        <Text style={{}}>{l.date} ({l.time})</Text>
                      </View>
                      <View style={{height:2, borderRadius:2, backgroundColor:'rgb(240,240,240)', marginTop:(height/40)}}></View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            :
            <View style={{alignItems:'center'}} >
              <Image source={require('../assets/images/myorder.png')} style={{width:(width/3), height:(height/6), alignItems:'center',
            marginTop:(height/4)}}/>
              <Text style={{fontSize:15, marginTop:(height/20)}}>You have no upcoming Orders Right Now</Text>
              <Text style={{fontSize:18, fontWeight:'600', marginTop:(height/90)}}>Book Your Next Wash Now</Text>
              <TouchableOpacity style={{width:(width-(width/10)), backgroundColor:'rgb(28,152,207)', marginTop:(height/20), 
              height:(height/15), borderRadius:6, justifyContent:'center', alignItems:'center'}} onPress={ () => this.book()}>
                <Text style={{fontSize:22, fontWeight:'600', color:'rgb(255,255,255)'}}>BOOK A WASH</Text>
              </TouchableOpacity>
            </View>)
            :
            (this.state.pre.length > 0 ? 
              <View style={{alignItems:'center'}}>
                <ScrollView contentInset={{top: 0, left: 0, bottom: (height/10), right: 0}}>
                  {this.state.pre.map((l, i) => (
                    <TouchableOpacity onPress={ () => this.props.navigation.navigate('orderDetailes', {orderID: (l.Order_id),})} key={i}>
                    <View style={{width:(width-(width/10)), height:(height/8), marginTop:(height/30)}} key={i}>
                      <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', height:(height/25)}}>
                        <Text style={{fontWeight:'bold', fontSize:15}}>{l.car}</Text>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                          { l.paymen_type == 1 ? 
                          <Image source={require('../assets/images/cashSign.png')} style={{ width:20,resizeMode:'contain'}}/>
                          :
                          <Image source={require('../assets/images/walletSign.png')} style={{ width:20,resizeMode:'contain'}}/>
                          }
                          <Text style={{fontWeight:'bold', fontSize:15}}>   EGP {l.price}</Text>
                        </View>
                      </View>
                      <View style={{marginTop:(height/90), flexDirection:'row', alignItems:'center', height:(height/30)}}>
                        <Image source={require('../assets/images/locationSign.png')} style={{ width:20, resizeMode:'contain'}}/>
                        <Text style={{}}>{l.adress}</Text>
                      </View>
                      <View style={{marginTop:(height/90), flexDirection:'row', alignItems:'center', height:(height/30)}}>
                        <Image source={require('../assets/images/calendarSign.png')} style={{ width:20, resizeMode:'contain'}}/>
                        <Text style={{}}>{l.date} ({l.time})</Text>
                      </View>
                      <View style={{height:2, borderRadius:2, backgroundColor:'rgb(240,240,240)', marginTop:(height/40)}}></View>
                    </View>
                  </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              :
              <View style={{alignItems:'center'}} >
                <Image source={require('../assets/images/myorder.png')} style={{width:(width/3), height:(height/6), alignItems:'center',
              marginTop:(height/4)}}/>
                <Text style={{fontSize:15, marginTop:(height/20)}}>You have no Previous Orders</Text>
                <Text style={{fontSize:18, fontWeight:'600', marginTop:(height/90)}}>Book Your Next Wash Now</Text>
                <TouchableOpacity style={{width:(width-(width/10)), backgroundColor:'rgb(28,152,207)', marginTop:(height/20), 
                height:(height/15), borderRadius:6, justifyContent:'center', alignItems:'center'}} onPress={ () => this.book()}>
                  <Text style={{fontSize:22, fontWeight:'600', color:'rgb(255,255,255)'}}>BOOK A WASH</Text>
                </TouchableOpacity>
              </View>)
        }
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
    Myorders : Myorders,
    orderDetailes: orderDetailes
  },
  {
    initialRouteName: 'Myorders',
  }
);
export default createAppContainer(_RootStack);

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({

  background:{
    backgroundColor:'#F5F5F5',
    width:width,
    height:height,
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'stretch',
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