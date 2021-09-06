const socket = io();

const sendBtn = document.getElementById('sendBtn');
sendBtn.addEventListener('click', sendMessage);

function sendMessage() {
    const input = document.getElementById('message');
    const chatMessage = input.value;

    if(input.value) {
        //Sends message to server
        socket.emit('message', { message: chatMessage });
        input.value = '';

    }

}

//Listens for messages from server
socket.on('message', (msg) => {
    showMessage(msg);
})

function showMessage(msg) {
    const messageBox = document.getElementById('message-box');
    const message = document.createElement('li');
    message.innerText = msg.message;
    messageBox.append(message);
}
