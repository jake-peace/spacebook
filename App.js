import React, {useState} from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TextInput } from 'react-native';
import { NavigationContainer, useLinkProps } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
//import { createDrawerNavigator } from '@react-navigation/drawer';



import LoginScreen from './components/login';
import SignupScreen from './components/Signup';
import FeedScreen from './components/Feed';
import ProfileScreen from './components/Profile';
import FriendScreen from './components/Friends';




//const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const Main = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedScreen}/>
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Friends" component={FriendScreen} />
    </Tab.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={LoginScreen} options={{title:'SpaceBook'}} />
        <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        />
        <Stack.Screen name="Main" component={Main} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
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


export default App;