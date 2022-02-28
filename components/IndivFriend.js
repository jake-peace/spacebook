import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TextInput, FlatList, DevSettings } from 'react-native';
import { NavigationContainer, useLinkProps } from '@react-navigation/native';
import { TouchableHighlight, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IndivFriend = ({ navigation, route }) => {

    const {friend_id} = route.params;
    const {name} = route.params;
    const {lastName} = route.params;
    const [postList, setPostList] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [isFriends, setIsFriends] = useState(false);
    const [alreadyRequested, setAlreadyRequested] = useState(false)
    const [friendPP, setFriendPP] = useState('')
  
    useEffect(() => { 
      checkLoggedIn();
      getFriendsPosts();
      getFriendPP();
    },[refresh]);
  
    const checkLoggedIn = async () => {
      const value = await AsyncStorage.getItem('@session_token');
      if (value == null) {
          this.props.navigation.navigate('Login');
      }
    }

    const getFriendPP = async () => {
      const value = await AsyncStorage.getItem('@session_token');
      return fetch("http://localhost:3333/api/1.0.0/user/" + friend_id + "/photo", {
          method: 'get',
          headers: {
          'X-Authorization':  value,
          'Content-Type': 'application/json'
          }
      })
      .then((response) => {
          if(response.status === 200){
              return response.blob();
          }else if(response.status === 401){
              this.props.navigation.navigate("Login");
          }else{
              throw 'Something went wrong';
          }
      })
      .then((responseBlob) => {
          let data = URL.createObjectURL(responseBlob);
          setFriendPP(data);
      })
      .catch((error) => {
          console.log(error);
      })
    }
  
    const getFriendsPosts = async () => {
      const value = await AsyncStorage.getItem('@session_token');
      return fetch("http://localhost:3333/api/1.0.0/user/" + friend_id + "/post", {
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
              throw 'Invalid usename or passeord';
          }else{
              throw 'Something went wrong';
          }
      })
      .then(async (responseJson) => {
              setPostList(responseJson);
              setIsFriends(true);
              setRefresh(false)
      })
      .catch((error) => {
          console.log(error);
      })
    
    }

    const sendFriendRequest = async () => {
      const value = await AsyncStorage.getItem('@session_token');
      return fetch("http://localhost:3333/api/1.0.0/user/" + friend_id + "/friends", {
          method: 'post',
          headers: {
              'X-Authorization': value,
              'Content-Type': 'application/json'
          },
      })
      .then((response) => {
          if(response.status === 200){
              return response.json()
          }else if(response.status === 403){
              setAlreadyRequested(true);
              setRefresh(true)
              throw 'Request already sent';
          }else{
              throw 'Something went wrong';
          }
      })
      .then(async (responseJson) => {
          setRefresh(true)
          setAlreadyRequested(false)
      })
      .catch((error) => {
          console.log(error);
      })
    
    }

    const likePost = async (postId, like) => {
        const value = await AsyncStorage.getItem('@session_token');
        let methodType = '';
        if(like == true){methodType = 'POST'}
        else{methodType = 'DELETE'};
        return fetch("http://localhost:3333/api/1.0.0/user/" + friend_id + "/post/" + postId + "/like", {
              method: methodType,
              headers: {
                  'X-Authorization': value,
                  'Content-Type': 'application/json'
              },
          })
          .then((response) => {
              if(response.status === 200){
                  return response.json()
              }else if(response.status === 400){
                  throw 'Already liked post';
              }else if(response.status === 404){
                  throw 'Not found'
              }else{
                  throw 'Something went wrong';
              }
          })
          .then(async (responseJson) => {
                  console.log("hello")
          })
          .catch((error) => {
              setRefresh(true)
              console.log(error);
          })
    }

    const formatDate = (timestamp) => {
        var date = new Date(timestamp);
        return (
            date.getDay().toString() + "/" + 
            date.getMonth().toString() + "/" +
            date.getFullYear().toString() + " at " +
            date.getHours().toString() + ":" +
            date.getMinutes().toString());
    }

    const error = () => {
      if(alreadyRequested == true){
        return(
          <View>
            <Text>You've already sent a friend request to {name}.</Text>
          </View>
        )
      }
    }
  
    if(isFriends == false){
      return (
        <View>
          {error()}
          <Text>You aren't friends with {name}!</Text>
          <TouchableOpacity
            onPress={() => sendFriendRequest()}
          >
            <Text>Send a friend request</Text>
          </TouchableOpacity>
        </View>
      )
    }
    else{
      return (
        <View>
          {error()}
          <Image
              style={styles.image}
              source={friendPP}
          />
          <Text>{name} {lastName}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('WritePost', {friend_id: friend_id, name: name})}
          >
            <Text>Post on {name}'s wall</Text>
          </TouchableOpacity>
          <FlatList
            data={postList}
            renderItem={({item}) => (
            <View>
              <Text>on {formatDate(item.timestamp)}, {item.author.first_name} {item.author.last_name} said: </Text>
              <Text>"{item.text}"</Text>
              <Text>{item.numLikes} likes</Text>
              <TouchableOpacity
                onPress={() => likePost(item.post_id, true)}
              >
                <Text>Like post</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => likePost(item.post_id, false)}
              >
                <Text>Unlike post</Text>
              </TouchableOpacity>
            </View>
              )}
            keyExtractor={(item,index) => item.post_id.toString()}
          />
        </View>
      )

    }
    
  
  }

const styles = StyleSheet.create({
    image: {
        height: '100px',
        width: '100px',
        borderRadius: '50px'
    },

    postButton: {
        borderRadius: '25px',
        height: '50px',
        width: '50px',
        backgroundColor: '#ffcc0e',
        textAlign: 'center',
        justifyContent: 'center',
        color: 'white'
    }
})

export default IndivFriend;