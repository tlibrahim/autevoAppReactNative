import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, ScrollView, TextInput, 
  Button, Alert, ActivityIndicator, Modal, Keyboard } from 'react-native';
import { ProgressBar, Colors, } from 'react-native-paper';
import RoundCheckbox from 'rn-round-checkbox';
import AsyncStorage from '@react-native-community/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
var tempCheckValues = [];

export default class Services extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      isSelected:false,
      text:'',
      _services: [],
      totalprice: 0,
      services_id:[],
      totalservices:[],
      checkBoxChecked: [],
      promopercentage: 0,
      afterpromo: 0,
      status: true,
      promoring: 0,
      Indicator: true,
      allimages: [],
      keyboardHeight: 0,
      inputHeight: 0,
      keyboardOffset: 0,
    }
  }

  async componentDidMount() {
    Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    try{
      const response = await fetch("http://autevo.net/Api/Services")
      const json = await response.json()
      this.setState({ _services: json.services, Indicator: false, })
    }catch{
      console.log("Error retrieving data" + error);
    }
  };

  _keyboardDidShow(e) {
      this.setState({keyboardHeight: e.endCoordinates.height - (height / 8), inputHeight: 40});
      // keyboardHeight = e.endCoordinates.height;
  }

  _keyboardDidHide(e) { 
      this.setState({keyboardHeight: 0, inputHeight:0});
      // keyboardHeight = 0;
  }

  async checkpromo(key){
    try{
      const response = await fetch("http://autevo.net/Api/Promo?promoCode="+key)
      this.setState({Indicator: false})
      const json = await response.json()
      this.setState({ msg: json.msg, promopercentage:0 , promoring:0})
      if( json.msg == "Promo is Valid"){
        this.setState({ promopercentage: json.promoCode.discount,})
        var all = Number(this.state.totalprice) - ((Number(this.state.totalprice) * Number(this.state.promopercentage)) / 100)
        this.setState({afterpromo: all, })
      }else{
        this.setState({text: ''})
      }
      Alert.alert(this.state.msg)
    }catch{
      console.log("Error retrieving data" + error);
    }
  }

  async adddetailes(){
    try {
      await AsyncStorage.setItem('Promo', (this.state.text).toString());
      await AsyncStorage.setItem('Price', (this.state.afterpromo).toString());
      await AsyncStorage.setItem('Services', JSON.stringify(this.state.totalservices));
      await AsyncStorage.setItem('ImgSer', JSON.stringify(this.state.allimages));
      this.props.navigation.navigate('Car')
    } catch (error) {
      console.log("Error saving data" + error);
    }
    // Alert.alert(this.state.text)
  }

  static navigationOptions = {
    title: 'BOOK A WASH',
  }

  NOW(id, price, value, image){
/////////////////////////////////////////// change the status of Round Check  /////////////////////////////////
    this.setState({
      checkBoxChecked: tempCheckValues
    })
    var tempCheckBoxChecked = this.state.checkBoxChecked;
    tempCheckBoxChecked[id] = !value;
    this.setState({
      checkBoxChecked: tempCheckBoxChecked
    })


/////////////////////////////////////////// check if the element exists  /////////////////////////////////
    if(tempCheckBoxChecked[id] == true){
    this.setState({
      totalprice: Number(this.state.totalprice) + Number(price),
      afterpromo: Number(this.state.totalprice) + Number(price),
    });
    this.state.totalservices.push(id)
    this.state.allimages.push(image)
  }else{
    var array = this.state.totalservices;
    var index = array.indexOf(id); 
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({totalservices: array,
      totalprice: Number(this.state.totalprice) - Number(price),
      afterpromo: Number(this.state.totalprice) - Number(price),});
    }
    var imgarray = this.state.allimages;
    var _index = imgarray.indexOf(image);
    if (_index !== -1) {
      imgarray.splice(_index, 1);
      this.setState({allimages: imgarray,})
    }
  }

  /////////////////////////////////////////// check status of CONTINUE Button //////////////////////////
  if(this.state.totalservices.length != 0){
      this.setState({status: false})
  }else{
      this.setState({status: true})
  }
/////////////////////////////////////////// Another check if the element exists  /////////////////////////////////
  // var array = this.state.totalservices;
  // var index = array.indexOf(id);
  // if(index !== -1){
  //     array.splice(index,1);
  //     this.setState({
  //       totalservices: array,
  //       totalprice: Number(this.state.totalprice) - Number(price),
  //       afterpromo: Number(this.state.totalprice) - Number(price),
  //     })
  // }else{
  //   this.state.totalservices.push(id);
  //   this.setState({
  //       totalprice: Number(this.state.totalprice) + Number(price),
  //       afterpromo: Number(this.state.totalprice) + Number(price),
  //     });
  // }
  }

  // keyExtractor = (item, index) => index.toString()
  // renderItem = ({ item }) => (
  //   <ListItem
  //     title={item.name_En}
  //     subtitle={item.description_En}
  //     leftAvatar={{ source: { uri: item.image } }}
  //     rightTitle={item.price+' EGB'}
  //   />
  // )

  render() {
    return (
      <ImageBackground style={styles.background} >  
        <ProgressBar progress={0.3} color={'rgb(28,152,207)'} style={{marginTop:-9, height:2}}/>
        <View style={styles._modalBackground} display={this.state.promoring == 1 ? 'flex' : 'none' }>
          <View style={styles._activityIndicatorWrapper}>
              <ActivityIndicator
                animating={true} color="#rgb(28,152,207)"/>
          </View>
        </View>
        <View style={{flex: 1, width:((width/10)*9), marginLeft:(width/20), marginRight:(width/20), height:(height/3), flexDirection: 'column',    
     bottom: (this.state.keyboardHeight),}} display={this.state.promoring == 1 ? 'none' : 'flex' }>
          <Text style={styles.firstText}>Select a Services</Text>
            <Text style={styles.scoundText}>Choose from our Awesome Services and Pamper Your Car</Text>
          <ScrollView contentContainerStyle={styles.contentContainer}>
          {this.state._services.map((l, i) => (
            <TouchableOpacity key={i} onPress={() => {this.NOW(l.id,l.price,this.state.checkBoxChecked[l.id],l.image);}}>
              <View style={styles.serv} key={i}>
                  <View style={styles.check}>
                  <RoundCheckbox size={30} checked={this.state.checkBoxChecked[l.id]}
                      onValueChange={() => {this.NOW(l.id,l.price,this.state.checkBoxChecked[l.id],l.image)}}
                    />
                  <Image source={{uri: l.image}} 
                  style={{ marginLeft:0,height:60, width: 60,resizeMode: 'contain',borderRadius:30}}/>
                  </View>
                  <View style={styles.servText}>
                    <Text style={{fontSize:14,fontWeight:'bold'}}>{l.name_En}</Text>
                    <Text style={{fontSize:12,marginTop:'0%'}} numberOfLines={4} ellipsizeMode={'tail'}>{l.description_En}</Text>
                  </View>
                  <View style={styles.price}>
                    <Text style={{textAlignVertical: 'top',fontSize:14,fontWeight:'bold'}}>EGP {l.price}</Text>
                  </View>
              </View> 
              <View style={styles.line}></View>
            </TouchableOpacity> 
                  ))}
          <Text style={styles.promoText}>Add a Promo Code 😎</Text>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <TextInput style={{height: 40, marginTop:(width/30), borderColor: 'rgb(233,239,242)', borderWidth: 1, borderRadius: 5,
          width:(width/2)+(width/4), paddingLeft: 16,}} placeholder='Enter a Promo Code' returnKeyType="done" autoCorrect={false}
            onChangeText={(text) => this.setState({text})} value={this.state.text}>
          </TextInput>
          <Text style={styles.promobutton} onPress={ ()=> {this.checkpromo(this.state.text); this.setState({Indicator: true})}}> Apply </Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={{marginTop:10, fontWeight:'200'}}>SubTotal</Text>
          <Text style={{marginTop:10, fontWeight:'200'}}>{this.state.totalprice} EGB</Text>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={{marginTop:10, fontWeight:'200'}}>Promo Discount</Text>
          <View style={{marginTop:10, backgroundColor:'rgb(29,198,182)', borderRadius:4, alignItems:'center', justifyContent:'center', padding:2}}>
          <Text style={{ fontWeight:'200', color:'white'}}>- {this.state.promopercentage} %</Text>
          </View>
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={{marginTop:10, fontWeight:'bold'}}>Order Total</Text>
          <Text style={{marginTop:10, fontWeight:'bold'}}>{this.state.afterpromo} EGB</Text>
          </View>
          </ScrollView>
        </View>   
        <TouchableOpacity style={this.state.status ? styles.buttonBookdisabled : styles.buttonBook}  onPress={() => this.adddetailes()} disabled={this.state.status}>
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

  contentContainer:{
    paddingVertical:20,
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

  scoundText:{
    fontSize :12,
    marginTop:(height/60),
  },

  promoText:{
    fontSize:15,
    fontWeight:'bold',
    marginTop:(height/25),
  },

  promoInput:{
    height: 40,
    marginTop:(width/30),
    borderColor: 'rgb(233,239,242)', 
    borderWidth: 1,
    borderRadius: 5,
    width:(width/2)+(width/4),
    paddingLeft: 16,
    // marginBottom: (keyboardHeight + 40),
  },

  promobutton:{
    height: 40,
    width: 48,
    marginTop:(width/30)+10,
    // borderColor: 'rgb(233,239,242)', 
    // borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
    color: 'rgb(29,198,182)',
    justifyContent:'center'
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

  serv:{
    height: (height/9),
    width:(width/1.1),
    // marginLeft:10,
    marginTop:'5%',
    // justifyContent: 'center',
    // alignItems:'center',
    flexDirection: 'row',
  },

  check:{
    // justifyContent: 'center',
    // alignItems:'center',
    flexDirection: 'row',
  },

  servText:{
    marginLeft:(width/50),
    flexDirection:'column',
    width:(width /2.1),
    height:(height/7)
  },

  price:{
    marginLeft:0,
    alignItems: 'flex-start',
  },

  line:{
    backgroundColor:'rgb(245,238,250)',
    height:2,
    width:(width/1.1),
  },

  _modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#00000040',
    opacity: 10,
    width:width
  },
  _activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },

  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
    opacity: 100,
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