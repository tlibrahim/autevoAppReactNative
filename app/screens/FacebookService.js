import React from 'react'
import { Dimensions, } from 'react-native';
import FBSDK from 'react-native-fbsdk'
import AsyncStorage from '@react-native-community/async-storage'

const { LoginButton, AccessToken, GraphRequest, GraphRequestManager } = FBSDK
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class FacebookService {
  constructor() {
    this.requestManager = new GraphRequestManager()
  }

  makeLoginButton(callback) {
    return (
      <LoginButton
        readPermissions={["public_profile"]}
        onLoginFinished={(error, result) => {
          if (error) {

          } else if (result.isCancelled) {

          } else {
            AccessToken.getCurrentAccessToken()
              .then((data) => {
                callback(data.accessToken)
                AsyncStorage.setItem('Facebook_Token', (data.accessToken).toString());
                AsyncStorage.setItem('Facebook_Id', (data.userID).toString());
                Alert.alert(data.permissions)
                try{
                  const response = fetch('https://autevo.net/Api/Login?loginType=2&facebook_id='+data.userID+'')
                  const json = response.json()
                  if(json.msg == 1){
                    const _userID = AsyncStorage.setItem('User_Id', (json.user_id).toString())
                    const _userToken = AsyncStorage.setItem('User_Token', (json.tokin).toString())
                  }
                }catch{
                  console.log("Error retrieving data" + error);
                }
              })
              .catch(error => {
                console.log(error)
              })
          }
        }}
        // style={{width:250, height:(height/20), backgroundColor:'rgb(80,103,175)', justifyContent:'center', 
        // alignItems:'center', borderRadius:6, marginTop:(height/30)}} 
        />
    )
  }

  makeLogoutButton(callback) {
    return (
      <LoginButton onLogoutFinished={ async() => {
        await AsyncStorage.clear();
        callback()
      }} />
    )
  }

  async fetchProfile(callback) {
    return new Promise((resolve, reject) => {
      const request = new GraphRequest(
        '/me',
        null,
        (error, result) => {
          if (result) {
            const profile = result
            profile.avatar = `https://graph.facebook.com/${result.id}/picture`
            resolve(profile)
          } else {
            reject(error)
          }
        }
      )
      this.requestManager.addRequest(request).start()
    })
  }
}

export const facebookService = new FacebookService()