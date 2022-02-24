import React, {useState, Component, useEffect} from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TextInput, FlatList, DevSettings } from 'react-native';
import { NavigationContainer, useLinkProps } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Friends = ({ navigation, route }) => {

    const [firstName, setFirstName] = useState('');
    const [friendList, setFriendList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState(0);
    const [ppList, setPPList] = useState([]);
  
    useEffect(() => { 
      checkLoggedIn();
      getFriendRequests();
    },[isLoading]);
  
    const checkLoggedIn = async () => {
      const value = await AsyncStorage.getItem('@session_token');
      if (value == null) {
          this.props.navigation.navigate('Login');
      }
    }

    const getFriendRequests = async () => {
        const value = await AsyncStorage.getItem('@session_token');
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
            setFriendList(responseJson)
            for(var i = 0; i < responseJson.length; i++){
                getFriendPP(responseJson[i].user_id)
            }
            setIsLoading(false);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const getFriendPP = async (friend_id) => {
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
            setPPList([...ppList, data]);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const acceptRequest = async (friend_id, accept) => {
        const value = await AsyncStorage.getItem('@session_token');
        let methodType = '';
        if(accept == true){methodType = 'post'}
        else{methodType = 'delete'}
        return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + friend_id, {
            method: methodType,
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
            setPPList([...ppList, data]);
            setIsLoading(true)
        })
        .catch((error) => {
            console.log(error);
        })
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
        }else{
        return ( 
            <View>
                <Text>you have {friendList.length} friend requests</Text>
                <FlatList
                data={friendList}
                renderItem={({item, index}) => (
                <View>
                    <Text>{item.first_name} {item.last_name} has sent you a friend request</Text>
                    <Image
                        style={styles.image}
                        source={ppList[index]}
                    />
                    {console.log(ppList[0])}
                    <Text>their photo</Text>
                    <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => acceptRequest(item.user_id, true)}
                    >
                    <Text>Accept Request</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => acceptRequest(item.user_id, false)}
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

/*

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

*/

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