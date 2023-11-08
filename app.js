const express = require('express');
const app = express();
const port = 3000;

const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);

const bodyparser = require('body-parser');
const path = require('path');

const meetingRoute = require('./routes/meetingRoute');

app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.set('view engine', 'ejs')
app.set('views',path.join(__dirname,'./views'));
app.use(express.static('public'));

app.use('/',meetingRoute);

io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId);
        });
    });
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});