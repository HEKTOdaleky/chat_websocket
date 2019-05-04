const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');

const users = require('./app/users');
const chat = require('./app/chat');

const app = express();
require('express-ws')(app);
const db = mongoose.connection;

const port = process.env.PORT||8000;

app.use(cors());
app.use(express.json());
mongoose.connect(config.db);

db.once('open', () => {

    app.use('/users', users());
    app.use('/chat', chat());
    
    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });
});