import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function EventOverview({selectedEvent}) {
    
    return (
        <View style={styles.modalContainer}>
            <ScrollView >
                <Text style={styles.modalText}>{selectedEvent?.description}</Text>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    modalText: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingTop: 15
    },
})