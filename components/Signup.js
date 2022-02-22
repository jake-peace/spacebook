import React, {useState, useEffect, Component} from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TextInput, FlatList } from 'react-native';
import { NavigationContainer, useLinkProps } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Signup extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: false,
      listData: [],
    }
  }

  render() {

    if (this.state.isLoading){
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>not be long...</Text>
        </View>
      );
    }else{
      return (
        <View>
          <Text>oh you wanna sign up???</Text>
          <FlatList>
            
          </FlatList>
        </View>
      );
    }
    
  }
}

export default Signup;