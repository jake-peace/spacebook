import React, {useState, Component} from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TextInput, FlatList, DevSettings } from 'react-native';
import { NavigationContainer, useLinkProps } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Profile extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            userData: [],
            userPosts: [],
            user_id: '',
            first_name: '',
            ppURL: ''
        }

    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });
    
        this.getUserData();
        this.getUserPosts();
        this.getPP();
    }

    componentWillUnmount() {
    this.unsubscribe();
    }

    getUserPosts = async () => {
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
                userPosts: responseJson
              })
              console.log(responseJson);
            })
            .catch((error) => {
                console.log(error);
            })
      }

    getUserData = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    this.user_id = await AsyncStorage.getItem('@user_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + this.user_id, {
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
        userData: responseJson
        })
        console.log(responseJson);
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

    getPP = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        this.user_id = await AsyncStorage.getItem('@user_id');
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.user_id + "/photo", {
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
            this.setState({
            ppURL: data})
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
    return (
        
        <View>
            <Text>{this.state.userData.first_name} {this.state.userData.last_name}</Text>
            <Text>you have {this.state.userData.friend_count} friends :( </Text>
            <Image
                source={{
                    uri: this.state.ppURL}}
                    style={styles.image}
            />
            <Text>Your Posts:</Text>
            <FlatList
            data={this.state.userPosts}
            
            renderItem={({item}) => (
            
            <View>
              
              <Text>{this.formatDate(item.timestamp)}</Text>  
              <Text>you said "{item.text}"</Text>
              <Text>{item.numLikes} likes</Text>
            </View>
              )}
            keyExtractor={(item,index) => item.post_id.toString()}
          />
          <TouchableOpacity
            style={styles.postButton}
          >
            <Text>Post</Text>
          </TouchableOpacity>
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

export default Profile;