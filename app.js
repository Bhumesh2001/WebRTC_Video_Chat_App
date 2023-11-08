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

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'./views'));
app.use(express.static('public'));

app.use('/',meetingRoute);

io.on('connection', (socket) => {
    console.log(`a user connceted ${socket.id}`);

    socket.on('offer', offer => {
        socket.broadcast.emit('offer', offer);
    });

    socket.on('answer', answer => {
        socket.broadcast.emit('answer', answer);
    });

    socket.on('new-ice-candidate', iceCandidate => {
        socket.broadcast.emit('ice-candidate', iceCandidate);
    });

    socket.on('screenOffer',(screenOffer)=>{
        socket.broadcast.emit('screenOffer', screenOffer);
    });

    socket.on('disconnect',()=>{
        console.log('a user disconnected');
    });

});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});