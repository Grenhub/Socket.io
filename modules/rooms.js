const rooms = [
    {
        name: 1,
        pwd: 123
    },
    {
        name: 2,
        pwd: 456
    },
    {
        name: 3,
        pwd: 789
    },
];

function checkPassword(roomName, pwd) {
    let result;
    rooms.forEach(room => {
        if(room.name === Number(roomName)) {
            if(room.pwd === Number(pwd)) {
                console.log('RÄTT LÖSENORD');
                result = true;
            } else {
                console.log('FEL LÖSENORD');
                result = false;
            }
        }
    })
    return result;
}

//Export functions
module.exports = {
    checkPassword
}