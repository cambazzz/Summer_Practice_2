import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView} from 'react-native'
import React, { useState } from 'react'
import { firebase } from '../config'

const Registration = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [telNo, setTelNo] = useState('')
    const [tcNo, setTcNo] = useState('')

    const registerUser = async (email, password, firstname, lastname, tcno, birthdate, telno) => {
        try {
            await firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(() => {
                    firebase.auth().currentUser.sendEmailVerification({
                        handleCodeInApp: true,
                        url: 'ortagtest.firebaseapp.com'
                    })
                        .then(() => {
                            alert('Verification email sent')
                        }).catch(error => {
                            alert(error.message)
                        })
                        .then(() => {
                            firebase.firestore().collection('users')
                                .doc(firebase.auth().currentUser.uid)
                                .set({
                                    firstName,
                                    lastName,
                                    email,
                                    tcNo,
                                    birthDate,
                                    telNo,
                                    password
                                })
                        })
                        .catch((error) => {
                            alert(error.message)
                        })
                })
                .catch((error) => {
                    alert(error.message)
                })
        } catch (error) {
            alert(error.message)
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
            <Text style={{ fontWeight: 'bold', fontSize: 23 }}>
                Register Here!!
            </Text>

            <View style={{ marginTop: 40 }}>
                <TextInput
                    style={styles.TextInput}
                    placeholder='Turkish Republic Identification Number'
                    onChangeText={(text) => setTcNo(text)}
                    autoCorrect={false}
                />
                <TextInput
                    style={styles.TextInput}
                    placeholder='First Name'
                    onChangeText={(text) => setFirstName(text)}
                    autoCorrect={false}
                />
                <TextInput
                    style={styles.TextInput}
                    placeholder='Last Name'
                    onChangeText={(text) => setLastName(text)}
                    autoCorrect={false}
                />
                <TextInput
                    style={styles.TextInput}
                    placeholder='E-Mail Adress'
                    onChangeText={(text) => setEmail(text)}
                    autoCorrect={false}
                />
                <TextInput
                    style={styles.TextInput}
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    autoCorrect={false}
                    secureTextEntry={true}
                />
                <TextInput
                    style={styles.TextInput}
                    placeholder='Birthday Date'
                    onChangeText={(text) => setBirthDate(text)}
                    autoCorrect={false}
                />
                <TextInput
                    style={styles.TextInput}
                    placeholder='Telephone Number'
                    onChangeText={(text) => setTelNo(text)}
                    autoCorrect={false}
                />

            </View>
            <TouchableOpacity
            onPress={()=> registerUser(email, password, firstName, lastName, tcNo, birthDate, telNo)}
            style={styles.button}
            >
                    <Text style={{fontWeight:'bold',fontSize:22}}>Register</Text>
            </TouchableOpacity>

        </View>
        </ScrollView>
    )
}

export default Registration

const styles = StyleSheet.create({
    scrollViewContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 100,
    },
    TextInput: {
        paddingTop: 20,
        paddingBottom: 10,
        width: 400,
        fontSize: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        marginBottom: 10,
        textAlign: 'center'
    },
    button: {
        marginTop: 50,
        height: 50,
        width: 250,
        backgroundColor: '#026efd',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
    },
})
