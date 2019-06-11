import React from 'react';
import { Text, View, StyleSheet, Alert, Image, Dimensions, TouchableOpacity, ImageBackground, ScrollView, Modal, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class orderDetailes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        Car_Image:'https://cdn.zeplin.io/5c48ac1818fc287b29d9fa81/assets/EA3D398D-1286-4F27-918A-53226CA419CC.png',
        Car_Name:'',
        Total_Price: null,
        Location:'',
        Date:'',
        Time:'',
        paymen_type:'',
        Subtotal_Price:0.00,
        Discount_Percent:0.00,
        Discount_Amount:0.00,
        array:[
            // {Service_Image:'https://cdn.zeplin.io/5c48ac1818fc287b29d9fa81/assets/02295B73-2E2D-41DB-A92A-2F70170F9CAF.png', Service_Price:'80', Service_Name:'Interior Cleaning', Service_Description:'Interior polishing - Remove dust - Pedals, Glasses and Doors Cleaning'},
            // {Service_Image:'https://cdn.zeplin.io/5c48ac1818fc287b29d9fa81/assets/D934C739-D958-44A3-BC2C-59C02FC4AFC3.png', Service_Price:'80', Service_Name:'Interior Cleaning', Service_Description:'Interior polishing - Remove dust - Pedals, Glasses and Doors Cleaning'},
            // {Service_Image:'https://cdn.zeplin.io/5c48ac1818fc287b29d9fa81/assets/02295B73-2E2D-41DB-A92A-2F70170F9CAF.png', Service_Price:'80', Service_Name:'Interior Cleaning', Service_Description:'Interior polishing - Remove dust - Pedals, Glasses and Doors Cleaning'},
            // {Service_Image:'https://cdn.zeplin.io/5c48ac1818fc287b29d9fa81/assets/02295B73-2E2D-41DB-A92A-2F70170F9CAF.png', Service_Price:'80', Service_Name:'Interior Cleaning', Service_Description:'Interior polishing - Remove dust - Pedals, Glasses and Doors Cleaning'},
            // {Service_Image:'https://cdn.zeplin.io/5c48ac1818fc287b29d9fa81/assets/D934C739-D958-44A3-BC2C-59C02FC4AFC3.png', Service_Price:'80', Service_Name:'Interior Cleaning', Service_Description:'Interior polishing - Remove dust - Pedals, Glasses and Doors Cleaning'},
        ],
        Indicator: true,
    }
  }

  async componentDidMount() {
    try{
      const { navigation } = this.props;
      const itemId = navigation.getParam('orderID');
      const _id = await AsyncStorage.getItem('User_Id');
      const _token = await AsyncStorage.getItem('User_Token');
      const response = await fetch('https://autevo.net/Api/OrderDetailse?user_id='+_id+'&token='+_token+'&order_id='+itemId+'')
      const json = await response.json()
      const y = ((json.sup_price * json.promo)/100.0);
      this.setState({Car_Name: json.car, Car_Image: json.car_image, Total_Price: json.price, Location: json.adress, Date: json.date,
      Time: json.time, paymen_type: json.paymen_type, Discount_Percent: json.promo, array: json.services, Subtotal_Price: json.sup_price, Discount_Amount: y, Indicator: false});
    }catch{
      console.log("Error retrieving data" + error);
    }
  };

  static navigationOptions = {
    headerTitle: 'ORDER DETAILS',
  };

  render() {
    return (
      <ImageBackground style={styles.background}>
          <View style={{width:(width-(width/10)), marginLeft:(width/20), height:(height/1.22), alignItems:'center'}}>
            <Image source={{uri: this.state.Car_Image}} style={{height:(height/6), width:(width-(width/10)), resizeMode:'contain', marginTop:(height/80)}}/>
            <View style={{width:(width-(width/10)), flexDirection:'row', justifyContent:'space-between', marginTop:(height/40), height:(height/30)}}>
                <Text style={{fontWeight:'bold', fontSize:15}}>{this.state.Car_Name}</Text>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Image style={{ width:30, resizeMode:'contain'}} source={ this.state.paymen_type == 1 ? require('../assets/images/cashSign.png')
                          : require('../assets/images/walletSign.png') }/>
                  <Text style={{fontWeight:'bold', fontSize:15}}>   EGP {this.state.Total_Price}</Text>
                </View>
            </View>
            <View style={{width:(width-(width/10)), flexDirection:'row', alignItems:'center', marginTop:(height/60), height:(height/30)}}>
              <Image style={{width:20, resizeMode:'contain'}} source={require('../assets/images/locationSign.png')}/>
              <Text style={{fontWeight:'400', fontSize:15}} numberOfLines={1}> {this.state.Location}</Text>
                {/* <Text style={{fontWeight:'bold', fontSize:15, color:'rgb(28,152,207)', backgroundColor:'rgb(210,234,245)', borderRadius:4, padding:3}}>Map Location</Text> */}
            </View>
            <View style={{width:(width-(width/10)), flexDirection:'row', marginTop:(height/60), alignItems:'center', height:(height/30)}}>
              <Image style={{width:20, resizeMode:'contain'}} source={require('../assets/images/calendarSign.png')}/>
              <Text style={{fontWeight:'400', fontSize:15}}> {this.state.Date}</Text>
              <Text style={{fontWeight:'400', fontSize:15}}>  ({this.state.Time})</Text>
            </View>
            <View style={{width:(width-(width/10)), marginTop:(height/60)}}>
                <Text style={{fontWeight:'bold', fontSize:15}}>Services</Text>
                <View style={{width:(width-(width/10)), height:(height/4)}}>
                    <ScrollView>
                        {this.state.array.map((l, i) => (
                            <View style={{}} key={i}>
                                <View style={{flexDirection:'row', height:(height/8)}}>
                                    <Image source={{uri: l.service_image}} style={{width:(width/5), height:(height/10), marginTop:(height/60)}}/>
                                    <View style={{justifyContent:'space-around', width:(3.2*width)/5, marginLeft:(width/20)}}>
                                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                            <Text style={{fontWeight:'bold', fontSize:15}}>{l.service_name}</Text>
                                            <Text style={{fontWeight:'bold', fontSize:15, color:'rgb(201,210,214)'}}>EGP {l.Service_Price}</Text>
                                        </View>
                                        <Text style={{fontWeight:'400', fontSize:15}} numberOfLines={3}>{l.description}</Text>
                                    </View>
                                </View>
                                <View style={{height:2, width:'98%', backgroundColor:'rgb(240,240,240)', borderRadius:2}}></View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
            <View style={{width:(width-(width/10)), flexDirection:'row', justifyContent:'space-between', marginTop:(height/40)}}>
                <Text style={{fontWeight:'400', fontSize:15}}>Subtotal</Text>
                <Text style={{fontWeight:'400', fontSize:15}}>EGP {this.state.Subtotal_Price}</Text>
            </View>
            <View style={{width:(width-(width/10)), flexDirection:'row', justifyContent:'space-between', marginTop:(height/60)}}>
                <Text style={{fontWeight:'400', fontSize:15}}>Promo code discount</Text>
                <View style={{flexDirection:'row'}}>
                    <Text style={{fontWeight:'400', fontSize:15, color:'white', backgroundColor:'rgb(29,198,182)', borderRadius:4, marginRight:16, padding:3}}>-{this.state.Discount_Percent}%</Text>
                    <Text style={{fontWeight:'400', fontSize:15}}>- EGP {this.state.Discount_Amount}</Text>
                </View>
            </View>
            <View style={{width:(width-(width/10)), flexDirection:'row', justifyContent:'space-between', marginTop:(height/60)}}>
                <Text style={{fontWeight:'bold', fontSize:15}}>Order Total</Text>
                <Text style={{fontWeight:'bold', fontSize:15}}>EGP {this.state.Total_Price}</Text>
            </View>
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