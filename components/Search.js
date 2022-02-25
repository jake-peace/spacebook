import React, {useState, useEffect, Component} from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TextInput, FlatList } from 'react-native';
import { NavigationContainer, useLinkProps } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchScreen = ({ navigation, route }) => {

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { 
    checkLoggedIn();
  },[]);

  const checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  }

  const performSearch = async (searchQuery) => {
    const value = await AsyncStorage.getItem('@session_token');
    const user_id = await AsyncStorage.getItem('@user_id');
    return fetch("http://localhost:3333/api/1.0.0/search?q=" + searchQuery, {
          method: 'get',
          headers: {
            'X-Authorization':  value,
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
              this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
            setFirstName(responseJson.first_name)
        })
        .catch((error) => {
            console.log(error);
        })
  }

    return (
    <View>
        <TextInput
            placeholder='Search'
            value={searchTerm}
            onChangeText={newsearchTerm => setSearchTerm(newsearchTerm)}
        />
        <TouchableOpacity
            onPress={() => navigation.navigate('SearchResult', {searchTerm: searchTerm, name: searchTerm})}
        >
            <Text>Enter</Text>
        </TouchableOpacity>
    </View>
    )
}

export default SearchScreen;