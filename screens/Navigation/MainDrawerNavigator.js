import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import HomeScreen from '../HomeScreen';
import ProfileScreen from '../Profile/ProfileScreen';
import Speakers from '../speakers/Speakers';
import RegistrationScreen from '../RegisterScreen/RegistrationScreen';
import PanelistsScreen from '../Panelist/PanelistsScreen';
import Particapants from '../Participants/Particapants';
import Fieldtrip from '../FieldTrip/Fieldtrip';
import ConferenceMaterials from '../ConferenceMaterials/ConferenceMaterials';
import ChatScreen from '../ChatScreen/Chats';

const Drawer = createDrawerNavigator();

export default function MainDrawerNavigator({ navigation }) {
    return (
        <Drawer.Navigator
            drawerContent={(props) => {
                const { navigation, state } = props;
                const { routeNames, index } = state;
                const focused = routeNames[index];

                return (
                    <DrawerContentScrollView {...props}>
                        <DrawerItem
                            label="Confrence Agenda"
                            onPress={() => navigation.navigate('Home')}
                            focused={focused === 'Home'}
                            activeBackgroundColor="black"
                            inactiveBackgroundColor="grey"
                            inactiveTintColor="black"
                            activeTintColor="white"
                            icon={({ color, size }) => (
                                <MaterialIcons name="home" size={size} color={color} />
                            )}
                        />
                        <DrawerItem
                            label="Register"
                            onPress={() => navigation.navigate('Register')}
                            focused={focused === 'Register'}
                            activeBackgroundColor="black"
                            inactiveBackgroundColor="grey"
                            inactiveTintColor="black"
                            activeTintColor="white"
                            icon={({ color, size }) => (
                                <MaterialIcons name="event" size={size} color={color} />
                            )}
                        />
                        <DrawerItem
                            label="Speakers"
                            onPress={() => navigation.navigate('Speakers')}
                            focused={focused === 'Speakers'}
                            activeBackgroundColor="black"
                            inactiveBackgroundColor="grey"
                            inactiveTintColor="black"
                            activeTintColor="white"
                            icon={({ color, size }) => (
                                <MaterialIcons name="person-pin" size={size} color={color} />
                            )}
                        />
                        <DrawerItem
                            label="Panelists"
                            onPress={() => navigation.navigate('Panelists')}
                            focused={focused === 'Panelists'}
                            activeBackgroundColor="black"
                            inactiveBackgroundColor="grey"
                            inactiveTintColor="black"
                            activeTintColor="white"
                            icon={({ color, size }) => (
                                <MaterialIcons name="group" size={size} color={color} />
                            )}
                        />
                        <DrawerItem
                            label="Field Trip Info."
                            onPress={() => navigation.navigate('Fieldtrip')}
                            focused={focused === 'Fieldtrip'}
                            activeBackgroundColor="black"
                            inactiveBackgroundColor="grey"
                            inactiveTintColor="black"
                            activeTintColor="white"
                            icon={({ color, size }) => (
                                <MaterialIcons name="explore" size={size} color={color} />
                            )}
                        />
                        <DrawerItem
                            label="Participants"
                            onPress={() => navigation.navigate('Participants')}
                            focused={focused === 'Participants'}
                            activeBackgroundColor="black"
                            inactiveBackgroundColor="grey"
                            inactiveTintColor="black"
                            activeTintColor="white"
                            icon={({ color, size }) => (
                                <MaterialIcons name="account-box" size={size} color={color} />
                            )}
                        />
{/* 
                        <DrawerItem
                            label="Logistical Info."
                            // onPress={() => navigation.navigate('Speakers')}
                            focused={focused === ' '}
                            activeBackgroundColor="black"
                            inactiveBackgroundColor="grey"
                            inactiveTintColor="black"
                            activeTintColor="white"
                            icon={({ color, size }) => (
                                <MaterialIcons name="local-shipping" size={size} color={color} />
                            )}
                        /> */}
                         <DrawerItem
                            label="Chat"
                              onPress={() => navigation.navigate('Chat')}
                            focused={focused === 'Chat'}
                            activeBackgroundColor="black"
                            inactiveBackgroundColor="grey"
                            inactiveTintColor="black"
                            activeTintColor="white"
                            icon={({ color, size }) => (
                                <MaterialIcons name="photo-library" size={size} color={color} />
                            )}
                        />  
                        <DrawerItem
                            label="Conference Materials"
                            onPress={() => navigation.navigate('Materials')}
                            focused={focused === 'Materials'}
                            activeBackgroundColor="black"
                            inactiveBackgroundColor="grey"
                            inactiveTintColor="black"
                            activeTintColor="white"
                            icon={({ color, size }) => (
                                <MaterialIcons name="folder" size={size} color={color} />
                            )}
                        />
                       {/*  <DrawerItem
                            label="Evaluation, quiz and gamification"
                            // onPress={() => navigation.navigate('Speakers')}
                            focused={focused === 'Evaluation'}
                            activeBackgroundColor="black"
                            inactiveBackgroundColor="grey"
                            inactiveTintColor="black"
                            activeTintColor="white"
                            icon={({ color, size }) => (
                                <MaterialIcons name="assessment" size={size} color={color} />
                            )}
                        /> */}

                        <DrawerItem
                            label="Profile"
                            onPress={() => navigation.navigate('Profile')}
                            focused={focused === 'Profile'}
                            activeBackgroundColor="black"
                            inactiveBackgroundColor="grey"
                            inactiveTintColor="black"
                            activeTintColor="white"
                            icon={({ color, size }) => (
                                <MaterialIcons name="person" size={size} color={color} />
                            )}
                        />
                    </DrawerContentScrollView>
                );
            }}

        >
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Speakers" component={Speakers} />
            <Drawer.Screen name="Panelists" component={PanelistsScreen} />
            <Drawer.Screen name="Fieldtrip" component={Fieldtrip} />
            <Drawer.Screen name="Participants" component={Particapants} />
            <Drawer.Screen name="Register" component={RegistrationScreen} />
            <Drawer.Screen name="Profile" component={ProfileScreen} />
            <Drawer.Screen name="Materials" component={ConferenceMaterials} />
            <Drawer.Screen name="Chat" component={ChatScreen} />
        </Drawer.Navigator>
    );
}
