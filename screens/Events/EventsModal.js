import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import EventOverview from './EventOverview';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyEvents from '../Profile/MyEvents';

const Tab = createMaterialTopTabNavigator()
export default function EventsModal({
    selectedEvent,
    isPreviewModalVisible,
    setPreviewModalVisible,
    setChatModalVisible,
}) {
    const [userDetails, setUserDetails] = useState(null);
    const navigation = useNavigation()
    useEffect(() => {
        const fetchUserDetails = async () => {
            const storedDetails = await AsyncStorage.getItem('userDetails');
            if (storedDetails) {
                setUserDetails(JSON.parse(storedDetails));
            }
        };

        fetchUserDetails();
    }, []);

    const handleEventRegistration = () => {
        if (!userDetails) {

            Alert.alert(
                'Registration Required',
                'You need to register before signing up for an event.',
                [{
                    text: 'Register Now', onPress: () => {
                        navigation.navigate('Register', { enforceRegistration: true })
                        setPreviewModalVisible(false)
                    }
                }]
            );
        } else {
            // Proceed with event registration using stored userDetails
            Alert.alert('Success', 'You are registered for the event!');
        }
    };

    const setChat = () => {
        setPreviewModalVisible(false)
        setChatModalVisible(true)
    }

    return (

        <Modal
            animationType="slide"
            transparent={true}
            visible={isPreviewModalVisible}
            onRequestClose={() => {
                setPreviewModalVisible(false)
            }
            }
            swipeDirection="down" // Enable swipe down to close the modal
            onSwipeComplete={() => {
                setPreviewModalVisible(false)
            }
            } // Handle swipe down event
        >

            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {selectedEvent && (<>
                        <Image source={selectedEvent.image} style={styles.modalImage} />
                        <Text style={styles.modalTitle}>Event Preview</Text>
                        <Text style={styles.modalPrice}>Price: {selectedEvent.price}</Text>
                        <Text style={styles.modalLocation}>Location: {selectedEvent.location}</Text>

                        <Tab.Navigator>
                            <Tab.Screen name="Overview">
                                {() => <EventOverview selectedEvent={selectedEvent} />}
                            </Tab.Screen>
                            <Tab.Screen name="Edit Profile" component={MyEvents} />
                        </Tab.Navigator>

                    </>

                    )}
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity style={styles.modalButton} onPress={() => setPreviewModalVisible(false)}>
                            <Text style={styles.modalButtonText}>Close</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={setChat}>
                            <Text style={styles.modalButtonText}>Chat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={handleEventRegistration}>
                            <Text style={styles.modalButtonText}>Register for Event</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '100%',
        height: '95%', // Make the modal height 25% of the screen
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    modalImage: {
        width: '100%',
        height: 200,
        objectFit: "center",
        borderRadius: 5
    },
    modalScrollContent: {
        paddingBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'left',
        marginVertical: 10
    },
    modalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalLocation: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 10,
    },
  /*   modalText: {
        fontSize: 14,
        marginBottom: 20,
    }, */
    closeModalText: {
        color: 'blue',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
    },
    modalButton: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    modalButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
})