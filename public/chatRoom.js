const socket = io();

const sendBtn = document.getElementById("sendBtn");
sendBtn.addEventListener("click", sendMessage);

let typing = false;
let timeout = undefined;
let messageBox = document.getElementById("message-box");

// Get username from url
const { user, room, pwd, newRoom } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// If newRoom is true create new room
if (!!newRoom) {
  socket.emit("newRoom", { user, newRoom, pwd });
} else {
  // Passwordcheck
  // Send username to server so we can save this in a list
  socket.emit("joinChat", { user, room, pwd });
}

// Checks for user that joins room
socket.on("joined", (incoming) => {
  if (!incoming.pwd) {
    alert("WRONG PASSWORD");
    location.replace("http://localhost:3000");
  }
});

// Listens for new user to inform users in chat
socket.on("newUserJoined", (incoming) => {
  const messageBox = document.getElementById("message-box");
  const message = document.createElement("li");
  message.innerText = `${incoming.userName} has joined the chat`;
  messageBox.append(message);
  messageBox.scrollTop = messageBox.scrollHeight;
});

// Send message to server when send button is clicked
function sendMessage() {
  const input = document.getElementById("message");
  const chatMessage = input.value;
  if (chatMessage.substr(0, 1) === "/") {
    return;
  }

  if (input.value) {
    socket.emit("message", { message: chatMessage, userName: user });
    input.value = "";
  }
}

// Listens for messages from server
socket.on("message", (msg) => {
  showMessage(msg);
});

// Listen for information about chatroom
socket.on("roomInfo", (incoming) => {
  let userContainer = document.getElementById("user-list");
  let roomContainer = document.getElementById("room");
  roomContainer.innerText = "";
  userContainer.innerText = "";
  if (incoming.users) {
    for (let i = 0; i < incoming.users.length; i++) {
      const user = incoming.users[i];
      let userName = document.createElement("li");
      userName.innerText = user;
      userContainer.appendChild(userName);
    }
  } else {
    let userName = document.createElement("li");
    userName.innerText = "You're the only one in this room";
    userContainer.appendChild(userName);
  }
  let roomName = document.createElement("li");
  roomName.innerText = incoming.name;
  roomContainer.appendChild(roomName);
});

// Shows the written message into #message-box
function showMessage(msg) {
  const messageBox = document.getElementById("message-box");
  const message = document.createElement("li");
  message.innerText = `${msg.userName}: ${msg.message}`;
  messageBox.append(message);
  messageBox.scrollTop = messageBox.scrollHeight;
}

// Check to see if someone is typing
function timeoutTypingFunction() {
  typing = false;
  socket.emit("typing", { typing: typing, userName: user });
}

// Send to server that someone is typing
function someoneIsTyping() {
  if (typing === false) {
    typing = true;
    socket.emit("typing", { typing: typing, userName: user });
    timeout = setTimeout(timeoutTypingFunction, 1000);
  } else {
    clearTimeout(timeout);
    timeout = setTimeout(timeoutTypingFunction, 1000);
  }
}

// Listens from server if someone is typing
socket.on("typing", (typing) => {
  const typingBox = document.getElementById("typing-box");
  if (typing.typing) {
    const userTyping = document.createElement("li");
    userTyping.innerText = `${typing.userName} is typing...`;
    typingBox.append(userTyping);
  } else {
    typingBox.innerHTML = "";
  }
});

// Listens if someone leaves the chat
socket.on("leaving", (username) => {
  const messageBox = document.getElementById("message-box");
  const message = document.createElement("li");
  message.innerText = `${username} has left the chat...`;
  messageBox.append(message);
});

// Makes it possible to use Enter in the app
let inputText = document.getElementById("message");
inputText.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("sendBtn").click();
  }
});

// Simple typing animation https://github.com/mattboldt/typed.js/
var typed = new Typed(".jsType", {
  strings: ["xD", "kitten", "programming", "dino"],
  typeSpeed: 100,
  backSpeed: 60,
  loop: true,
});
