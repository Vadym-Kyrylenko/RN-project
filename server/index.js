require('dotenv').config();
const express = require('express');
const routes = require('./src/routes/routes');
const bodyParser = require('body-parser');
require('./src/services/dbServices');
// const services = require('./src/services');
const app = express();
const jsonParser = bodyParser.json({limit: '50mb', extended: true});
// const cron = require('node-cron');
const config = require('./config').APPCONST;
const msg = require('./src/i18n/en').msg;

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
require('./src/services/passport');

const socketio = require('socket.io');


/*app.use(function (err, req, res, next) {
    if(err.name === 'UnauthorizedError'){
        res.status(401);
        res.json({"message": err.name + ": " + err.message});
    }
});*/

// services.saveToDB.start();
// cron.schedule('0 */6 * * *', () => {
//     console.log('start schedule');
//     services.saveToDB.start();
// });

app.use(jsonParser);
app.use('/', routes);
app.get('/', (req, res) => res.send(msg.helloWorld));

const server = require('http').createServer(app);

const websocket = module.exports.websocket = socketio(server);
const Chat = require('./chat');
websocket.on('connection', Chat);

server.listen(config.port, () => console.log(`${msg.serverStartedOnPort} ${config.port}`));
