import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import img1 from "../../assets/images/download.jpg"
import img2 from "../../assets/images/download2.jpg"
import img3 from "../../assets/images/tree-736885_640.jpg"
import { shortenText } from '../../assets/libs/helper';
import EventsModal from './EventsModal';
export default function EventsScreen() {
    const [isPreviewModalVisible, setPreviewModalVisible] = useState(false);
    const [isChatModalVisible, setChatModalVisible] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hello! Is this event still available?', sender: 'user' },
        { id: 2, text: 'Yes, it is!', sender: 'organizer' },
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);

    const events = [
        {
            id: 1, name: 'Event 1', description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

Why do we use it?
It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).`, price: '$10', location: 'Ilorin', image: img1
        },
        { id: 2, name: 'Event 2', description: 'Description for Event 2', price: '$15', location: 'Kwara', image: img2 },
        // Add more events as needed
    ];

    const sendMessage = () => {
        if (inputMessage.trim()) {
            setMessages([...messages, { id: messages.length + 1, text: inputMessage, sender: 'user' }]);
            setInputMessage('');
        }
    };

    const openPreviewModal = (event) => {
        setSelectedEvent(event);
        setPreviewModalVisible(true);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TextInput style={styles.searchBar} placeholder="Search Events" />
            {events.map((event) => (
                <View style={styles.eventCard} key={event.id}>
                    <Image source={event.image} style={styles.eventImage} />
                    <View style={styles.eventInfo}>
                        <Text style={styles.eventName}>{event.name}</Text>
                        <Text style={styles.eventDescription}>{shortenText(event.description, 200)}</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.previewButton} onPress={() => openPreviewModal(event)}>
                                <Text style={styles.buttonText}>Register</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.chatButton} onPress={() => setChatModalVisible(true)}>
                                <Text style={styles.buttonText}>Chat</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ))}

            {/* Preview Modal */}
            <EventsModal
                selectedEvent={selectedEvent}
                isPreviewModalVisible={isPreviewModalVisible}
                setPreviewModalVisible={setPreviewModalVisible}
                setChatModalVisible={setChatModalVisible}
            />

            {/* Chat Modal */}
            <Modal

                animationType="slide"
                transparent={true}
                visible={isChatModalVisible}
                onRequestClose={() => setChatModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.chatModalContent}>
                        <Text style={styles.modalTitle}>Chat with Organizer</Text>
                        <FlatList
                            data={messages}
                            renderItem={({ item }) => (
                                <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.organizerBubble]}>
                                    <Text style={styles.messageText}>{item.text}</Text>
                                </View>
                            )}
                            keyExtractor={item => item.id.toString()}
                            style={styles.messageList}
                            contentContainerStyle={styles.messageListContent}
                        />
                        <View style={styles.chatInputContainer}>
                            <TextInput
                                style={styles.chatInput}
                                placeholder="Type a message"
                                value={inputMessage}
                                onChangeText={setInputMessage}
                            />
                            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                                <Text style={styles.sendButtonText}>Send</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => setChatModalVisible(false)}>
                            <Text style={styles.closeModalText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    searchBar: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    eventCard: {
        marginBottom: 20,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 3,
    },
    eventCard: {
        marginBottom: 20,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 3,
    },
    eventImage: {
        width: '100%',
        height: 200,
        objectFit: "center",
        borderRadius: 5
    },
    eventInfo: {
        padding: 15,
    },
    eventName: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 5,
    },
    eventDescription: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    previewButton: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    chatButton: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        flex: 0.5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
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
    chatModalContent: {
        width: '100%',
        height: '75%', // Make the modal height 25% of the screen
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalScrollContent: {
        paddingBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'left',
        margintop: 10
    },
    modalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    modalLocation: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
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
    closeModalText: {
        color: 'blue',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
    },
    messageList: {
        flex: 1,
        marginBottom: 20,
    },
    messageListContent: {
        padding: 10,
    },
    messageBubble: {
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
    },
    userBubble: {
        backgroundColor: '#f0f0f0',
        alignSelf: 'flex-end',
    },
    organizerBubble: {
        backgroundColor: '#e1f5fe',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
    },
    chatInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ddd',
        padding: 10,
    },
    chatInput: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    sendButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
});
