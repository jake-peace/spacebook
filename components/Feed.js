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

const FeedScreen = ({ navigation, route }) => {

  const [firstName, setFirstName] = useState('');
  const [friendList, setFriendList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    checkLoggedIn();
    getFriends();
    getData();
  },[isLoading]);

  const checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        navigation.navigate('Login');
    }
  }

  const getFriends = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const user_id = await AsyncStorage.getItem('@user_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/friends", {
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
        setFriendList(responseJson)
        setIsLoading(false);
    })
    .catch((error) => {
        console.log(error);
    })
  }

  const logout = async () => {
    await AsyncStorage.setItem('@session_token', null);
    await AsyncStorage.setItem('@user_id', null);
    navigation.navigate("Login");
  }

  const getData = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    const user_id = await AsyncStorage.getItem('@user_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id, {
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
                navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
            setFirstName(responseJson.first_name)
        })
        .catch((error) => {
            console.log(error);
        })
  }

  const refreshPage = () => {
    setIsLoading(true);
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
    }
    else{
      return (
        <View>
          <TouchableOpacity
            onPress={() => refreshPage()}
          >
            <Text>Refresh Page</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => logout()}
          >
            <Text>Logout</Text>
          </TouchableOpacity>
          <Text>Welcome {firstName}. Your friends are below.</Text>
          <FlatList
            data={friendList}
            renderItem={({item, index}) => (
            <View style={styles.listItem}>
              <Text style={styles.listName}>{item.user_givenname} {item.user_familyname}</Text>
              <TouchableOpacity
                style={styles.listLink}
                onPress={() => navigation.navigate('IndividualFriend', {friend_id: item.user_id, name: item.user_givenname, lastName: item.user_familyname})}
              >
                <Text>View {item.user_givenname}'s profile</Text>
              </TouchableOpacity>
            </View>
              )}
            keyExtractor={(item,index) => item.user_id.toString()}
          />
        </View>
      )
    }
}

/*
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
      ppList: []
    }

  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  
    this.getData();
    this.getListOfFriends();
    //this.getFriendPP();
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
        var tempPPList = [];
            for(var i = 0; i < responseJson.length; i++){
                tempPPList = tempPPList + this.getFriendPP(responseJson[i].user_id);
            }
            this.setState({
            friendList: responseJson,
            ppList: tempPPList,
            isLoading: false
            })
      })
      .catch((error) => {
          console.log(error);
      })  
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

getFriendPP = async (user_id) => {
  const value = await AsyncStorage.getItem('@session_token');
  this.user_id = await AsyncStorage.getItem('@user_id');
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
      return data
  })
  .catch((error) => {
      console.log(error);
  })
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
          <Text>Welcome {this.state.first_name}. Your friends are below.</Text>
          <FlatList
            data={this.state.friendList}
            renderItem={({item}) => (
            <View>
              <Text>{item.user_givenname} {item.user_familyname}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('IndividualFriend', {friend_id: item.user_id})}
              >
                <Text>View {item.user_givenname}'s profile</Text>
              </TouchableOpacity>
            </View>
              )}
            keyExtractor={(item,index) => item.user_id.toString()}
          />
        </View>
      );
    }
    
  }
}
*/
const styles = StyleSheet.create({
  image: {
      height: '100px',
      width: '100px',
      borderRadius: '50px'
  },

  listItem: {
    borderColor: '#ffcc0e',
    borderWidth: '10px',
    margin: '10px',
    padding: '5px',
    borderRadius: '20px'
  },

  listLink: {
    color: '#000000',
  },

  listName: {
    fontSize: '20px',
    fontWeight: 'bold',
    alignContent: 'center',
    margin: 'auto',
    textAlign:'center', 
    padding: 5, 
  }


})

export default FeedScreen;