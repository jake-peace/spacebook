import React, {useState} from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

  const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [headerText, setHeaderText] = useState('Login')

    const login = async () => {
      const state = {
        email: email,
        password: password
      }

      {setEmail('')}
      {setPassword('')}
    
      return fetch("http://localhost:3333/api/1.0.0/login", {
          method: 'post',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(state)
      })
      .then((response) => {
          if(response.status === 200){
              return response.json()
          }else if(response.status === 400){
              setHeaderText('Invalid email or password')
              throw 'Invalid email or password';
          }else{
              throw 'Something went wrong';
          }
      })
      .then(async (responseJson) => {
              console.log(responseJson);
              await AsyncStorage.setItem('@session_token', responseJson.token);
              await AsyncStorage.setItem('@user_id', responseJson.id);
              {() => setEmail('')}
              {() => setPassword('')}
              navigation.navigate('Main');
      })
      .catch((error) => {
          console.log(error);
      })
    
    }

    return (
      <View style={styles.container}>
        <Text style={styles.header} >{headerText}</Text>
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
          onPress={() => login()}
        >
          <Text>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          title="Signup Button"
          onPress={() => navigation.navigate('Signup')}
          style={styles.loginButton}
        >
          <Text>Not got an account?</Text>
        </TouchableOpacity>
      </View>
    );
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

export default LoginScreen;