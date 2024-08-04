import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from 'react';
import { firebase } from "./config";
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import {View, Text, TouchableOpacity,TextInput,StyleSheet,Image} from 'react-native'

import Login from "./src/Login";
import Registration from "./src/Registration";
import Home from "./src/Home";
import Header from "./components/Header";

import SearchScreen from "./src/SearchScreen";
import PublishScreen from "./src/PublishScreen";
import JourneyScreen from "./src/JourneyScreen";
import MessageScreen from "./src/MessageScreen";
import ProfileScreen from "./src/ProfileScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions ={
  tabBarShowLabel:false,
  headerShown:false,
  tabBarStyle:{
    position:"absolute",
    bottom:0,
    right:0,
    left:0,
    elevation:0,
    height:60,
    backgroundColor:"#fff"
  }

}

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      {user ? (
        <Tab.Navigator>
          <Tab.Screen 
          name="Search" 
          component={SearchScreen} 
          options={{
            tabBarIcon: ({focused})=> {
              return(
                <View style={{alignItems:"center", justifyContent: "center"}}>
                  <Image source={require('./image/search.png')} style={{ width: 30, height: 30, marginTop:5 }} />                
            </View>
              )
             
            }
          }} />
          <Tab.Screen 
          name="Publish" 
          component={PublishScreen}
          options={{
            tabBarIcon: ({focused})=> {
              return(
                <View style={{alignItems:"center", justifyContent: "center"}}>
                <Image source={require('./image/plus.png')} style={{ width: 30, height: 30, marginTop:5 }} />  
            </View>
              )
             
            }
          }}
          />
          <Tab.Screen 
          name="Journey" 
          component={JourneyScreen}
          options={{
            tabBarIcon: ({focused})=> {
              return(
                <View style={{alignItems:"center", justifyContent: "center"}}>
                <Image source={require('./image/journey.png')} style={{ width: 30, height: 30, marginTop:5 }} />  
            </View>
              )
             
            }
          }}
          />
          <Tab.Screen 
          name="Message" 
          component={MessageScreen}    
          options={{
            tabBarIcon: ({focused})=> {
              return(
                <View style={{alignItems:"center", justifyContent: "center"}}>
                <Image source={require('./image/chat.png')} style={{ width: 30, height: 30, marginTop:5 }} />  
            </View>
              )
             
            }
          }}
          />
          <Tab.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{
            tabBarIcon: ({focused})=> {
              return(
                <View style={{alignItems:"center", justifyContent: "center"}}>
                <Image source={require('./image/user.png')} style={{ width: 30, height: 30, marginTop:5 }} />  
            </View>
              )
             
            }
          }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerTitle: () => <Header name="Login" />,
              headerStyle: {
                height: 150,
                borderBottomLeftRadius: 50,
                borderBottomRightRadius: 50,
                backgroundColor: '#026efd',
                elevation: 25
              }
            }}
          />

          <Stack.Screen
            name="Registration"
            component={Registration}
            options={{
              headerTitle: () => <Header name="Registration" />,
              headerStyle: {
                height: 150,
                borderBottomLeftRadius: 50,
                borderBottomRightRadius: 50,
                backgroundColor: '#00e4d0',
                elevation: 25
              }
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
