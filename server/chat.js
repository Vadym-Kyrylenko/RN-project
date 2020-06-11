const websocket = require('./index').websocket;

const clients = {};
const users = {};
const messages = [];
let _id = 0;

module.exports = (socket) => {

    clients[socket.id] = socket;
    socket.on('userJoined', (userId) => onUserJoined(userId, socket));
    socket.on('message', (message) => onMessageReceived(message, socket));

    function onUserJoined(userId, socket) {
        try {
            users[socket.id] = userId;
            sendExistingMessages(socket);
        } catch (err) {
            console.err(err);
        }
    }

    function onMessageReceived(message, senderSocket) {
        const userId = users[senderSocket.id];
        // Safety check.
        if (!userId) return;
        saveMessage(message, senderSocket);
    }

    function sendExistingMessages(socket) {
        socket.emit('message', messages.sort((a, b) => b._id - a._id));
    }

    function saveMessage(message, socket, fromServer) {
        _id++;
        const messageData = {
            text: message.text,
            user: message.user,
            createdAt: new Date(),
            _id: _id
        };
        if (messages.length >= 4) {
            messages.sort((a, b) => a._id - b._id).shift();
        }
        messages.push(messageData);
        sendMessage(message, socket, fromServer);
    }

    function sendMessage(message, socket, fromServer){
        const emitter = fromServer ? websocket : socket.broadcast;
        emitter.emit('message', [message]);
    }
};