const mongoose = require('mongoose');
const config = require('../../config').APPCONST;
const msg = require('../i18n/en').msg;

mongoose.connect(config.dbURL, {useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true});

mongoose.connection.on('connected', () => {
    console.log(`${msg.mongooseConnectedTo} ${config.dbURL}`);
});

mongoose.connection.on('error', (err) => {
    console.log(`${msg.mongooseConnectedError} ${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.log(msg.mongooseDisconnected);
});

const gracefulShutdown = (message, callback) => {
    mongoose.connection.close(() => {
        console.log(`${msg.mongooseDisconnectedThrough} ${message}`);
        callback();
    });
};

process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});

process.on('/*SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
    });
});
