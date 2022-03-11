import React, {useEffect, Component, useState} from 'react';
import { StyleSheet, View, Text, Image, TextInput} from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditUser = ({ navigation, route }) => {

  const {userInfo} = route.params;
  const [newEmail, setNewEmail] = useState(userInfo.email)
  const [newFirstName, setNewFirstName] = useState(userInfo.first_name)
  const [newLastName, setNewLastName] = useState(userInfo.last_name)

  useEffect(() => { 
    checkLoggedIn();
  },[]);

  const checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };

  const editDetails = async (animal) => {
    const value = await AsyncStorage.getItem('@session_token');
    const user_id = await AsyncStorage.getItem('@user_id');
    const state = {
        first_name: newFirstName,
        last_name: newLastName,
        email: newEmail,
      }

    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id, {
          method: 'PATCH',
          headers: {
            'X-Authorization':  value,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(state)
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
        <TextInput
            style={styles.textInput}
            placeholder="First Name"
            value={newFirstName}
            onChangeText={setNewFirstName}
        />
        <TextInput
            style={styles.textInput}
            placeholder="Last Name"
            value={newLastName}
            onChangeText={setNewLastName}
        />
        <TextInput
            style={styles.textInput}
            placeholder="Email"
            value={newEmail}
            onChangeText={setNewEmail}
        />
        <TouchableOpacity
            style={styles.standardButton}
            onPress={() => editDetails()}
        >
            <Text>Submit</Text>
        </TouchableOpacity>
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
textInput: {
    textAlign: 'center',
    height: '30px',
    borderRadius: '5px',
    padding: '10px',
    backgroundColor: '#ffcc0e',
    borderColor: 'black',
    borderWidth: '2px',
    marginTop: 0,
    marginLeft: '10%',
    width: '80%',
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

export default EditUser;