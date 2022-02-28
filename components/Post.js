import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TextInput, FlatList, DevSettings } from 'react-native';
import { NavigationContainer, useLinkProps } from '@react-navigation/native';
import { TouchableHighlight, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IndivFriend = ({ navigation: { goBack }, route }) => {

    const {friend_id} = route.params;
    const {name} = route.params;
    const [refresh, setRefresh] = useState(false);
    const [postText, setPostText] = useState('');
    const [postSent, setPostSent] = useState(false);
  
    useEffect(() => { 
      checkLoggedIn();
      setRefresh(false);
    },[refresh]);
  
    const checkLoggedIn = async () => {
      const value = await AsyncStorage.getItem('@session_token');
      if (value == null) {
          this.props.navigation.navigate('Login');
      }
    }

    const postToWall = async () => {
      const state = {
          text: postText
      }  
      const value = await AsyncStorage.getItem('@session_token');
      return fetch("http://localhost:3333/api/1.0.0/user/" + friend_id + "/post", {
          method: 'post',
          headers: {
              'X-Authorization': value,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(state)
      })
      .then((response) => {
          if(response.status === 201){
              return response.json()
          }else if(response.status === 403){
              throw 'Request already sent';
          }else{
              console.log(state)
              throw 'Something went wrong';
          }
      })
      .then(async (responseJson) => {7
          setPostSent(true)
          setPostText('')  
          setRefresh(true)
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

    const error = () => {
        if(postSent == true){
            return(
                <View>
                    <Text>Post sent!</Text>
                </View>
            )
        }
        return(
            <View>
            <Text></Text>
            </View>
        )
    }

    return (
    <View>
        <TouchableOpacity
            onPress={() => goBack()}
        >
            <Text>Go Back</Text>
        </TouchableOpacity>
        {error()}
        <Text>Posting to {name}'s wall</Text>
        <TextInput
            multiline={true}
            numberOfLines={5}
            placeholder="What's on your mind"
            value={postText}
            onChangeText={newPostText => setPostText(newPostText)}
        />
        <TouchableOpacity
            onPress={() => postToWall()}
        >
            <Text>Send Post</Text>
        </TouchableOpacity>
    </View>
    )

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