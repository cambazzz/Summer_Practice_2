import {View, Text, TouchableOpacity,TextInput,StyleSheet,Image} from 'react-native'
import React, {useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import { firebase } from '../config'


const Login = () => {
    const navigation=useNavigation();
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')

loginUser = async(email,password) => {
    try{
        await firebase.auth().signInWithEmailAndPassword(email,password)
    }catch(error){
        alert(error.message)
    }
}
return (
    <View style={styles.container}>
        <Text style={{fontWeight:'bold',fontSize:26,  textAlign:'center',marginTop:20}}>Hey Partner Sign Up To Start Your Journey!</Text>
        <Image source={require('../image/logo_login.png')} style={styles.logo} />

        <View style={{marginTop:40}}>
            <TextInput
                style={styles.TextInput}
                placeholder='Email'
                onChangeText={(Text) => setEmail(Text)}
                autoCapitalize='none'
                autoCorrect={false}
            />
            <TextInput
                style={styles.TextInput}
                placeholder='Password'
                onChangeText={(Text) => setPassword(Text)}
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={true}
            />

        </View>
        <TouchableOpacity
         onPress={() => loginUser(email,password)}
         style={styles.button}
        >
           <Text style={{fontWeight:'bold', fontSize:22}}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
         onPress={() => navigation.navigate('Registration')}
         style={{marginTop:20}}
        >
           <Text style={{fontWeight:'bold', fontSize:16,  alignSelf:'center'}}>Don't have an account? Register Now </Text>
        </TouchableOpacity>
        <View style={styles.socialContainer}>
        {/* Gmail Login */}
        <TouchableOpacity style={styles.socialButton} onPress={() => console.log('Gmail Login')}>
          <Image source={require('../image/gmail_logo.png')} style={styles.socialLogo} />
        </TouchableOpacity>

        {/* Facebook Login */}
        <TouchableOpacity style={styles.socialButton} onPress={() => console.log('Facebook Login')}>
          <Image source={require('../image/facebook_logo.png')} style={styles.socialLogo} />
        </TouchableOpacity>

        {/* Apple Login */}
        <TouchableOpacity style={styles.socialButton} onPress={() => console.log('Apple Login')}>
          <Image source={require('../image/apple_logo.png')} style={styles.socialLogo} />
        </TouchableOpacity>
      </View>
    </View>
) 
}

export default Login 

const styles= StyleSheet.create({
    cotainer:{
        flex:1,
        alignItems:'center',
        marginTop:100,
    },
    logo: {
      width: 200, // Adjust the width and height based on your image size
      height: 200,
      alignSelf:'center', 
      marginTop:-60
    },
    TextInput:{
        paddingTop:20,
        paddingBottom:10,
        width:400,
        fontSize:20,
        borderBottomWidth:1,
        borderBottomColor:'#000',
        marginBottom:10,
        textAlign:'center'
    },
    button:{
      marginTop: 50,
      height: 50,
      width: 250,
      backgroundColor: '#026efd',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 50,  
      alignSelf:'center',    
  },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        width: '80%',
        alignSelf:'center',   
      },
      socialButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        marginHorizontal: 4,
      },
      socialLogo: {
        width: 20,
        height: 20,
      },
})