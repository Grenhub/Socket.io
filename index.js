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

//Serves a static file from public folder
app.use(express.static("public"));

//All connecting users
io.on("connection", (socket) => {
  /* console.log('A user has connected..'); */

  //Saves current user to userlist
  socket.on("joinChat", (username) => {
    const user = addUserToList(username, socket.id);
    /* console.log(user); */
  });

  //Listen for messages from client
  socket.on("message", (msg) => {
    /* console.log("Message: " + msg.message + " Username: " + msg.userName); */
    io.emit("message", msg);
  });

  //Listen for GIF
  socket.on("gif", (gif) => {
    console.log("Gif: " + gif);
    //Send GIF to everyone in chatroom except user
    socket.broadcast.emit("gif", gif);
  });

  //Runs when someone is typing
  socket.on("typing", (incoming) => {
    /*  console.log(
      `it is ${incoming.typing} that ${incoming.userName} is typing: `
    ); */
    //Sends to everyone except current user
    socket.broadcast.emit("typing", incoming);
  });

  //Runs when a user disconnects
  socket.on("disconnect", () => {
    const user = removeUserFromList(socket.id);
    if (user) {
      console.log(`${user.username} disconnected`);
      io.emit("leaving", user.username);
    }
  });
});

http.listen(port, () => console.log(`Localhost running on: ${port}`));
