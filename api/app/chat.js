const express = require('express');
const User = require('../models/User');
const Message = require('../models/Message');

const clients = {};

const broadcast = message => {
    Object.values(clients).forEach(client => {
        client.connection.send(JSON.stringify(message))
    })
};

const createMessage = async (text, user) => {
    const message = new Message({
        text: text,
        user: user._id
    });
    await message.save();
    message.user = user;

    broadcast({ type: 'NEW_MESSAGE', message });
};

const sendLastMessages = async (ws) => {
    try {
        const lastMessages = await Message.find().populate('user').sort({date: 1}).limit(30);
        if (lastMessages) {
            ws.send(JSON.stringify({
                type: 'LAST_MESSAGES',
                messages: lastMessages
            }));
        }
    } catch (e) {
        return ws.send(JSON.stringify({type: 'ERROR', message: 'Last messages not found'}));
    }
};

const sendLoggedInUsers = (ws) => {
    const users = Object.values(clients).map(client => client.user);
    ws.send(JSON.stringify({
        type: 'LOGGED_IN_USERS',
        users
    }));
};

const deleteMessage = async id => {
    try {
        const message = await Message.findByIdAndDelete(id);
        if (message) {
            broadcast({type: 'DELETE_MESSAGE',id});
        }
    } catch (e) {
        return console.log(e);
    }
};

const configureConnection = (ws, req) => {
    const id = req.get('sec-websocket-key');
    const user = req.user;
    clients[id] = {connection: ws, user: user};

    broadcast({ type: 'USER_LOGGED_IN', user });

    sendLastMessages(ws);
    sendLoggedInUsers(ws);


    console.log('client connected. User: ' + user.username);
    console.log('active connections: ', Object.values(clients).length);

    ws.on('message', msg => {
        console.log('client sent message: ', msg);
        let decodedMessage;

        try {
            decodedMessage = JSON.parse(msg);
        } catch (e) {
            return ws.send(
                JSON.stringify({
                    type: 'ERROR',
                    message: 'Message is not JSON'
                })
            );
        }

        switch (decodedMessage.type) {
            case 'CREATE_MESSAGE':
                createMessage(decodedMessage.text, user);
                break;
            case 'DELETE_MESSAGE':
                if(user.role!=='moderator'){
                    return ws.send(JSON.stringify({
                        type: 'ERROR',
                        message: 'Unauthorized'
                    }));
                }
                else {
                    deleteMessage(decodedMessage.id)
                }
                break;
            default:
                return ws.send(
                    JSON.stringify({
                        type: 'ERROR',
                        message: 'Unknown message type'
                    })
                );
        }
    });

    ws.on('close', () => {
        delete clients[id];
        console.log('client disconnected');
        console.log('active connections: ', Object.values(clients).length);

        broadcast({ type: 'USER_LOGGED_OUT', user });
    });
};

const createRouter = () => {
    const router = express.Router();

    router.ws('/', async (ws, req) => {
        const token = req.query.token;
        const user = await User.findOne({token});

        if (!user) {
            ws.send(JSON.stringify({type: 'ERROR', message: 'User not found'}));
            return ws.close();
        }

        req.user = user;
        configureConnection(ws, req);

    });

    return router;
};

module.exports = createRouter;