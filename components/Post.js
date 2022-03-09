import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TextInput, FlatList, DevSettings } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IndivFriend = ({ navigation: { goBack }, route }) => {

    const {friend_id} = route.params;
    const {name} = route.params;
    const {edit} = route.params;
    const {post_id} = route.params;
    const [refresh, setRefresh] = useState(false);
    const [postText, setPostText] = useState('');
    const [postSent, setPostSent] = useState(false);
    const [methodType, setMethodType] = useState('post')
  
    useEffect(() => { 
      checkLoggedIn();
      checkIfEdit();
      setRefresh(false);
    },[refresh]);
  
    const checkLoggedIn = async () => {
      const value = await AsyncStorage.getItem('@session_token');
      if (value == null) {
          this.props.navigation.navigate('Login');
      }
    }

    const checkIfEdit = async () => {
      if(edit == true){
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/" + friend_id + "/post/" + post_id, {
            method: 'GET',
            headers: {
                'X-Authorization': value,
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 403){
                throw 'Nope!';
            }else{
                throw 'Something went wrong';
            }
        })
        .then(async (responseJson) => {7
            setPostText(responseJson.text)
            setMethodType('PATCH')
            edit = false
            setRefresh(true)
        })
        .catch((error) => {
            console.log(error);
        })
      }
      
    }

    const postToWall = async () => {
      const state = {
          text: postText
      }
      let postID = '';
      if(methodType == 'PATCH'){postID = '/' + post_id} 
      const value = await AsyncStorage.getItem('@session_token');
      return fetch("http://localhost:3333/api/1.0.0/user/" + friend_id + "/post" + postID, {
          method: methodType,
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
    }

    return (
    <View style={{alignContent: 'center', justifyContent: 'center'}}>
        <TouchableOpacity
            style={styles.standardButton}
            onPress={() => goBack()}
        >
            <Text>Go Back</Text>
        </TouchableOpacity>
        {error()}
        <Text>Posting to {name}'s wall</Text>
        <TextInput
            style={styles.listItem}
            multiline={true}
            numberOfLines={5}
            placeholder="What's on your mind"
            value={postText}
            onChangeText={setPostText}
        />
        <TouchableOpacity
            style={styles.standardButton}
            onPress={() => postToWall()}
        >
            <Text>Send Post</Text>
        </TouchableOpacity>
    </View>
    )

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

export default IndivFriend;