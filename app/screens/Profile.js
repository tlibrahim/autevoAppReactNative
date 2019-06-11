import React from 'react';
import { Text, View, StyleSheet, Alert, Image, Dimensions, TouchableOpacity, ImageBackground, ActivityIndicator, TextInput, 
Modal, TouchableHighlight, Keyboard} from 'react-native';
import { createBottomTabNavigator, createAppContainer, createStackNavigator} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import ModalDropdown from 'react-native-modal-dropdown';
import PhoneInput from 'react-native-phone-input';
import ImagePicker from 'react-native-image-picker';
import Settings from './Settings'

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
    this.state = {
      profile_photo: {uri:'http://www.personalbrandingblog.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png'},
      profile_name: '',
      profile_phone: '',
      profile_email: '',
      profile_city: '',
      cities:[],
      Indicator: true,
      modalVisible: false,
      avatarSource: null,
      profile_city_name:'',
      keyboardHeight: 0,
      inputHeight: 0,
    }
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  static navigationOptions = ({navigation}) => ({
    headerTitle: (
      'Profile'
    ),
    headerRight: (
      <TouchableOpacity onPress={ () => {navigation.navigate('Settings')}}>
      <Text style={styles.chargetxt}>SETTINGS</Text>
      </TouchableOpacity>
    ),
    headerLeft: null,
    tabBarVisible: false,
  });

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
      skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          profile_photo: source,
        });
      }
    });
  }

  async componentDidMount() {
    Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    try{
      const _id = await AsyncStorage.getItem('User_Id');
      const _token = await AsyncStorage.getItem('User_Token');
      const response = await fetch('https://autevo.net/Api/Profile?user_id='+_id+'&token='+_token+'')
      const json = await response.json()
      // Alert.alert(json)
      // Alert.alert(json.cities[2].name_En)
      // const name = await AsyncStorage.getItem('User_Name');
      // const email = await AsyncStorage.getItem('User_Email');
      // const number = await AsyncStorage.getItem('User_Phone');
      const photo = await AsyncStorage.getItem('User_Image');
      if(json.name != null){
        this.setState({
          profile_name: json.name
        })
      }
      if(json.email != null){
        this.setState({
          profile_email: json.email
        })
      }
      if(json.mobile != null){
        this.setState({
          profile_phone: (json.mobile).substring(2)
        })
      }
      if(json.image != null){
        this.setState({
          profile_photo: {uri: json.image}
        })
      }
      if(photo != null){
        this.setState({
          profile_photo: {uri: photo}
        })
      }
      if(json.city != null){
        this.setState({
          profile_city: json.city,
          profile_city_name: json.City_name
        })
      }
      this.setState({
        cities: json.cities, Indicator: false, 
      })
    }catch{
      console.log("Error retrieving data" + error);
    }
  };

  _dropdown_2_renderButtonText(rowData) {
    const {id, name_En, lat, lang} = rowData;
    this.setState({profile_city: id, profile_city_name: name_En});
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

  async edit(){
    this.setState({Indicator: true})
    const _id = await AsyncStorage.getItem('User_Id');
    const _token = await AsyncStorage.getItem('User_Token');
    const _phone = this.state.profile_phone
    const _name = this.state.profile_name
    const _email = this.state.profile_email
    const _cityid = this.state.profile_city
    const _photo = this.state.profile_photo
    if(_phone.length == 13 || _phone.length == 12){
      try{
        const response = await fetch('https://autevo.net/Api/UpdateProfile?user_id='+_id+'&token='+_token+'&name='+_name+'&email='+_email+'&city_id='+_cityid+'&phone='+_phone+'')
        this.setState({Indicator: false})
        const json = await response.json()
        if(json.status == 1){
          await AsyncStorage.setItem('User_Name', (_name))
          Alert.alert(json.message)
        }else{
          Alert.alert(json.message)
        }
      }catch(error){
  
      }
    }else{
      Alert.alert('Wrong / Missing Data')
    }
  }

  _keyboardDidShow(e) {
    this.setState({keyboardHeight: e.endCoordinates.height - (height / 4), inputHeight: 40});
    // keyboardHeight = e.endCoordinates.height;
}

_keyboardDidHide(e) { 
    this.setState({keyboardHeight: 0, inputHeight:0});
    // keyboardHeight = 0;
}

  render() {
    return (
      <ImageBackground style={{width:(width), height:(height), backgroundColor:'#F5F5F5', justifyContent:'center' ,bottom:(this.state.keyboardHeight)}}>
                            {/* My Photo Section */}
        <View style={{width:(width), height:(height/5)}}>
          <ImageBackground source={require('../assets/images/pattern.png')} style={{width:width, height:(height/4)}}>
            <View style={{justifyContent:'center', alignItems:'center', marginTop:(height/40)}}>
              <Image style={{borderRadius:35, borderWidth:1, borderColor:'#d2eaf5', width:75, height:75, resizeMode:'contain'}} 
              source={this.state.profile_photo}/>
              <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
              <Image style={{width:50, height:50, resizeMode:'contain', marginTop:(-1*(height/40)), marginLeft:(width/10)}} 
              source={require('../assets/images/camera.png')}/>
              </TouchableOpacity>
              <Text style={{marginTop:(height/80), fontSize:15, fontWeight:'bold'}}>{this.state.profile_name}</Text>
              {/* <Text style={{marginTop:(height/80)}}>You washed 12 times!</Text> */}
            </View>
          </ImageBackground>
        </View>
                            {/* MY Info Section */}
        <View style={{width:(width-(width/10)), height:(4*height/5), marginLeft:(width/20), marginRight:(width/20),}}>
          <Text style={{fontSize:18, fontWeight:'bold', marginTop:(height/20)}}>Display Name</Text>
          <TextInput value={this.state.profile_name} style={{paddingLeft:16, backgroundColor: 'white', borderRadius:6, marginTop:(height/60),
        height:(height/20)}} onChangeText={ (value) => this.setState({profile_name: value})} maxLength={34} />
          <Text style={{fontSize:18, fontWeight:'bold', marginTop:(height/40)}}>Mobile Number</Text>
          <PhoneInput style={{backgroundColor: 'white', borderRadius:6, marginTop:(height/60), height:(height/20)}} ref='phone' 
          initialCountry='eg' flagStyle={{margin:(width/20),}} value={this.state.profile_phone} onChangePhoneNumber={ (p) => this.setState({profile_phone: p})}/>
          <Text style={{fontSize:18, fontWeight:'bold', marginTop:(height/40)}}>Email Address</Text>
          <TextInput value={this.state.profile_email} style={{paddingLeft:16, backgroundColor: 'white', borderRadius:6, marginTop:(height/60),
        height:(height/20),}} onChangeText={ (value) => this.setState({profile_email: value})} keyboardType={'email-address'} />
          <Text style={{fontSize:18, fontWeight:'bold', marginTop:(height/40)}}>Location</Text>
          <ModalDropdown 
              style={styles.cities} 
              dropdownStyle={styles.list} animated={true}
              showsVerticalScrollIndicator={true} 
              options={this.state.cities} 
              renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
              renderRow={this._dropdown_2_renderRow.bind(this)}
              onSelect={(id, name_En, lat, lang) => {this.setModalVisible(true);}}
              defaultValue={this.state.profile_city_name}
            />
            <TouchableOpacity style={{width:(width-(width/10)), height:(height/13), backgroundColor:'#1c98cf', borderRadius:6, 
            marginTop:(height/60), alignItems:'center', justifyContent:'center'}} onPress={ () => this.edit()}>
              <Text style={{color:'white', fontSize:22, fontWeight:'700'}}>UPDATE</Text>
            </TouchableOpacity>
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

const _RootStack = createStackNavigator(
  {
    Profile : Profile,
    Settings : Settings,
  },
  {
    initialRouteName: 'Profile',
  }
);
export default createAppContainer(_RootStack);

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({

  backgroundImage: {
    resizeMode: 'cover', // or 'stretch'
  },

  walletbtn:{
    width:(width/3), 
    justifyContent:'center',
  },

  wallettxt:{
    textAlign:'center', 
    fontSize:16, 
    fontWeight:'bold', 
  },

  chargebtn:{
    width:(width/3), 
    justifyContent:'center',
    marginRight:(width/20),
  },

  chargetxt:{
    textAlign:'right', 
    fontSize:16, 
    fontWeight:'bold', 
    color:'rgb(28,152,207)',
    marginRight:(width/20)
  },

  cities_drop:{
    width:(width/1.1),
    height:35,
    marginTop:15,
    marginLeft:10,
    // backgroundColor:'#FFF',
    justifyContent: 'center',
  },

  list:{
    width:(width/1.1),
    marginLeft:0,
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

  cities:{
    width:(width/1.1),
    marginTop:(height/60),
    borderRadius:6,
    backgroundColor:'white',
    justifyContent: 'center',
    paddingLeft:16,
    height:(height/20)
  },
  
});