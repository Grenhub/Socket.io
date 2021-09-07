const userList = [];

//Save user here when they join chat
function addUserToList(username, id) {
    const user = {
        username,
        id
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

//Export functions
module.exports = {
    addUserToList,
    getUserFromList,
    removeUserFromList
}