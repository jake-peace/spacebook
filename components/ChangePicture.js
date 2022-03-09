import React, {useEffect, Component} from 'react';
import { StyleSheet, View, Text, Image} from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangePicture = ({ navigation, route }) => {

  useEffect(() => { 
    checkLoggedIn();
  },[]);

  const checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };

  const changePicture = async (animal) => {
    const value = await AsyncStorage.getItem('@session_token');
    const user_id = await AsyncStorage.getItem('@user_id');
    const animalLink = "../icons/profilepics/bird.png"
    let res = await fetch(animalLink.base64);
    let blob = await res.blob();

    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/photo", {
          method: 'post',
          headers: {
            'X-Authorization':  value,
            'Content-Type': 'image/png'
          },
          body: blob
        })
        .then((response) => {
            if(response.status === 200){
                return
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else if(response.status === 400){
              console.log("Bad request")
            }else if(response.status === 404){
              console.log("Not Found")
            }else if(response.status === 400){
                console.log("Server error")
            }else{
                throw 'Something went wrong';
            }
        })
        .then(() => {
            console.log("Successful")
            navigation.goBack();
        })
        .catch((error) => {
            console.log(error);
        })
  }

    return (
    <View style={{alignContent: 'center', justifyContent: 'center', margin:'auto'}}>
        <Text>Select a new picture from the options below.</Text>
        <View style={styles.container}>
            <TouchableOpacity onPress={() => changePicture('bird')}>
                <Image
                    source={require('../icons/profilepics/bird.png')}
                    style={styles.image}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changePicture('crab')}>
                <Image
                    source={require('../icons/profilepics/crab.png')}
                    style={styles.image}
                />
            </TouchableOpacity>
        </View>
        <View style={styles.container}>
            <TouchableOpacity onPress={() => changePicture('donkey')}>
                <Image
                    source={require('../icons/profilepics/donkey.png')}
                    style={styles.image}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changePicture('sheep')}>
                <Image
                    source={require('../icons/profilepics/sheep.png')}
                    style={styles.image}
                />
            </TouchableOpacity>
        </View>
        <View style={styles.container}>
            <TouchableOpacity onPress={() => changePicture('squirrel')}>
                <Image
                    source={require('../icons/profilepics/squirrel.png')}
                    style={styles.image}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changePicture('turkey')}>
                <Image
                    source={require('../icons/profilepics/turkey.png')}
                    style={styles.image}
                />
            </TouchableOpacity>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    flexDirection: 'row',
    },
  
  image: {
    height: '100px',
    width: '100px',
    borderRadius: '50px',
    borderColor: '#ffcc0e',
    borderWidth: '5px',
},

  standardButton: {
    margin: 'auto',
    marginTop: '10px',
    marginBottom: '10px',
    backgroundColor: 'white',
    color: '#ffcc0e',
    borderColor: '#ffcc0e',
    borderWidth: '2px',
    padding: '7.5px',
    borderRadius: '5px',
    width: '40%',
    textAlign: 'center',
  },
})

export default ChangePicture;