import {View, Text, StyleSheet, TextInput, Button, TouchableOpacity, Image} from 'react-native';
import React, { useState } from 'react';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { firebase } from '../config';

const PublishScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);
  const [counter, setCounter] = useState(0);
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');

  const toggleDateModal = () => {
    setIsDateModalVisible(!isDateModalVisible);
  };

  const toggleTimeModal = () => {
    setIsTimeModalVisible(!isTimeModalVisible);
  };

  const handleConfirmDate = (date) => {
    setSelectedDate(date.toISOString().split('T')[0]);
    toggleDateModal();
  };

  const handleConfirmTime = (time) => {
    setSelectedTime(time.toTimeString().split(' ')[0]);
    toggleTimeModal();
  };

  const incrementCounter = () => {
    if (counter < 4) {
      setCounter(counter + 1);
    }
  };

  const decrementCounter = () => {
    setCounter(counter > 0 ? counter - 1 : 0);
  };

  const handleShare = async () => {
    const userEmail = firebase.auth().currentUser.email;

    const isDuplicate = await checkDuplicateJourney(selectedDate, selectedTime);

    if (isDuplicate) {
      alert('A ride is already available at this hour!');
    } else {
      const currentUser = firebase.auth().currentUser;
    let userFirstName = '';
    let userLastName = '';
    if (currentUser) {
      // Kullanıcının "users" koleksiyonundaki verilerine eriş
      const userDoc = await firestore.collection('users').doc(currentUser.uid).get();
      if (userDoc.exists) {
        // Kullanıcının adını al
        userFirstName = userDoc.data().firstName || '';
        userLastName = userDoc.data().lastName || '';
      }
    }
      addJourney(userEmail, startPoint, endPoint, selectedDate, selectedTime,userFirstName,userLastName);
    }
  };

  const firestore = firebase.firestore();

  const addJourney = async (email, startPoint, endPoint, selectedDate, selectedTime,userFirstName,userLastName) => {
    try {
      await firestore.collection('journey').add({
        email: email,
        userFirstName:userFirstName,
        userLastName:userLastName,
        startPoint: startPoint,
        endPoint: endPoint,
        selectedDate: selectedDate,
        selectedTime: selectedTime,
        counter: counter
      });
      alert('Journey added successfully!');
      console.log('Journey added successfully!');
    } catch (error) {
      alert('Error adding journey: ', error);
      console.error('Error adding journey: ', error);
    }
  };

  const checkDuplicateJourney = async (selectedDate, selectedTime) => {
    try {
      const journeyRef = firestore.collection('journey');
      const querySnapshot = await journeyRef
        .where('selectedDate', '==', selectedDate)
        .where('selectedTime', '==', selectedTime)
        .get();

      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking duplicate journey: ', error);
      return true;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 32, alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>Where will you start from?</Text>
      <View style={{ marginTop: 40 }}>
        <View style={styles.inputRow}>
          <Image source={require('../image/location2.png')} style={styles.image} />
          <TextInput
            style={styles.TextInput}
            placeholder='Start Point'
            onChangeText={(text) => setStartPoint(text)}
            autoCapitalize='none'
            autoCorrect={false}
          />
        </View>
        <View style={styles.inputRow}>
          <Image source={require('../image/location3.png')} style={styles.image} />
          <TextInput
            style={styles.TextInput}
            placeholder='End Point'
            onChangeText={(text) => setEndPoint(text)}
            autoCapitalize='none'
            autoCorrect={false}
          />
        </View>
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <Image source={require('../image/calender.png')} style={{ width: 30, height: 30, marginTop: 5 }} />
            <TouchableOpacity style={styles.datePicker} onPress={toggleDateModal}>
              <Text style={styles.text}>
                {selectedDate ? `Date: ${selectedDate}` : 'Date'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.datePicker} onPress={toggleTimeModal}>
              <Text style={styles.text}>
                {selectedTime ? `Hour: ${selectedTime}` : 'Hour'}
              </Text>
            </TouchableOpacity>
          </View>

          <Modal isVisible={isDateModalVisible} onBackdropPress={toggleDateModal}>
            <View style={styles.modalContent}>
              <Calendar
                onDayPress={(day) => {
                  setSelectedDate(day.dateString);
                  toggleDateModal();
                }}
                markedDates={{
                  [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' }
                }}
              />
            </View>
          </Modal>
          <DateTimePickerModal
            isVisible={isTimeModalVisible}
            mode="time"
            onConfirm={handleConfirmTime}
            onCancel={toggleTimeModal}
          />

          <View style={styles.counterContainer}>
            <Image source={require('../image/userortag.png')} style={{ width: 30, height: 50 }} />
            <TouchableOpacity style={styles.counterButton} onPress={decrementCounter}>
              <Text style={styles.counterButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterText}>{counter}</Text>
            <TouchableOpacity style={styles.counterButton} onPress={incrementCounter}>
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.shareButton} onPress={() => handleShare()}>
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default PublishScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  TextInput: {
    paddingTop: 10,
    paddingBottom: 10,
    width: 300,
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 10,
    textAlign: 'left',
    margin: 'auto'
  },
  datePicker: {
    padding: 10,
    backgroundColor: '#007be8',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  text: {
    fontSize: 16,
    color: '#ffffff',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  textContainer: {
    width: '100%',
    marginTop: 10,
  },
  leftAlignedText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 10,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  counterButton: {
    backgroundColor: '#808080',
    borderRadius: 5,
    marginHorizontal: 10,
    height: 50,
    width: 30,
  },
  counterButtonText: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 10
  },
  counterText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: '#007be8',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 10,
    width: 350,
  },
  shareButtonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 24,
    height: 24,
    marginRight: 20,
  },
});
