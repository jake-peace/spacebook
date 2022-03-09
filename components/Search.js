import React, {useState, useEffect, Component} from 'react';
import { StyleSheet, View, Text, TextInput} from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchScreen = ({ navigation, route }) => {

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { 
    checkLoggedIn();
  },[]);

  const checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  }

    return (
    <View style={{alignContent: 'center', justifyContent: 'center', margin:'auto'}}>
        <TextInput
            style={styles.textInput}
            placeholder='Search'
            value={searchTerm}
            onChangeText={newsearchTerm => setSearchTerm(newsearchTerm)}
        />
        <TouchableOpacity
            style={styles.standardButton}
            onPress={() => navigation.navigate('SearchResult', {searchTerm: searchTerm, name: searchTerm})}
        >
            <Text>Enter</Text>
        </TouchableOpacity>
    </View>
    )
}

const styles = StyleSheet.create({
  textInput: {
    textAlign: 'center',
    height: '30px',
    borderRadius: '5px',
    padding: '10px',
    backgroundColor: '#ffcc0e',
    borderColor: 'black',
    borderWidth: '2px',
    marginTop: 0,
    marginLeft: '10%',
    width: '80%',
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
})

export default SearchScreen;