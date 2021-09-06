const express = require("express");
const app = express();
const port = 3000;
const http = require("http").createServer(app);
const io = require("socket.io")(http);

//Serves a static file from public folder
app.use(express.static("public"))

//All connecting users
io.on('connection', socket => {
    console.log('A user has connected..');

    //Listen for messages from client
    socket.on('message', (msg) => {
        console.log(msg.message);
        io.emit('message', msg);
    });

    //Runs when a user disconnects
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    })
});

http.listen(port, () => console.log(`Localhost running on: ${port}`));