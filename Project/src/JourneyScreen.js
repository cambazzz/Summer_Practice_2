import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Button, RefreshControl } from 'react-native';

import { firebase } from '../config';

const JourneyScreen = () => {
  const [journeys, setJourneys] = useState([]);
  const [selectedJourneyReservations, setSelectedJourneyReservations] = useState([]);
  const [selectedJourneyId, setSelectedJourneyId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const userEmail = firebase.auth().currentUser.email;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJourneys();
  }, []);
  const handleRefresh = () => {
    setRefreshing(true); // Yenileme işlemi başladığında refreshing durumunu true yap
    fetchJourneys();
  };

  const fetchJourneys = async () => {
    try {
      const journeyRef = firebase.firestore().collection('journey');
      const querySnapshot = await journeyRef.where('email', '==', userEmail).get();
      const journeysList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJourneys(journeysList);
    } catch (error) {
      console.error('Error fetching journeys: ', error);
    } finally {
      setRefreshing(false); // Yenileme işlemi tamamlandığında refreshing durumunu false yap
    }
  };

  useEffect(() => {
    fetchJourneys();
  }, []);

  const handleApproveReservation = async (reservationId) => {
    try {
      const reservationRef = firebase.firestore().collection('reservations').doc(reservationId);
      await reservationRef.update({ status: 'approved' });
      // Success message or further action if needed
    } catch (error) {
      console.error('Error approving reservation: ', error);
    }
  };


  const handleRejectReservation = async (reservationId) => {
    try {
      const reservationRef = firebase.firestore().collection('reservations').doc(reservationId);
      await reservationRef.update({ status: 'rejected' });
      await reservationRef.delete(); // Delete the reservation document
      // Success message or further action if needed
    } catch (error) {
      console.error('Error rejecting reservation: ', error);
    }
  };

  const handleJourneyPress = async (journeyId) => {
    try {
      setSelectedJourneyId(journeyId);
      setModalVisible(true);
      const reservationRef = firebase.firestore().collection('reservations');
      const querySnapshot = await reservationRef.where('journeyId', '==', journeyId).get();
      const reservationsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSelectedJourneyReservations(reservationsList);
    } catch (error) {
      console.error('Error fetching reservations: ', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={journeys}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleJourneyPress(item.id)}>
            <View style={styles.journeyItem}>    
              <View style={styles.inputRow}>  
                  <Image source={require('../image/user.png')} style={styles.image} />                          
                  <Text style={styles.journeyText}>{item.userFirstName} {item.userLastName} </Text>
              </View>
              <View  style={styles.inputRow}>
                  <Image source={require('../image/location2.png')} style={styles.image} />
                  <Text style={styles.journeyText}>Start Point: {item.startPoint}</Text>
              </View>        
              <View  style={styles.inputRow}>
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
              <TouchableOpacity onPress={() => handleJourneyPress(item.id)}>
                <Text style={styles.viewReservationsButton}>View Reservations</Text>
              </TouchableOpacity>
              {selectedJourneyId === item.id && (
                <View style={styles.approvedReservationsContainer}>
                  <Text style={styles.approvedReservationsText}>Approved Reservations:</Text>
                  {selectedJourneyReservations.map(reservation => (
                    reservation.status === 'approved' && (
                      <View key={reservation.id} style={styles.approvedReservationItem}>
                        <Text>{reservation.userFirstName} {reservation.userLastName}</Text>
                      </View>
                    )
                  ))}
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        refreshControl={ // Yenileme işlemi için refreshControl özelliğini ekliyoruz
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
    <View style={styles.modalView}>
      <Text style={styles.modalText}>Reservations:</Text>
      {selectedJourneyReservations.map(reservation => (
        <View key={reservation.id} style={styles.reservationItem}>
          <Text>{reservation.userFirstName} {reservation.userLastName}</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.approveButton]}
              onPress={() => handleApproveReservation(reservation.id)}
            >
              <Text style={styles.buttonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={() => handleRejectReservation(reservation.id)}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <Button title="Close" onPress={() => setModalVisible(false)} />
    </View>
  </View>
        {/* Modal content */}
      </Modal>
    </SafeAreaView>
  );
};

export default JourneyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
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
  viewReservationsButton: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  approvedReservationsContainer: {
    marginTop: 10,
  },
  approvedReservationsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  approvedReservationItem: {
    marginBottom: 3,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
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
  viewReservationsButton: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  approveButton: {
    backgroundColor: 'green',
  },
  rejectButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  reservationItem: {
    marginBottom: 5,
  },
});
