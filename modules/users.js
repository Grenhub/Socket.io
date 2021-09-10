const userList = [];

//Save user here when they join chat
function addUserToList(username, id, room) {
    const user = {
        username,
        id,
        room
    }
    userList.push(user);
    return user;
}

//Get the current user
function getUserFromList(id) {
    return userList.find(user => user.id === id);
}

//Remove user from list
function removeUserFromList(id) {
    const i = userList.findIndex(user => user.id === id);

    if(i !== -1) {
        //Returns the user we removed fron list
        return userList.splice(i, 1)[0];

    }
    
}

//Function that returns users in chatroom
function usersInChatroom(chatroom) {
    const currentUsers = [];
    userList.forEach(user => {
        if(user.room === chatroom) {
            currentUsers.push(user.username);
        }   
    });
    return currentUsers;
}



//Export functions
module.exports = {
    addUserToList,
    getUserFromList,
    removeUserFromList,
    usersInChatroom
}