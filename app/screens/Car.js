import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, 
         Modal, TextInput, TouchableHighlight, Alert, ActivityIndicator, Keyboard } from 'react-native';
import { ProgressBar, Colors } from 'react-native-paper';
import { Button, Header, Icon } from 'react-native-elements';
import ModalDropdown from 'react-native-modal-dropdown';
import AsyncStorage from '@react-native-community/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const COLORS = [
  {"id": "1", "name_En": "red",},
  {"id": "2", "name_En": "blue",},
  {"id": "3", "name_En": "black",},
  {"id": "4", "name_En": "white",},
  {"id": "5", "name_En": "silver",},
  {"id": "6", "name_En": "gray",},
  {"id": "7", "name_En": "brwon",},
  {"id": "8", "name_En": "green",},
  {"id": "9", "name_En": "other",},
];

export default class Car extends Component<Props> {
    static navigationOptions = {
      title: 'BOOK A WASH',
    };
    state = {
      modalVisible: false,
    };
    constructor(props) {
      super(props);
      this.state = {
        modalVisible: false,
        isSelected:true,
        text:'', 
        text1:'',
        car_model: null,
        car_type: null,
        car_color: ' Please select ...',
        car_number: null,
        car_letter: null,
        _TYpes: [],
        _MOdels: [],
        status: true,
        Indicator: true,
        carname: ' Please select ...',
        cartypename: ' Please select ...',
        photopath: 'https://facebook.github.io/react-native/docs/assets/favicon.png',
        keyboardHeight: 0,
        inputHeight: 0,
      }
    }
    setModalVisible(visible) {
      this.setState({modalVisible: visible});
    } 
    async componentDidMount() {
      Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
      Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
      try{
        const response = await fetch("http://autevo.net/Api/CarType")
        const json = await response.json()
        this.setState({ _TYpes: json, Indicator: false, })
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
    async getmodels(id){
      try{
        const response = await fetch("http://autevo.net/Api/CarModel?car_category_id="+id)
        const json = await response.json()
        this.setState({ _MOdels: json, Indicator: false, })
      }catch{
        console.log("Error retrieving data" + error);
      }
    }
    async addcar(){
      try {
        await AsyncStorage.setItem('Car_Type', (this.state.car_type).toString());
        await AsyncStorage.setItem('Car_Model', (this.state.car_model).toString());
        await AsyncStorage.setItem('Car_Color', (this.state.car_color).toString());
        await AsyncStorage.setItem('Car_Number', (this.state.car_number).toString());
        await AsyncStorage.setItem('Car_Letter', (this.state.car_letter).toString());
        await AsyncStorage.setItem('carname', (this.state.carname).toString());
        {this.changestatus()};
      } catch (error) {
        console.log("Error saving data" + error);
      }
    }
    _car_type_renderButtonText(rowData) {
      const {id, name_En,} = rowData;
      this.setState({car_type: id, Indicator: true, cartypename: name_En});
      {this.getmodels(id)}
      return `${name_En}`;
    }
    _car_type_renderRow(rowData, rowID, highlighted) {
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
    _car_modal_renderButtonText(rowData) {
      const {id, name_En, image} = rowData;
      this.setState({car_model: id, carname: name_En, photopath: image});
      return `${name_En}`;
    }
    _car_modal_renderRow(rowData, rowID, highlighted) {
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
    _car_color_renderButtonText(rowData) {
      const {id, name_En,} = rowData;
      this.setState({car_color: name_En});
      return `${name_En}`;
    }
    _car_color_renderRow(rowData, rowID, highlighted) {
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
    changestatus(){
      if(this.state.car_color != '' && this.state.car_letter != '' && this.state.car_number != '' && this.state.car_model != '' && this.state.car_type != ''){
          this.setState({
            status: false,
          })
          // Alert.alert(this.state.car_letter)
      }
    }

  render() {
    return (
      <ImageBackground style={styles.background} >  
        <ProgressBar progress={0.4} color={'rgb(28,152,207)'} style={{marginTop:-9, height:2}}/>
        <View style={styles.body}>
            <Text style={styles.firstText}>Select a Car</Text>
            <Text style={styles.scoundText}>Select Your Lovely Car that needs a Wash</Text>
                <View style={styles.serv} display={this.state.status ? 'flex' : 'none'}>
                  <Image source={require('../assets/images/car.png')} 
                  style={{marginTop:(height/20), marginLeft:0,height:(height/5), width:(width/2.2),resizeMode: 'contain'}}/>
                    <Text style={{fontSize:13,marginTop:'3%', textAlign:'center'}}>You can add Lovely Cars for your friends and family!</Text>
                    <Button style={styles.add} title="Add A NEW CAR" type="outline" onPress={ () => {this.setModalVisible(true)}}/>
                </View>
                <TouchableOpacity onPress={() => {this.setModalVisible(true)}}>
                <View style={styles.serv} display={this.state.status ? 'none' : 'flex'}>
                  <Image source={{uri: this.state.photopath}} 
                  style={{marginTop:(height/20), marginLeft:0,height:(height/5), width:(width/2.2),resizeMode: 'contain'}}/>
                  <Text style={{marginTop:15, fontWeight: 'bold', fontSize: 18}}>{this.state.carname}</Text>
                  <View style={{flexDirection:'row'}}>
                  <View style={{marginTop:15, height:20, width:20, backgroundColor:(this.state.car_color), borderRadius:25, 
                  borderWidth:1, borderColor:'#d2eaf5'}}></View>
                  <Text style={{marginTop:15, textTransform:'uppercase'}}>  {this.state.car_color}</Text>
                  </View>
                  <View style={{flexDirection:'row', height: 36,width: 151,backgroundColor: '#ffffff',borderStyle: 'solid',borderWidth: 1,
                    borderColor: '#d2eaf5', borderRadius: 6, justifyContent:'space-between', marginTop:15, alignItems:'center'}}>
                    <Text style={{marginLeft:21}}>{this.state.car_number}</Text>
                    <View style={{ height: 36,width: 1,backgroundColor: '#d2eaf5'}}></View>
                    <Text style={{marginRight:21}}>{(this.state.car_letter)}</Text>
                    </View>
                </View>
                </TouchableOpacity>
        </View>   
        <TouchableOpacity style={this.state.status ? styles.buttonBookdisabled : styles.buttonBook}  onPress={() => this.props.navigation.navigate('Payment')} disabled={this.state.status}>
            <Text style={styles.buttonBookText}>CONTINUE</Text>
        </TouchableOpacity>
        <Modal
        style={{borderRadius:10}}
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}>
          <View style={{flex: 1, marginTop:0, backgroundColor: 'gray', width:width+((width/10)*9), opacity:10, bottom:(this.state.keyboardHeight)}}>
          <View style={styles.header}>
            <Image source={require('../assets/images/carlogo.png')}
            style={{marginTop:10, marginLeft:16,height:22, width:22,}}/>
            <Text style={{justifyContent:'center', fontWeight:'bold', fontSize:23, marginTop:8}}>Adding New Car</Text>
            <Icon name='close' iconStyle={{marginRight:16, marginTop:10, }} onPress={()=>{this.setModalVisible(false)}}></Icon>
          </View>
          <Text style={{backgroundColor:'#F5F5F5'}}></Text>
          <View style={styles._body}>
          {/* <ActivityIndicator size="large" color="#rgb(28,152,207)" style={{display:this.state.Indicator}} animating={true}/> */}
          <Text style={styles._firstText}> Select Car Type </Text>
          <ModalDropdown style={styles._cities} 
            dropdownStyle={styles._list} animated={true}
            textStyle={{fontSize:18, marginLeft:5, fontWeight:'200',}}
            showsVerticalScrollIndicator={true} 
            options={this.state._TYpes}
            renderButtonText={(rowData) => this._car_type_renderButtonText(rowData)}
            renderRow={this._car_type_renderRow.bind(this)}
            defaultValue={this.state.cartypename}
            />
            <Text></Text>
            <Text style={styles._firstText}> Select Car Model </Text>
          <ModalDropdown style={styles._cities} 
            dropdownStyle={styles._list} animated={true}
            textStyle={{fontSize:18, marginLeft:5, fontWeight:'200',}}
            showsVerticalScrollIndicator={true} 
            options={this.state._MOdels}
            renderButtonText={(rowData) => this._car_modal_renderButtonText(rowData)}
            renderRow={this._car_modal_renderRow.bind(this)}
            defaultValue={this.state.carname}
            />
            <Text></Text>
            <Text style={styles._firstText}> Select Car Color </Text>
          <ModalDropdown style={styles._cities} 
            dropdownStyle={styles._list} animated={true}
            textStyle={{fontSize:18, marginLeft:5, fontWeight:'200',}}
            showsVerticalScrollIndicator={true} 
            options={COLORS}
            renderButtonText={(rowData) => this._car_color_renderButtonText(rowData)}
            renderRow={this._car_color_renderRow.bind(this)}
            defaultValue={this.state.car_color}
            />
            <Text></Text>
          <View style={{flexDirection:'row', justifyContent:'space-between', width:width+((width/20)), marginRight:(width/20),}}>
            <View style={styles.Table}>
            <Text style={styles.firstText_row}> Car Numbers</Text>
            <TextInput style={styles._textinput} placeholder="123" keyboardType={'phone-pad'} 
            onChangeText={(text) => this.setState({car_number: text})} returnKeyType="done" value={this.state.car_number}/>
            </View>
            <View style={styles.Table}>
            <Text style={styles.firstText_row}> Car Letters</Text>
            <TextInput style={styles._textinput} placeholder="ABC" autoCorrect={false} autoComplete={'off'} 
            onChangeText={(text1) => this.setState({car_letter: text1})} returnKeyType="done" value={this.state.car_letter}/>
            </View>
          </View>
          <TouchableOpacity style={styles._buttonBook} onPress={() => {{this.addcar()}; {this.setModalVisible(false)};}}>
						<Text style={styles._buttonBookText}> ADD THE CAR </Text>
			    </TouchableOpacity>	
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
    height: (height/2),
    width:(width/5)*4,
    marginLeft:(width/20),
    // marginRight:(width/10),
    marginTop:(width/10),
    // justifyContent: 'center',
    alignItems:'center',
    flexDirection: 'column',
    backgroundColor:'#fff',
    borderWidth:(width/150),
    borderRadius:5,
    borderColor:'rgb(233,239,242)',
  },

  add:{
    marginTop: (height/10),
    width:(width/1.4),
    borderWidth:1,
    borderRadius:5,
    borderColor:'rgb(28,152,207)',
  },

  servText:{
    marginLeft:(width/50),
    flexDirection:'column',
    width:(width /2.1)
  },

  container_model: {
    flex: 1,
    marginTop:25,
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    backgroundColor: '#F5F5F5',
  },

  _container_model: {
    flex: 1,
    marginTop:0,
    backgroundColor: 'gray',
    width:width+((width/10)*9),
    opacity:10,
  },

  container_model_VIEW: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    width:width,
  },

  _list:{
    width:(width/1.1),
    marginLeft:0,
    borderBottomLeftRadius:5,
    borderBottomRightRadius:5,
  },

  _cities:{
    width:(width/1.1),
    height:45,
    marginTop:10,
    backgroundColor:'#FFF',
    justifyContent: 'center',
    marginLeft:(width/20),
    borderRadius:5,
  },

  Table:{
    width:(width/2),
    height:(height/12),
    marginTop:0,
    // backgroundColor:'#FFF',
    justifyContent: 'center',
    marginLeft:(width/20),
    marginTop:(height/40),
  },

  _buttonBook:{
		marginTop:(width/ 10),
		marginBottom:(width/ 10),
		marginLeft:(width/ 40),
		marginRight:(width/ 40),
		width:width-((width/20)),
		backgroundColor:'rgb(28,152,207)', 
		borderRadius:5,
		justifyContent: 'center',
		alignItems:'center',
		height: 56,
	},

	_buttonBookText:{
		fontSize:18,
		fontWeight:'bold',
		color: '#FFFFFF',

  },
  
  _textinput: {
    height:45, 
    backgroundColor:'white', 
    borderRadius:5, 
    width:(width/3),
    paddingLeft: 16,
  },

  _row: {
    flexDirection:'row', 
    justifyContent:'space-between', 
    width:width+((width/20)),
  //  marginLeft:(width/20),
    marginRight:(width/20),
  },

  header: {
    height:44, 
    width:width,
    flexDirection: 'row', 
    backgroundColor:'#F5F5F5',
    borderTopLeftRadius:20,
    borderTopRightRadius:20, 
    justifyContent:'space-between',
    borderBottomColor: '#E4E4E4',
    borderBottomWidth: 1,
    marginTop:25
},

_body: {
    flex: 1,
    width:width+((width/20)),
  //  marginLeft:(width/20),
    marginRight:(width/20),
    height:(height/3),
    // marginTop:(height/20),
    // justifyContent: 'center',
    flexDirection: 'column',    
    // alignItems: 'center',
    backgroundColor: '#F5F5F5',
},

_firstText:{
    fontSize:18,
    fontWeight:'600',
    marginTop:(height/40),
    marginLeft:(width/20),
},

firstText_row: {
    fontSize:18,
    fontWeight:'600',
    // marginTop:(height/40),
    marginBottom:(width/40),
},

_scoundText:{
    fontSize :12,
    marginTop:(height/60),
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: '100',
    marginLeft:(width/20),
},

list:{
  width:(width/1.1),
  marginLeft:0,
},

cities_drop:{
  width:(width/1.1),
  height:35,
  marginTop:15,
  marginLeft:10,
  // backgroundColor:'#FFF',
  justifyContent: 'center',
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