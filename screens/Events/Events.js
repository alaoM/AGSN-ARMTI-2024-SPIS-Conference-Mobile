import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MainTabNavigator from '../Navigation/MainTabNavigator ';
 
export default function Events() {
    return (

        <View style={styles.container}>
            <Text style={styles.paragrapgh1}>What  EVENTS PAGE p!</Text>
            <StatusBar style="auto" />
            <MainTabNavigator />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        height: "100%",
        paddingHorizontal: "3%"
    },
    paragrapgh1: {
        paddingTop: "10%",

    }
});
