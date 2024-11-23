import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import LanguageSwitcher from './LanguageSwitcher';

const CustomHeader = ({ title }) => {    

    return (
        <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
             <LanguageSwitcher/>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 100,
        backgroundColor: '#f8f8f8',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e2e2',
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default CustomHeader;
