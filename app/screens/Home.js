import React, { Component } from 'react';
import { Text, View, Image,  Alert, StyleSheet, Dimensions, ImageBackground, TextInput,TouchableOpacity} from 'react-native';
import { createBottomTabNavigator, createAppContainer, createStackNavigator} from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';

import Location from './Location';
import DateTime from './DateTime';
import Services from './Services';
import Car 		from './Car'; 
import Payment from './Payment';
import Confirmation from './Confirmation';
import Packages from './Packages';
import PackageDetailes from './PackageDetailes';
import notifications from './notifications';
import Profile from './Profile';

class ProfilePicture extends Component<props>{
	constructor(props) {
		super(props)
		this.state = {
			profile: 'http://www.personalbrandingblog.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
		}
	}
	
async componentDidMount() {
	const photo = await AsyncStorage.getItem('User_Image');
	if(photo != null){
		try{
			this.setState({ profile: photo,
			})
		}catch{
			console.log("Error retrieving data" + error);
		}
	}
}
  render() {
    return (
      <Image
        source={{uri: this.state.profile}}
        style={{marginLeft:16, borderRadius:15, height: 30, width: 30,resizeMode: 'contain'}}
      />
    );
  }
}

class Notification extends Component<props>{
	constructor(props) {
		super(props)
		this.state = {
			notifi_Number:0,
		}
	}
	
async componentDidMount() {
	const _id = await AsyncStorage.getItem('User_Id');
	const _token = await AsyncStorage.getItem('User_Token');
		try{
			const response = await fetch('https://autevo.net/Api/HomeStatus?user_id='+_id+'&token='+_token+'')
			const json = await response.json()
			this.setState({ notifi_Number: json.notification})
		}catch{
			console.log("Error retrieving data" + error);
		}
}
  render() {
    return (
			<View>
      	<Image source={require('../assets/images/notificationInactive.png')} style={{marginRight:16,height: 30, width: 40,resizeMode: 'contain'}}/>
				{this.state.notifi_Number > 0 && (
				<View
					style={{
						position: 'absolute',
						right: 15,
						top: -3,
						backgroundColor: 'rgb(255,100,124)',
						borderRadius: 10,
						width: 20,
						height: 20,
						justifyContent: 'center',
						alignItems: 'center',
						borderColor:'#ffffff',
						borderWidth:1,
					}}>
					<Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
						{this.state.notifi_Number}
					</Text>
				</View>
				)}
		</View>
    );
  }
}

class Home extends Component<Props> {
	constructor(props) {
		super(props)
		this.state = {
			profile: 'http://www.personalbrandingblog.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
			name: null,
			msg: '',
			cover: '',
		}
	}
	
async componentDidMount() {
	try{
		const _id = await AsyncStorage.getItem('User_Id');
  	const _token = await AsyncStorage.getItem('User_Token');
		const name = await AsyncStorage.getItem('User_Name');
		const response = await fetch('https://autevo.net/Api/HomeStatus?user_id='+_id+'&token='+_token+'')
		const json = await response.json()
		this.setState({ name: name, msg: json.welcomeMessage})
	}catch{
		console.log("Error retrieving data" + error);
	}
	SplashScreen.hide()
}

static navigationOptions = ({navigation}) => ({
	headerTitle: (
		<Image source={require('../assets/images/logo.png')} style={{height: 30, width: 180,resizeMode: 'contain'}}/>
	),
	headerRight: (
		<TouchableOpacity onPress={ () => {navigation.navigate('notifications')}}>
			<Notification/>
		</TouchableOpacity>
	),
	headerLeft: (
		<TouchableOpacity onPress={ () => {navigation.navigate('Profile')}}>
			<ProfilePicture/>
		</TouchableOpacity>
	),
});

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

render() {
	return (
		<ImageBackground style={styles.background} >	
			<View style={styles.banar}>
			<Image style={styles.banarImage} source={require('../assets/images/cover.png')}>
				{/* <TouchableOpacity style={styles.button} onPress={ () => this.props.navigation.navigate('notifications')}>
					<Text style={styles.buttonText}>KNOW MORE</Text>
				</TouchableOpacity> */}
			</Image>
			</View>
			<View  style={styles.status}>
			<Text style={styles.textWelcome}>Welcome {this.state.name},</Text>
			<View style={styles.statusBody}>
				<Text style={styles.textBody}>{this.state.msg}</Text>
				<Image source={require('../assets/images/illustration.png')} style={styles.statusImage}/>
			</View>
			<View style={styles.end}>
			<Text style={styles.textEnd}>Book a Wash, Or
				</Text>
				<TouchableOpacity style={styles.buttonEnd} onPress={ () => this.props.navigation.navigate('Packages')}>
					<Text style={styles.buttonEndText}>Browse our Packages</Text>
				</TouchableOpacity>
			</View>	
			</View>	
			<TouchableOpacity style={styles.buttonBook} onPress={() => this.book()}>
					<Text style={styles.buttonBookText}>BOOK A WASH</Text>
			</TouchableOpacity>	
		</ImageBackground>
	);
}
}

const RootStack = createStackNavigator(
  {
    Home: Home,
    Location: Location,
    DateTime: DateTime,
    Services: Services,
    Car 		: Car,
		Payment : Payment,
		Packages: Packages,
		PackageDetailes 	: PackageDetailes,
		notifications: notifications,
    Confirmation: {
    screen: Confirmation,
    navigationOptions: ({ navigation }) => ({
      header: null,
      title: 'BOOK A WASH',
      tabBarVisible: false,
      headerMode: "screen",
    }),
	},
  },
  {
    initialRouteName: 'Home',
  }
);
export default createAppContainer(RootStack);

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles= StyleSheet.create({

	hedar:{
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
	},

	background:{
		backgroundColor:'#F5F5F5',
		height:height,
		width:width,
		flex: 1,
		flexDirection: 'column',
	},

	master:{
		height: (height /3),
		width:width,
		marginTop:(height/20),
	},

	banar:{
		height: (height/3),
		width:width,
		marginTop:0,
	},

	banarImage:{
		flex: 1,  
		justifyContent: 'center',
		alignItems: 'center',
		marginTop:0, 
		width:(width), 
		height:(height/3),
		resizeMode:'stretch'
	},

	button:{
		width:120 ,
		height:25,
		backgroundColor:'#ffffff75', 
		fontSize:5,
		fontWeight:'normal',
		borderRadius:5,
		marginBottom:10 ,
		marginRight:(width / 30),
		justifyContent: 'center',
		alignItems:'center',
	},

	buttonText:{
		fontSize:13,
		color: 'rgb(28,128,214)',
	},

	status:{
		marginTop:(width/ 40),
		marginBottom:(width/ 40),
		marginLeft:(width/ 40),
		marginRight:(width/ 40),
		width:width-((width/20)),
		height: (height / 3),
		flex: 1,
		alignContent: 'center',
		backgroundColor:'#FFFFFF',
		borderRadius:6,
	},

	textWelcome:{
		marginTop: (width/50),
		fontSize:20,
		fontWeight:'bold',
		textAlign:'center',
	},

	statusBody:{
		width: '70%',
		marginLeft: '15%',
		marginTop: (width/50),
		flex: 1,
		alignContent: 'center',
	},

	textBody:{
		fontSize:12,
		marginTop: '3%',
		fontWeight:'normal',
		textAlign:'center',
	},

	statusImage:{
		width:'60%',
		height: (height/4.5),
		resizeMode: 'contain',
		marginLeft:'20%',
		marginRight:'20%',
	},

	end:{
		marginTop:'20%',
		flex: 1,
		flexDirection : 'row',
		justifyContent: 'center',
		alignItems:'center',
	},

	textEnd:{
		fontSize:14,
		fontWeight:'normal',
		textAlign:'center',
	},

	buttonEnd:{
		width:170 ,
		height:30,
		backgroundColor:'#87CEEB30',
		fontWeight:'normal',
		borderRadius:5,
		justifyContent: 'center',
		alignItems:'center',
		marginLeft:'1.5%' ,
	},

	buttonEndText:{
		fontSize:14,
		fontWeight:'bold',
		color: 'rgb(28,128,214)',
		textAlign:'center',
	},

	buttonBook:{
		marginTop:(width/ 40),
		marginBottom:(width/ 40),
		marginLeft:(width/ 40),
		marginRight:(width/ 40),
		width:width-((width/20)),
		backgroundColor:'rgb(28,152,207)', 
		borderRadius:5,
		justifyContent: 'center',
		alignItems:'center',
		height: (height / 12),
	},

	buttonBookText:{
		fontSize:18,
		fontWeight:'bold',
		color: '#FFFFFF',
	},

});