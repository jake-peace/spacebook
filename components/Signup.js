import React, {useState, useEffect, Component} from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TextInput, FlatList } from 'react-native';
import { NavigationContainer, useLinkProps } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validate } from 'react-email-validator';

const Signup = ({ navigation }) => {

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successful, setSuccessful] = useState(false);
  const [badPassword, setBadPassword] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [badEmail, setBadEmail] = useState(false)

  useEffect(() => { 

  },[refresh]);

  const createUser = async () => {
    const state = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password
    }

    if(password.length < 6){
      setBadPassword(true)
      return;
    }
    else{setBadPassword(false)}

    if(validate(email) == false){
      setBadEmail(true)
      return;
    }else{setBadEmail(false)}
    
    // validation for email??
    // password validation is over 5 characters
    // see if you can use the npm extension

    {setPassword('')}
    //Validation here...
  
    return fetch("http://localhost:3333/api/1.0.0/user", {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(state)
    })
    .then((response) => {
        if(response.status === 201){
            return response.json()
        }else if(response.status === 400){
            throw 'Bad request';
        }else{
            throw 'Something went wrong';
        }
    })
    .then(async (responseJson) => {
            console.log(responseJson);
            {() => setFirstName('')}
            {() => setLastName('')}
            {() => setEmail('')}
            {() => setPassword('')}
            setSuccessful(true);
    })
    .catch((error) => {
        console.log(error);
    })
  
  }

  const error = () => {
    if(badPassword == true){
      return(
        <View>
          <Text style={styles.header}>Password is not strong enough.</Text>
        </View>
      )
    }
    if(badEmail == true){
      return(
        <View>
          <Text style={styles.header}>Email is not valid.</Text>
        </View>
      )
    }
  }

  if(successful == true)
  {
    return(
      <View style={styles.container}>
        <Text style={styles.header}>Account created!</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text>Back to login</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {error()}
      <Text style={styles.textInputLabel} >First Name</Text>
      <TextInput
        style={styles.textInput}
        placeholder='first name'
        value={firstName}
        onChangeText={newFirstName => setFirstName(newFirstName)}
      />
      <Text style={styles.textInputLabel} >Last Name</Text>
      <TextInput
        style={styles.textInput}
        placeholder='last name'
        value={lastName}
        onChangeText={newLastName => setLastName(newLastName)}
      />
      <Text style={styles.textInputLabel} >Email</Text>
      <TextInput
        style={styles.textInput}
        placeholder='email@email.com'
        value={email}
        onChangeText={newEmail => setEmail(newEmail)}
      />
      <Text style={styles.textInputLabel} >Password</Text>
      <TextInput
        style={styles.textInput}
        placeholder='password'
        secureTextEntry='true'
        value={password}
        onChangeText={newPassword => setPassword(newPassword)}
      />
      <TouchableOpacity
        title="Login Button"
        style={styles.loginButton}
        onPress={() => createUser()}
      >
        <Text>Signup</Text>
      </TouchableOpacity>
    </View>
  );
}


function SignupScreen() {
  return (
    <ScrollView>
      <View>
        <Text>signupbelow</Text>
        
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
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

  textInputLabel: {
    flex: 1,
    marginLeft: '10%',
    marginTop: '1%'
  },

  container: {
    alignItems: 'flex-start',
    margin: 'auto',
    width: '90%',
    padding: 5,
    backgroundColor: 'white',
    borderRadius: '5px',
  },

  header: {
    fontWeight: 'bold',
    alignContent: 'center',
    margin: 'auto',
    textAlign:'center', 
    padding: 5, 
  },

  loginButton: {
    margin: 'auto',
    marginTop: '10px',
    backgroundColor: 'white',
    color: '#ffcc0e',
    borderColor: '#ffcc0e',
    borderWidth: '2px',
    padding: '7.5px',
    borderRadius: '5px',
    width: '60%',
    textAlign: 'center',
  }
});

export default Signup;