const rooms = [];

// Create new room
function createRoom(roomName, roomPwd, inputuserId) {
  const room = {
    name: roomName,
    pwd: roomPwd,
    userId: [inputuserId],
  };
  rooms.push(room);
  return room;
}

// Add socket.id/userId to a room
function addUserToRoom(roomToJoin, id) {
  rooms.forEach((room) => {
    if (room.name === roomToJoin) {
      room.userId.push(id);
    }
  });
}

// Remove user when disconnect
function removeUserIdFromRoom(roomToLeave, id) {
  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i];
    if (room.name === roomToLeave) {
      for (let index = 0; index < room.userId.length; index++) {
        if (room.userId[index] === id) {
          room.userId.splice(index, 1);
        }
      }
    }
  }
}

// Check password
function checkPassword(roomName, pwd) {
  let result;
  rooms.forEach((room) => {
    if (room.name === roomName) {
      if (room.pwd === pwd) {
        result = true;
      } else {
        result = false;
      }
    }
  });
  return result;
}

function checkForRoom() {
  return rooms.length;
}

// Export functions
module.exports = {
  checkPassword,
  createRoom,
  addUserToRoom,
  removeUserIdFromRoom,
  checkForRoom,
};
