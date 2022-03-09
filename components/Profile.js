import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TextInput, FlatList, DevSettings, SafeAreaView } from 'react-native';
import { TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ navigation, route }) => {

    const [postList, setPostList] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [userData, setUserData] = useState('');
    const [userPP, setUserPP] = useState('');
  
    useEffect(() => { 
      checkLoggedIn();
      getUserData();
      getUserPosts();
      getUserPP();
    },[refresh]);
  
    const checkLoggedIn = async () => {
      const value = await AsyncStorage.getItem('@session_token');
      if (value == null) {
          this.props.navigation.navigate('Login');
      }
    }

    const getUserData = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        const user_id = await AsyncStorage.getItem('@user_id')
        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id, {
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
                setUserData(responseJson)
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const getUserPP = async () => {
      const value = await AsyncStorage.getItem('@session_token');
      const user_id = await AsyncStorage.getItem('@user_id')
      return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/photo", {
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
          setUserPP(data);
          setRefresh(false)
      })
      .catch((error) => {
          console.log(error);
      })
    }
  
    const getUserPosts = async () => {
      const value = await AsyncStorage.getItem('@session_token');
      const user_id = await AsyncStorage.getItem('@user_id')
      return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post", {
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
      })
      .catch((error) => {
          console.log(error);
      })
    
    }

    const refreshPage = () => {
        setRefresh(true);
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

    const editPost = (userID, postID) => {
        if(userData.user_id == userID){
            return(
                <View>
                    <TouchableOpacity
                        style={styles.standardButton}
                        onPress={() => navigation.navigate('WritePost', {edit: true, post_id: postID, friend_id: userID, name: "you"})}
                    >
                        <Text>Edit Post</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    const formatName = (firstName, lastName, userID) => {
      if(userData.user_id == userID){
        return(
          "You"
        )
      }
      else{
        return(firstName + " " + lastName);
      }
    }

    return (
    <View style={{flex:1}}>
        <View style={styles.profileHeader}>
        <Image
            style={styles.image}
            source={userPP}
        />
        <Text style={styles.profileName}>{userData.first_name} {userData.last_name}</Text>
        </View>
        <TouchableOpacity
        style={styles.standardButton}
        onPress={() => navigation.navigate('WritePost', {friend_id: userData.user_id, name: userData.first_name})}
        >
            <Text>Post on your wall</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.standardButton}
            onPress={() => refreshPage()}
        >
            <Text>Refresh Page</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.standardButton}
            onPress={() => navigation.navigate('ChangePicture')}
        >
            <Text>Change Profile Picture</Text>
        </TouchableOpacity>
        <SafeAreaView style={{flex: '1'}}>
        <ScrollView>
        <FlatList
        vertical
        style={styles.list}
        data={postList}
        renderItem={({item}) => (
        
        <View style={styles.listItem}>
            <Text style={{fontWeight: 'bold'}}>{formatName(item.author.first_name, item.author.last_name, item.author.user_id)}</Text>
            <Text>"{item.text}"</Text>
            <View>
            <Text>{formatDate(item.timestamp)} • {item.numLikes} likes</Text>
            {editPost(item.author.user_id, item.post_id)}
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

const styles = StyleSheet.create({
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

export default Profile;