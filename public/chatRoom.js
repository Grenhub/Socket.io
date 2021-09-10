const socket = io();

const sendBtn = document.getElementById("sendBtn");
sendBtn.addEventListener("click", sendMessage);

let typing = false;
let timeout = undefined;

//Get username from url
const { user, room, pwd, newRoom } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

if(!!newRoom) {
  socket.emit("newRoom", { user, newRoom, pwd });

} else {
  //Passwordcheck
  //Send username to server so we can save this in a list
  console.log(user + room + pwd)
  socket.emit("joinChat", { user, room, pwd });

}


//Checks for user that joins room
socket.on('joined', (incoming) => {
  console.log(incoming.pwd)
  if(!incoming.pwd) {
    alert('WRONG PASSWORD');
    location.replace('http://localhost:3000');
  }
})

function sendMessage() {
  const input = document.getElementById("message");
  const chatMessage = input.value;
  if(chatMessage.substr(0, 1) === "/") {
    return;
  }

  if (input.value) {
    //Sends message to server
    socket.emit("message", { message: chatMessage, userName: user });
    input.value = "";
  }
}

//Listens for messages from server
socket.on("message", (msg) => {
  showMessage(msg);
});

//Listen for information about chatroom
socket.on('roomInfo', (incoming) => {
  /* let userList = incoming.users; */

})

function showMessage(msg) {
  const messageBox = document.getElementById("message-box");
  const message = document.createElement("li");
  message.innerText = `${msg.userName}: ${msg.message}`;
  messageBox.append(message);
}

//Check to see if someone is typing

function timeoutTypingFunction() {
  typing = false;
  socket.emit("typing", { typing: typing, userName: user });
  console.log(typing);
}

function someoneIsTyping() {
  if (typing === false) {
    typing = true;
    //Send to server that someone is typing
    socket.emit("typing", { typing: typing, userName: user });
    timeout = setTimeout(timeoutTypingFunction, 1000);
  } else {
    clearTimeout(timeout);
    timeout = setTimeout(timeoutTypingFunction, 1000);
  }
}

//Listens from server if someone is typing
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

//Listens if someone leaves the chat
socket.on("leaving", (username) => {
  const messageBox = document.getElementById("message-box");
  const message = document.createElement("li");
  message.innerText = `${username} has left the chat...`;
  messageBox.append(message);
});

let inputText = document.getElementById("message");
inputText.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("sendBtn").click();
  }
});

var typed = new Typed(".jsType", {
  strings: ["xD", "kitten", "programming", "creepysmile"],
  typeSpeed: 100,
  backSpeed: 60,
  loop: true,
});
