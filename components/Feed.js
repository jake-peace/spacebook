import React, {useState, useEffect, Component} from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TextInput, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FeedScreen = ({ navigation, route }) => {

  const [firstName, setFirstName] = useState('');
  const [friendList, setFriendList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    checkLoggedIn();
    getFriends();
    getData();
  },[isLoading]);

  const checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        navigation.navigate('Login');
    }
  }

  const getFriends = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const user_id = await AsyncStorage.getItem('@user_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/friends", {
        method: 'get',
        headers: {
            'X-Authorization': value,
            'Content-Type': 'application/json'
        },
    })
    .then((response) => {
        if(response.status === 200){
            return response.json()
        }else if(response.status === 400){
            throw 'Invalid email or password';
        }else{
            throw 'Something went wrong';
        }
    })
    .then(async (responseJson) => {
        setFriendList(responseJson)
        setIsLoading(false);
    })
    .catch((error) => {
        console.log(error);
    })
  }

  const logout = async () => {
    await AsyncStorage.setItem('@session_token', null);
    await AsyncStorage.setItem('@user_id', null);
    navigation.navigate("Login");
  }

  const getData = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const user_id = await AsyncStorage.getItem('@user_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id, {
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
                navigation.navigate("Login");
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

  const refreshPage = () => {
    setIsLoading(true);
  }

  if (isLoading == true){
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
    }
    else{
      return (
        <View>
          <View style={styles.topButtonContainer}>
            <TouchableOpacity
              style={styles.standardButton}
              onPress={() => refreshPage()}
            >
              <Text>Refresh Page</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.standardButton}
              onPress={() => logout()}
            >
              <Text>Logout</Text>
            </TouchableOpacity>
          </View>
        <Text style={styles.header}>Welcome {firstName}! Your friends are below.</Text>
          <FlatList
            data={friendList}
            renderItem={({item, index}) => (
            <TouchableOpacity style={styles.listItem}
            onPress={() => navigation.navigate('IndividualFriend', {friend_id: item.user_id, name: item.user_givenname, lastName: item.user_familyname})}
            >
              <Text style={styles.listName}>{item.user_givenname} {item.user_familyname}</Text>
              <Text style={styles.listLink}>View {item.user_givenname}'s profile</Text>
            </TouchableOpacity>
              )}
            keyExtractor={(item,index) => item.user_id.toString()}
          />
        </View>
      )
    }
}

const styles = StyleSheet.create({
  topButtonContainer: {
    alignContent: 'center',
    flexDirection: 'row',
  },

  standardButton: {
    margin: 'auto',
    marginTop: '10px',
    backgroundColor: 'white',
    color: '#ffcc0e',
    borderColor: '#ffcc0e',
    borderWidth: '2px',
    padding: '7.5px',
    borderRadius: '5px',
    width: '40%',
    textAlign: 'center',
  },

  image: {
      height: '100px',
      width: '100px',
      borderRadius: '50px'
  },

  header: {
    fontWeight: 'bold',
    alignContent: 'center',
    margin: 'auto',
    textAlign:'center', 
    padding: 5, 
  },

  listItem: {
    borderColor: '#ffcc0e',
    borderWidth: '10px',
    margin: '10px',
    padding: '5px',
    borderRadius: '20px',
    alignItems: 'left',
    justifyContent: 'center'
  },

  listLink: {
    color: '#000000',
    textAlign: "right",
  },

  listName: {
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign:'left', 
    padding: 5, 
  }


})

export default FeedScreen;