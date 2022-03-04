import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TextInput, FlatList, DevSettings, SafeAreaView } from 'react-native';
import { NavigationContainer, useLinkProps } from '@react-navigation/native';
import { TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-web';
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
    const [alreadyLiked, setAlreadyLiked] = useState(false)
    const [yourPost, setYourPost] = useState(false)
    const [myID, setMyID] = useState('');
    const [errorPost, setErrorPost] = useState(999);
    const [requestSent, setRequestSent] = useState(false);
  
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
      setMyID(await AsyncStorage.getItem('@user_id'));
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
              throw 'Invalid username or passeord';
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
          if(response.status === 201){
              return
          }else if(response.status === 403){
              setAlreadyRequested(true);
              setRefresh(true)
              throw 'Request already sent';
          }else{
              throw 'Something went wrong';
          }
      })
      .then(async () => {
          setRefresh(true)
          setAlreadyRequested(false)
          setRequestSent(true)
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
        console.log("LIKED POST SUCCESSFUL " + friend_id + " " + postId)
        return fetch("http://localhost:3333/api/1.0.0/user/" + friend_id + "/post/" + postId + "/like", {
              method: methodType,
              headers: {
                  'X-Authorization': value,
                  'Content-Type': 'application/json'
              },
          })
          .then((response) => {
              if(response.status === 200){
                  return
              }else if(response.status === 400){
                  setRefresh(true);
                  setAlreadyLiked(true);
                  setErrorPost(postId);
                  throw 'Already liked post';
              }else if(response.status === 403){
                  setYourPost(true)
                  setErrorPost(postId)
                  throw 'Not found'
              }else{
                  throw 'Something went wrong';
              }
          })
          .then(async () => {
                  setAlreadyLiked(false);
                  setYourPost(false)
                  setErrorPost(999);
                  setRefresh(true);
          })
          .catch((error) => {
              if(alreadyLiked == false){setRefresh(true)}
              console.log(error);
          })
    }

    const formatDate = (timestamp) => {
        var date = new Date(timestamp);
        return (
            date.getHours().toString() + ":" +
            date.getMinutes().toString() + " • " +
            date.getDate().toString() + "/" + 
            (date.getMonth() + 1).toString() + "/" +
            date.getFullYear().toString());
    }

    const error = (post_id) => {
      if(alreadyRequested == true && errorPost == post_id){
        return(
          <View>
            <Text style={styles.profileName}>You've already sent a friend request to {name}.</Text>
          </View>
        )
      }
      if(requestSent == true){
        return(
          <View>
            <Text style={styles.profileName}>Request Sent!</Text>
          </View>
        )
      }
      if(alreadyLiked == true && errorPost == post_id){
        return(
          <View>
            <Text>You've already liked this post.</Text>
          </View>
        )
      }
      if(yourPost == true && errorPost == post_id){
        return(
          <View>
            <Text>You can't like posts that you wrote.</Text>
          </View>
        )
      }
    }

    const timeAndLikes = (timestamp, numLikes) => {
      if(numLikes == 1){
        return (
          <View>
            <Text>{formatDate(timestamp)} • {numLikes} like</Text>
          </View>
        )
      }
      else{
        return (
          <View>
            <Text>{formatDate(timestamp)} • {numLikes} likes</Text>
          </View>
        )
      }
    }

    const formatName = (firstName, lastName, userID) => {
      if(myID == userID){
        return(
          "You"
        )
      }
      else{
        return(firstName + " " + lastName);
      }
    }
  
    if(isFriends == false){
      return (
        <View>
          {error(999)}
          <Text style={styles.listItem}>You aren't friends with {name}!</Text>
          <TouchableOpacity
            style={styles.standardButton}
            onPress={() => sendFriendRequest()}
          >
            <Text>Send a friend request</Text>
          </TouchableOpacity>
        </View>
      )
    }
    else{
      return (
        <View style={{flex:1}}>
          
          <View style={styles.profileHeader}>
            <Image
                style={styles.image}
                source={friendPP}
            />
            <Text style={styles.profileName}>{name} {lastName}</Text>
          </View>
          <TouchableOpacity
            style={styles.standardButton}
            onPress={() => navigation.navigate('WritePost', {friend_id: friend_id, name: name})}
          >
            <Text>Post on {name}'s wall</Text>
          </TouchableOpacity>
          <SafeAreaView style={{flex: '1'}}>
          <ScrollView>
          <FlatList
            vertical
            style={styles.list}
            data={postList}
            renderItem={({item}) => (
            
            <View style={styles.listItem}>
              {error(item.post_id)}
              <Text style={{fontWeight:'bold'}}>{formatName(item.author.first_name, item.author.last_name, item.author.user_id)}</Text>
              <Text>"{item.text}"</Text>
              {timeAndLikes(item.timestamp, item.numLikes)}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.standardButton}
                  onPress={() => likePost(item.post_id, true)}
                >
                  <Text>Like post</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.standardButton}
                  onPress={() => likePost(item.post_id, false)}
                >
                  <Text>Unlike post</Text>
                </TouchableOpacity>
              </View>
            </View>
            
              )}
            keyExtractor={(item,index) => item.post_id.toString()}
          />
          </ScrollView>
          </SafeAreaView>
        </View>
      )

    }
    
  
  }

const styles = StyleSheet.create({
  buttonContainer: {
    alignContent: 'center',
    flexDirection: 'row',
  },

    profileHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      padding: '10px',
      margin: 'auto',
      justifyContent: 'center',
    },

    list: {
      margin: '5px',
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

    profileName: {
      fontSize: '30px',
      fontStyle: 'bold',
      margin: '15px',
    },

    image: {
        height: '100px',
        width: '100px',
        borderRadius: '50px',
        borderColor: '#ffcc0e',
        borderWidth: '5px',
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