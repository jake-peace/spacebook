import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { NavigationContainer, useLinkProps } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

import LoginScreen from './components/login';
import SignupScreen from './components/Signup';
import FeedScreen from './components/Feed';
import ProfileScreen from './components/Profile';
import FriendScreen from './components/Friends';
import IndividualFriendScreen from './components/IndivFriend';
import SearchScreen from './components/Search';
import SearchResult from './components/SearchResult';
import PostScreen from './components/Post.js';
import ChangePictureScreen from './components/ChangePicture';
import EditUserScreen from './components/EditUser';

const Stack = createNativeStackNavigator();

const Main = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={Feed} options={{ title: 'Friends', headerShown: false, tabBarIcon: () => (<Image source={require("./icons/friends.png")} style={{width: 20, height: 20}} />) }}/>
      <Tab.Screen name="Profile" component={ProfileScreen} options={{title:"Your Profile", tabBarIcon: () => (<Image source={require("./icons/profile.png")} style={{width: 20, height: 20}} />)}}/>
      <Tab.Screen name="Friends" component={FriendScreen} options={{ title: 'Friend Requests', tabBarIcon: () => (<Image source={require("./icons/friendrequest.png")} style={{width: 20, height: 20}} />) }} />
      <Tab.Screen name="Search" component={Search} options={{ headerShown: false, tabBarIcon: () => (<Image source={require("./icons/search.png")} style={{width: 20, height: 20}} />) }}/>
    </Tab.Navigator>
  );
}

const Feed = () => {
  return (
    <Stack.Navigator initialRouteName='MainFeed' >
      <Stack.Screen name="MainFeed" component={FeedScreen} options={{ headerShown: false}}/>
      <Stack.Screen name="IndividualFriend" component={IndividualFriendScreen} options={({route}) => ({title:route.params.name + "'s profile"})} />
      <Stack.Screen name="WritePost" component={PostScreen} options={{ headerShown: false}}/>
      <Stack.Screen name="ChangePicture" component={ChangePictureScreen} options={{ headerShown: false}}/>
      <Stack.Screen name ="EditUser" component={EditUserScreen} options={{ headerShown:false}}/>
    </Stack.Navigator>
  )
}

const Search = () => {
  return (
    <Stack.Navigator initialRouteName='Search'>
      <Stack.Screen name = "SearchScreen" component={SearchScreen} options={{ headerShown: false }}/>
      <Stack.Screen name = "SearchResult" component={SearchResult} options={({route}) => ({title:route.params.name})}/>
    </Stack.Navigator>
  )
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={LoginScreen} options={{title:'SpaceBook'}} />
        <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        />
        <Stack.Screen name="Main" component={Main} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;