import React from 'react';
import SocketIOClient from 'socket.io-client';
import {GiftedChat} from 'react-native-gifted-chat';
import {connect} from 'react-redux';

const config = require('../../../config').APPCONST;

class ChatScreenComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            userId: this.props.user._id
        };

        this.socket = SocketIOClient(config.URL);
        this.socket.on('message', this.onReceivedMessage);
        this.determineUser();
    }

    /**
     * When a user joins the chatroom, check if they are an existing user.
     * If they aren't, then ask the server for a userId.
     * Set the userId to the component's state.
     */
    determineUser = () => {
        let userId = this.props.user._id;
        this.socket.emit('userJoined', userId);
    };

    // Event listeners
    /**
     * When the server sends a message to this.
     */
    onReceivedMessage = (messages) => {
        this.storeMessages(messages);
    };

    /**
     * When a message is sent, send the message to the server
     * and store it in this component's state.
     */
    onSend = (messages = []) => {
        console.log(messages);
        this.socket.emit('message', messages[0]);
        this.storeMessages(messages);
    };

    render() {
        const user = {
            _id: this.state.userId,
            avatar: `${config.avatarURL}${this.props.user._id}`,
            name: `@${this.props.user.lastName}`
        };
        return (
            <GiftedChat
                showUserAvatar={true}
                renderUsernameOnMessage={true}
                messages={this.state.messages}
                onSend={messages => this.onSend(messages, true)}
                user={user}
            />
        )
    }

    // Helper functions
    storeMessages = (messages) => {
        this.setState((previousState) => {
            return {
                messages: GiftedChat.append(previousState.messages, messages),
            };
        });
    }
}

export const ChatScreen = (connect((state) => ({
    user: state.auth.user,
}))(ChatScreenComponent));
