import React, { Component } from 'react';
import { Text, View, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, TouchableHighlight, Alert, ActivityIndicator, Modal} from 'react-native';
import { ProgressBar } from 'react-native-paper';
import ModalDropdown from 'react-native-modal-dropdown';
import DatePicker from 'react-native-datepicker';
import AsyncStorage from '@react-native-community/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class DateTime extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      today: new Date().toJSON().slice(0, 10),
      modalVisible: false,
      // PickerValue:'',
      timeid:null,
      date:null,
      times:[],
      status: true,
      Indicator: false,
      picktime: null,
      pickdate: null,
      timehour: null,
      timedisplay: 'none'
    }
      this. date = { 
      date:''
    }
}

async getTime(date) {
  this.setState({Indicator: true})
  try{
    const response = await fetch("https://autevo.net/Api/Time?date="+date)
    this.setState({Indicator: false})
    const json = await response.json()
    this.setState({ times: json, pickdate: date,})
  }catch{
    console.log("Error retrieving data" + error);
  }

  if (this.state.times && this.state.times.length) {
    this.setState({timedisplay: 'flex'})
  }else{
    Alert.alert('Unfortunately, This Day is booked, Choose Another One.')
  }
};

setModalVisible(visible) {
  this.setState({modalVisible: visible});
};  

static navigationOptions = {
  title: 'BOOK A WASH',
}

async testId(id){
  try {
    await AsyncStorage.setItem('date', (this.state.pickdate).toString());
    await AsyncStorage.setItem('timeid', (id).toString());
    await AsyncStorage.setItem('timehour', this.state.timehour);
    // Alert.alert((this.state.picktime).toString() +' - '+ (this.state.pickdate).toString())
    this.changestatus()
  } catch (error) {
    console.log("Error saving data" + error);
  }
}

changestatus(){
  if((this.state.pickdate) != '' && this.state.picktime != ''){
    this.setState({status: false,})
  }
}

_dropdown_2_renderButtonText(rowData) {
  const {id, time} = rowData;
  this.testId(id);
  this.setState({picktime: id, timehour:time})
  return `${time}`;
  }

_dropdown_2_renderRow(rowData, rowID, highlighted) {
  return (
    <TouchableHighlight underlayColor='cornflowerblue'>
      <View style={[styles.list,]}>
        <Text style={[styles.cities_drop, highlighted && {color: 'mediumaquamarine'}]}>
          {`${rowData.time}`}
        </Text>
      </View>
    </TouchableHighlight>
  );
  }

render() {
  return (
    <ImageBackground style={styles.background} >  
    
      <ProgressBar progress={0.25} color={'rgb(28,152,207)'} style={{marginTop:-9, height:2}}/>

      <View style={styles.body}>
          <Text style={styles.firstText}>Select-Date</Text>
          <Text style={styles.scoundText}>Choose a Date and Time Range to wash your lovely car</Text>
          <Text style={styles.selectText}>Date</Text>
            <DatePicker
              style={styles.cities}
              mode="date"
              date={this.state.date}
              placeholder="Select a date"
              format="YYYY-MM-DD"
              minDate={this.state.today}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              iconSource={require('../assets/images/calendar.png')}
              customStyles={{
                dateIcon: {
                  position: 'relative',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36,
                  borderBottomWidths:0,
                  borderLeftWidth: 0,
                  borderRightWidth: 0,
                  borderTopWidth: 0,
                }
              }}
              onDateChange={(date) => {this.setState({Indicator: true, date: date, }); this.getTime(date)}}
            />
            <View display={this.state.timedisplay}>
          <Text style={styles.selectText}>Select-Time</Text>
            <ModalDropdown style={styles.cities} dropdownStyle={styles.list} animated={true}
            showsVerticalScrollIndicator={true}
            options={this.state.times} 
            renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
            renderRow={this._dropdown_2_renderRow.bind(this)}
            onSelect={(id, name_En) => {this.setModalVisible(true,id);
            }}
          />
          </View>
      </View>

      <TouchableOpacity style={this.state.status ? styles.buttonBookdisabled : styles.buttonBook}  onPress={() => this.props.navigation.navigate('Services')}
      disabled={this.state.status}>
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
    width:width,
    height:height,
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

  list:{
    width:(width/1.1),
  },

   cities_drop:{
    width:(width/1.1),
    height:35,
    marginTop:15,
    marginLeft:10,
    // backgroundColor:'#FFF',
    justifyContent: 'center',
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