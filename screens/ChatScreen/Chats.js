import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Modal,
    TouchableWithoutFeedback,
    Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { API_URL } from '@env';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import io from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../../contextProviders/AuthContext';
import { useProfile } from '../../contextProviders/ProfileContext';

const SOCKET_SERVER_URL = `${API_URL}/chat/messages/`; // Ensure the correct server endpoint

const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [fullscreenImage, setFullscreenImage] = useState(null);
    const [selectedContent, setSelectedContent] = useState(null);

    const { accessToken } = useAuth();
    const { userProfile } = useProfile();

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io(SOCKET_SERVER_URL, {
            transports: ['websocket'],
            query: { token: accessToken }, // If the server requires token authentication
        });

        setSocket(newSocket);

        // Fetch initial messages from the API
        fetchMessages();

        // Listen for messages from the server
        newSocket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Clean up the socket connection on unmount
        return () => {
            newSocket.disconnect();
        };
    }, [accessToken]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${API_URL}/chat/messages/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() && !selectedContent) return;

        try {
            const content = selectedContent?.assets?.[0];
            const message = {
                text: newMessage.trim(),
                image: content ? content.uri : '',
                sender: userProfile?.id, // Send user ID if needed
            };

            const formData = new FormData();
            formData.append('text', message.text);
            if (message.image) {
                formData.append('image', {
                    uri: message.image,
                    name: content.fileName || 'image.jpg',
                    type: content.type || 'image/jpeg',
                });
            }

            // Emit the message to the socket server
            socket.emit('sendMessage', message);

            const response = await fetch(`${API_URL}/chat/send-message/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: formData,
            });

            if (response.ok) {
                const sentMessage = await response.json();

                // Fetch initial messages from the API
                fetchMessages();
                setMessages((prevMessages) => [...prevMessages, sentMessage]);
                setNewMessage('');
                setSelectedContent(null);
            } else {
                Alert.alert('Error', 'Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            Alert.alert('Error', 'An error occurred while sending the message');
        }
    };

    const handleAttachment = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedContent(result);
        }
    };

    const renderMessage = ({ item }) => {
        const isMyMessage = item.sender === userProfile?.id;
        const senderInitials = item.senderName
            .split(' ')
            .map(name => name[0])
            .join('')
            .toUpperCase();

        return (
            <View style={isMyMessage ? styles.myMessage : styles.otherMessage}>
                {!isMyMessage && (
                    <View style={styles.messageHeader}>
                        <TouchableOpacity
                            style={styles.profilePictureContainer}
                            onPress={() => showFullscreenImage(item.senderProfilePicture)}
                        >
                            {item.senderProfilePicture ? (
                                <Image
                                    source={{ uri: `${API_URL}${item.senderProfilePicture}` }}
                                    style={styles.profilePicture}
                                />
                            ) : (
                                <Text style={styles.profileInitials}>{senderInitials}</Text>
                            )}
                        </TouchableOpacity>
                        <Text style={styles.senderName}>{item.senderName}</Text>
                    </View>
                )}
                {item.image && (
                    <TouchableOpacity onPress={() => showFullscreenImage(item.image)}>
                        <Image
                            source={{ uri: `${API_URL}${item.image}` }}
                            style={isMyMessage ? styles.myMessageImage : styles.otherMessageImage}
                        />
                    </TouchableOpacity>
                )}
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.messageTime}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
            </View>
        );
    };

    const showFullscreenImage = (imageUri) => {
        setFullscreenImage(imageUri);
    };

    const hideFullscreenImage = () => {
        setFullscreenImage(null);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70}
        >
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.chatContainer}
            />

            <View style={styles.inputContainer}>
                <TouchableOpacity onPress={handleAttachment} style={styles.attachmentButton}>
                    <MaterialIcons name="attach-file" size={24} color="black" />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message"
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={fullscreenImage !== null} transparent>
                <TouchableWithoutFeedback onPress={hideFullscreenImage}>
                    <View style={styles.fullscreenContainer}>
                        <Image
                            source={{ uri: fullscreenImage }}
                            style={styles.fullscreenImage}
                            contentFit='contain'
                        />
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    chatContainer: {
        paddingHorizontal: 10,
        paddingTop: 20,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#dcf8c6',
        borderRadius: 15,
        padding: 10,
        marginBottom: 10,
        maxWidth: '80%',
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 10,
        marginBottom: 10,
        maxWidth: '80%',
        borderWidth: 1,
        borderColor: '#ececec',
    },
    profilePictureContainer: {
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    profileInitials: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#dcdcdc',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        lineHeight: 40,
        fontSize: 18,
        color: '#000',
    },
    messageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    senderName: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    myMessageImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 5,
    },
    otherMessageImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 5,
    },
    messageText: {
        fontSize: 16,
    },
    messageTime: {
        fontSize: 12,
        color: '#aaa',
        marginTop: 5,
        textAlign: 'right',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ececec',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginHorizontal: 10,
    },
    sendButton: {
        backgroundColor: '#007bff',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    attachmentButton: {
        marginRight: 10,
    },
    fullscreenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    fullscreenImage: {
        width: '90%',
        height: '80%',
    },
});


export default ChatScreen;
