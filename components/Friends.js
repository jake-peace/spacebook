import React, {useState, Component} from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TextInput, FlatList, DevSettings } from 'react-native';
import { NavigationContainer, useLinkProps } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Friends extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            user_id: '',
            first_name: '',
            friendList: [],
            ppList: []
        }

    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });
        this.getFriendRequests();
    }

    componentWillUnmount() {
    this.unsubscribe();
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
        })
    })
    .catch((error) => {
        console.log(error);
    })
    }

    getFriendRequests = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        this.user_id = await AsyncStorage.getItem('@user_id');
        return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
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
            friendList: responseJson,
            isLoading: false
            })
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
        <View>
            <Text>Friend Requests</Text>
            <Text>you have {this.state.friendList.length} friend requests</Text>
            <FlatList
            data={this.state.friendList}
            renderItem={({item}) => (
            <View>
              <Text>{item.first_name} {item.last_name} has sent you a friend request</Text>
              <Text>their photo</Text>
              <TouchableOpacity
                style={styles.acceptButton}
              >
                <Text>Accept Request</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectButton}
              >
                <Text>Reject Request</Text>
              </TouchableOpacity>
            </View>
              )}
            keyExtractor={(item,index) => item.user_id.toString()}
          />
          
        </View>
    )}
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

export default Friends;