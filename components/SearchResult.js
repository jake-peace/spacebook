import React, {useState, useEffect, Component} from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TextInput, FlatList } from 'react-native';
import { NavigationContainer, useLinkProps } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchResult = ({ navigation, route }) => {

  const {searchTerm} = route.params;
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => { 
    checkLoggedIn();
    performSearch(searchTerm);
  },[]);

  const checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  }

  const performSearch = async (searchQuery) => {
    const value = await AsyncStorage.getItem('@session_token');
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
            setSearchResults(responseJson);
        })
        .catch((error) => {
            console.log(error);
        })
  }

    return (
    <View>
      <FlatList
            data={searchResults}
            renderItem={({item, index}) => (
            <View>
              <Text>{item.user_givenname} {item.user_familyname}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('IndividualFriend', {friend_id: item.user_id, name: item.user_givenname})}
              >
                <Text>View {item.first_name}'s profile</Text>
              </TouchableOpacity>
            </View>
              )}
            keyExtractor={(item,index) => item.user_id.toString()}
          />
        
    </View>
    )
}

export default SearchResult;