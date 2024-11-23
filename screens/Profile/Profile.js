// Profile.js
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyEvents from './MyEvents';
import EditProfile from './EditProfile';

const Tab = createMaterialTopTabNavigator();

export default function Profile() {
    return (
        <ScrollView contentContainerStyle={styles.profileContainer}>
            <Text>sheveriou</Text>
            <Image
                source={{ uri: 'https://placeimg.com/640/480/any' }}
                style={styles.profileImage}
            />
            <Text style={styles.username}>Username</Text>
            <Text style={styles.location}>Location</Text>
            <Text style={styles.phoneNumber}>Phone Number</Text>

            <Tab.Navigator>
                <Tab.Screen name="My Events" component={MyEvents} />
                <Tab.Screen name="Edit Profile" component={EditProfile} />
            </Tab.Navigator>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    profileContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        height: "100%",
        backgroundColor: '#fff',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    location: {
        fontSize: 16,
        color: 'green',
    },
    phoneNumber: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 20,
    },
});
