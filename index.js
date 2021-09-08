const express = require("express");
const app = express();
const port = 3000;
const http = require("http").createServer(app);
const io = require("socket.io")(http);

//Import modules
const {
  addUserToList,
  getUserFromList,
  removeUserFromList,
} = require("./modules/users");

const { checkPassword } = require('./modules/rooms');

//Serves a static file from public folder
app.use(express.static("public"));

//All connecting users
io.on("connection", (socket) => {
  //Saves current user to userlist
  socket.on("joinChat", (incoming) => {
    //Add user to user list
    const user = addUserToList(incoming.user, socket.id, incoming.room);

    //Check password
    let correctPwd = checkPassword(incoming.room, incoming.pwd);
  
    //If password is wrong send back false
    if(!correctPwd) {
      socket.emit('joined', { pwd: false }); 
    } else {
      socket.emit('joined', { pwd: true, room: incoming.room });
    }

    //User joins room
    socket.join(incoming.room);

    //Send message to the user that is connecting
    socket.emit('message', { message: `Welcome to chatroom ${incoming.room}`, userName: 'Bot' });

  });

  //Listen for messages from client
  socket.on("message", (msg) => {
    const user = getUserFromList(socket.id);
    //Send message to specific room, to everyone except user
    io.to(user.room).emit("message", msg);
  });

  //Listen for GIF
  socket.on("gif", (gif) => {
    console.log("Gif: " + gif);
    //Send GIF to everyone in chatroom except user
    socket.broadcast.emit("gif", gif);
  });

  //Runs when someone is typing
  socket.on("typing", (incoming) => {
    const user = getUserFromList(socket.id);
    
    //Sends to everyone except current user
    socket.broadcast.to(user.room).emit("typing", incoming);
  });

  //Runs when a user disconnects
  socket.on("disconnect", () => {
    const user = removeUserFromList(socket.id);
    if (user) {
      //Send to the specific room that user left
      io.to(user.room).emit("leaving", user.username);
    }
  });
});

http.listen(port, () => console.log(`Localhost running on: ${port}`));
