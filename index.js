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
  usersInChatroom,
} = require("./modules/users");

const {
  checkPassword,
  createRoom,
  addUserToRoom,
  removeUserIdFromRoom,
  checkForRoom
} = require("./modules/rooms");

//Serves a static file from public folder
app.use(express.static("public"));

//All connecting users
io.on("connection", (socket) => {
  //Shows join if room is created (from logic.js)
  socket.on("showJoin", () => {
    let roomList = checkForRoom();
    socket.emit("showJoin", roomList)
  });
  //Saves current user to userlist
  socket.on("joinChat", (incoming) => {
    //Check password
    let correctPwd = checkPassword(incoming.room, incoming.pwd);

    //If password is wrong send back false
    if (!correctPwd) {
      socket.emit("joined", { pwd: false });
      return;
    } else {
      socket.emit("joined", { pwd: true, room: incoming.room });
    }
     //Add user to user list
     const user = addUserToList(incoming.user, socket.id, incoming.room);

    //User joins room
    socket.join(incoming.room);
    
    //User id adds to list of rooms
    addUserToRoom(incoming.room, socket.id);

    //Check which users are in the room
    const usersInRoom = usersInChatroom(incoming.room);

    //Send room info
    io.to(incoming.room).emit("roomInfo", {
      users: usersInRoom,
      name: incoming.room,
    });

    //Inform users in room that a new user has joined (to everyone except user)
    socket.broadcast
      .to(incoming.room)
      .emit("newUserJoined", { userName: incoming.user });

    //Send message to the user that is connecting
    socket.emit("message", {
      message: `Welcome to chatroom ${incoming.room}`,
      userName: "Bot",
    });
  });

  //Create new room
  socket.on("newRoom", (incoming) => {
    //Add user to user list
    const user = addUserToList(incoming.user, socket.id, incoming.newRoom);
    createRoom(incoming.newRoom, incoming.pwd, socket.id);
    //User joins room
    socket.join(incoming.newRoom);
    //User id adds to list of rooms
    //addUserToRoom(incoming.newRoom, socket.id);
    //Send message to the user that is connecting
    socket.emit("message", {
      message: `Welcome to chatroom ${incoming.newRoom}`,
      userName: "Bot",
    });

    //Send room info
    socket.emit("roomInfo", { name: incoming.newRoom });
  });

  //Listen for messages from client
  socket.on("message", (msg) => {
    const user = getUserFromList(socket.id);
    //Send message to specific room, to everyone 
    io.to(user.room).emit("message", msg);
  });

  //Listen for GIF
  socket.on("gif", (gif) => {
    const user = getUserFromList(socket.id);
    //Send GIF to everyone in chatroom except user
    socket.broadcast.to(user.room).emit("gif", gif);
  });

  //Listen for Emoji
  socket.on("emoji", (emoji) => {
    const user = getUserFromList(socket.id);
    //Send Emoji to everyone in chatroom except user
    socket.broadcast.to(user.room).emit("emoji", emoji);
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
      removeUserIdFromRoom(user.room, socket.id);
      //Send to the specific room that user left
      io.to(user.room).emit("leaving", user.username);
      //Check which users are in the room
      const usersInRoom = usersInChatroom(user.room);

      //Send room info
      io.to(user.room).emit("roomInfo", {
        users: usersInRoom,
        name: user.room,
      });
    }
  });
});

http.listen(port, () => console.log(`Localhost running on: ${port}`));
