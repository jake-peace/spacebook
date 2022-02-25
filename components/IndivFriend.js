import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TextInput, FlatList, DevSettings } from 'react-native';
import { NavigationContainer, useLinkProps } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IndivFriend = ({ navigation, route }) => {

    const {friend_id} = route.params;
    const {name} = route.params;
    const [postList, setPostList] = useState([]);
    const [isMessage, setIsMessage] = useState(false);
    const [isFriends, setIsFriends] = useState(false);
  
    useEffect(() => { 
      checkLoggedIn();
      getFriendsPosts();
    },[isMessage]);
  
    const checkLoggedIn = async () => {
      const value = await AsyncStorage.getItem('@session_token');
      if (value == null) {
          this.props.navigation.navigate('Login');
      }
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
              throw 'Invalid email or password';
          }else{
              throw 'Something went wrong';
          }
      })
      .then(async (responseJson) => {
              setPostList(responseJson);
              setIsFriends(true);
      })
      .catch((error) => {
          console.log(error);
      })
    
    }

    const likePost = async (postId, like) => {
        const value = await AsyncStorage.getItem('@session_token');
        const user_id = await AsyncStorage.getItem('@user_id');
        let methodType = '';
        if(like == true){methodType = 'post'}
        else{methodType = 'delete'}
        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + postId + "/like", {
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
                  throw 'Invalid email or password';
              }else{
                  setIsMessage(true);
                  throw 'Something went wrong';
              }
          })
          .then(async (responseJson) => {
                  console.log(responseJson);
          })
          .catch((error) => {
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
  
    if(isMessage == true)
    {
      return(
        <View>
          <Text>You've already liked this post.</Text>
          <TouchableOpacity
            onPress = {() => setIsMessage(false)}
          >
            <Text>Go Back</Text>
          </TouchableOpacity>
        </View>
      )
    }
    else if(isFriends == false){
      return (
        <View>
          <Text>You aren't friends with {name}!</Text>
        </View>
      )
    }
    else{
      return (
        <View>
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