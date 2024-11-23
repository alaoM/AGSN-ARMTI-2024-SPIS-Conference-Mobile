import { StyleSheet, View } from 'react-native';
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SpeakerOne from './SpeakerOne';
import SpeakerTwo from './SpeakerTwo';
import SpeakerThree from './SpeakerThree';

const Tab = createMaterialTopTabNavigator();

const Speakers = () => {
    return (
        <View style={styles.container}>
            <Tab.Navigator>
                <Tab.Screen name="Speaker 1" component={SpeakerOne} />
                <Tab.Screen name="Speaker 2" component={SpeakerTwo} />
                <Tab.Screen name="Other Speakers" component={SpeakerThree} />
            </Tab.Navigator>
        </View>
    );
}

export default Speakers;

const styles = StyleSheet.create({
    container: {
        flex: 1,  // Ensure the container takes up full screen
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});
