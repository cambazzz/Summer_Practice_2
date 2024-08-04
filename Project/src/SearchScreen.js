import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TextInput, Button, ActivityIndicator, RefreshControl, Image, Alert, Modal, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { firebase } from '../config';

const SearchScreen = () => {
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [userReservations, setUserReservations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [numberOfSeats, setNumberOfSeats] = useState('');

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchUserReservations(user.uid);
      }
    });

    return unsubscribe;
  }, []);

  const fetchUserReservations = async (userId) => {
    try {
      const reservationsRef = firebase.firestore().collection('reservations');
      const querySnapshot = await reservationsRef.where('userId', '==', userId).get();
      const reservations = querySnapshot.docs.map(doc => doc.data().journeyId);
      setUserReservations(reservations);
    } catch (error) {
      console.error('Error fetching user reservations: ', error);
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  };

  const searchJourneys = async () => {
    try {
      setLoading(true);
      const journeyRef = firebase.firestore().collection('journey');
      let query = journeyRef;
      if (startPoint) {
        query = query.where('startPoint', '==', startPoint);
      }
      if (endPoint) {
        query = query.where('endPoint', '==', endPoint);
      }
      if (selectedDate) {
        const formattedDate = formatDate(selectedDate);
        query = query.where('selectedDate', '==', formattedDate);
      }
      const querySnapshot = await query.get();
      const journeysList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJourneys(journeysList);
      if (journeysList.length === 0) {
        Alert.alert("No Journeys Found", "Aradığınız tarihte yolculuk bulunamamıştır.");
      }
    } catch (error) {
      console.error('Error searching journeys: ', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    searchJourneys();
  };

  const makeReservation = async (journeyId, ownerEmail, ownerFirstName, ownerLastName, seats) => {
    try {
      if (user && user.email === ownerEmail) {
        Alert.alert('Reservation Failed', 'Kendi yolculuğunuza rezervasyon yapamazsınız.');
        return;
      }
  
      if (userReservations.includes(journeyId)) {
        Alert.alert('Reservation Failed', 'Bu yolculuğa zaten rezervasyon yapmışsınız.');
        return;
      }
  
      // Kullanıcının adını ve soyadını users koleksiyonundan al
      const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
      const userData = userDoc.data();
  
      const reservationRef = firebase.firestore().collection('reservations');
      await reservationRef.add({
        journeyId: journeyId,
        userId: user.uid,
        userEmail: user.email,
        // Kullanıcının ad ve soyad bilgisini rezervasyon verisine ekle
        userFirstName: userData.firstName,
        userLastName: userData.lastName,
        reservationDate: new Date(),
        seats: seats,
        status: 'Pending',
      });
      Alert.alert('Reservation Successful', 'Rezervasyon isteğiniz gönderildi.');
      fetchUserReservations(user.uid); // Yeni rezervasyon yapıldığında kullanıcının rezervasyonlarını güncelle
    } catch (error) {
      console.error('Error making reservation: ', error);
      Alert.alert('Reservation Failed', 'Rezervasyon isteğiniz gönderilemedi.');
    }
  };

  const handleReservation = (journey) => {
    setSelectedJourney(journey);
    setModalVisible(true);
  };

  const confirmReservation = () => {
    if (numberOfSeats <= 0) {
      Alert.alert('Invalid Input', 'Lütfen geçerli bir koltuk sayısı giriniz.');
      return;
    }

    makeReservation(
      selectedJourney.id,
      selectedJourney.email,
      selectedJourney.userFirstName,
      selectedJourney.userLastName,
      numberOfSeats
    );

    setModalVisible(false);
    setNumberOfSeats('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Start Point"
          value={startPoint}
          onChangeText={setStartPoint}
        />
        <TextInput
          style={styles.input}
          placeholder="End Point"
          value={endPoint}
          onChangeText={setEndPoint}
        />
        <Button title="Select Date" onPress={() => setShowDatePicker(true)} />
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) {
                setSelectedDate(date);
              }
            }}
          />
        )}
        <Text style={styles.selectedDateText}>Selected Date: {formatDate(selectedDate)}</Text>
        <Button title="Search" onPress={searchJourneys} />
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007be8" />
        </View>
      ) : (
        <FlatList
          data={journeys}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.journeyItem}>
              <View style={styles.inputRow}>
                <Image source={require('../image/user.png')} style={styles.image} />
                <Text style={styles.journeyText}>{item.userFirstName} {item.userLastName}</Text>
              </View>
              <View style={styles.inputRow}>
                <Image source={require('../image/location2.png')} style={styles.image} />
                <Text style={styles.journeyText}>Start Point: {item.startPoint}</Text>
              </View>
              <View style={styles.inputRow}>
                <Image source={require('../image/location3.png')} style={styles.image} />
                <Text style={styles.journeyText}>End Point: {item.endPoint}</Text>
              </View>
              <View style={styles.inputRow}>
                <Image source={require('../image/calender.png')} style={styles.image} />
                <Text style={styles.journeyText}>Date: {item.selectedDate}</Text>
              </View>
              <View style={styles.inputRow}>
                <Image source={require('../image/clock.png')} style={styles.image} />
                <Text style={styles.journeyText}>Time: {item.selectedTime}</Text>
              </View>
              <View style={styles.inputRow}>
                <Image source={require('../image/pass6.png')} style={styles.image} />
                <Text style={styles.journeyText}>Seats: {item.counter}</Text>
              </View>
              {userReservations.includes(item.id) ? (
                <Text style={styles.reservationText}>Rezervasyon İsteği Gönderildi</Text>
              ) : (
                <Button
                  title="Rezervasyon Yap"
                  onPress={() => handleReservation(item)}
                />
              )}
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#007be8"]}
              tintColor="#007be8"
            />
          }
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Kaç koltuk için rezervasyon yapmak istiyorsunuz?</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Number of seats"
            keyboardType="numeric"
            value={numberOfSeats}
            onChangeText={setNumberOfSeats}
          />
          <View style={styles.modalButtonContainer}>
            <Button title="İptal" onPress={() => setModalVisible(false)} />
            <Button title="Onayla" onPress={confirmReservation} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedDateText: {
    fontSize: 16,
    marginVertical: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  journeyItem: {
    backgroundColor: '#e2e2e2',
    padding: 15,
    borderRadius: 25,
    marginBottom: 10,
  },
  journeyText: {
    fontSize: 16,
  },
  reservationText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
  },
  image: {
    width: 24,
    height: 24,
    marginRight: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
    color: '#fff',
  },
  modalInput: {
    width: '80%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
});
