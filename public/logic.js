const socket = io();

//Sending request to server if there's any rooms
socket.emit("showJoin");
socket.on("showJoin", (roomList) => {
  //If there's 0 rooms Join is hidden
  if (roomList === 0) {
    let hiddenRoom = document.getElementById("hiddenRoom");
    hiddenRoom.style.display = "none";
  }
});
