import React, {useState, useEffect, Component} from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TextInput, FlatList } from 'react-native';
import { NavigationContainer, useLinkProps } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { createDrawerNavigator } from '@react-navigation/drawer';


/*
const feed = ({navigation}) => {

  const getData = async () => {
    return await AsyncStorage.getItem('@user_id');
  }

  const user_id = getData('');

  //const userid = await AsyncStorage.getItem('@user_id')

  return (
    <ScrollView>
        <Text>this is the main screen for the posts</Text>
        <Text>{user_id}</Text>
    </ScrollView>
  );
}
*/

class feed extends Component {

  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
      user_id: '',
      first_name: '',
      friendList: [],
      postList: [],
      tempPostList: []
    }

  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  
    this.getData();
    this.getListOfFriends();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getData = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    this.user_id = await AsyncStorage.getItem('@user_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + this.user_id + "/post", {
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
          this.setState({
            isLoading: false,
            listData: responseJson
          })
          console.log(responseJson);
          this.anotherOne();
        })
        .catch((error) => {
            console.log(error);
        })
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  }

  anotherOne = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + this.user_id, {
          method: 'get',
          headers: {
              'X-Authorization': value,
              'Content-Type': 'application/json'
          },
          //body: JSON.stringify(state)
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
              console.log(responseJson);
              console.log(responseJson.first_name);
              this.setState({first_name: responseJson.first_name})
      })
      .catch((error) => {
          console.log(error);
      })
    }

  getListOfFriends = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    this.user_id = await AsyncStorage.getItem('@user_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + this.user_id + "/friends", {
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
              this.setState({friendList: responseJson})
      })
      .catch((error) => {
          console.log(error);
      })  
  }

  getAndSortPosts() {
    //this.getPostsOfFriend("9");
    console.log(this.getPostsOfFriend("9"));
    return this.getPostsOfFriend("9");
    //var addition = this.state.postList.concat(this.state.tempPostList);
    //console.log(addition);
    //this.setState({ postList: addition })
    //for(var i = 0; i < this.state.friendList.length; i++){
      //var addition = this.state.postList.concat(this.getPostsOfFriend(this.state.friendList[i].user_id).value);
      //this.setState({ postList: addition })
    //}
    //this.sortPosts();
  }

  sortPosts() {
    let sortedPostList = this.state.postList.sort((a, b) => {
      return b.timestamp - a.timestamp;
    });

    this.setState({
      postList: sortedPostList
    });
    console.log(sortedPostList);
  }

  getPostsOfFriend = async (friendID) => {
    const value = await AsyncStorage.getItem('@session_token');
    this.user_id = await AsyncStorage.getItem('@user_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + friendID + "/post", {
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
            return responseJson;
      })
      .catch((error) => {
          console.log(error);
      })
  }

  likePost = async (postId) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + this.user_id + "/post/" + postId + "/like", {
          method: 'post',
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
              console.log(responseJson);
      })
      .catch((error) => {
          console.log(error);
      })
  }

  formatDate(timestamp) {
    var date = new Date(timestamp);
    return (
        date.getDay().toString() + "/" + 
        date.getMonth().toString() + "/" +
        date.getFullYear().toString() + " at " +
        date.getHours().toString() + ":" +
        date.getMinutes().toString());
}

  render() {
    console.log(this.getAndSortPosts());
    console.log(this.getPostsOfFriend("9"));
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
        console.log(this.state.sortedPostList),
        <View>
          <Text>Welcome {this.state.first_name}. Your friend's posts are below.</Text>
          <FlatList
            data={this.getPostsOfFriend("9")}
            renderItem={({item}) => (
            <View>
              <Text>On {this.formatDate(item.timestamp)},</Text>
              <Text>{item.author.first_name} {item.author.last_name} said "{item.text}"</Text>
              <TouchableOpacity
              >
                <Text>Like this post</Text>
              </TouchableOpacity>
              <Text>{item.numLikes} likes</Text>
            </View>
              )}
            //keyExtractor={(item,index) => item.user_id.toString()}
          />
        </View>
      );
    }
    
  }
}

export default feed;