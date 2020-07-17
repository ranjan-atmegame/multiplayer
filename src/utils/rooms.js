const uniqid = require('uniqid');

//List of all rooms
const rooms = [];                       // rooms = [{room: 'XYZ', game: 'Pub-G'}];

const findRoom = roomId => {
    return rooms.find(({room}) => room === roomId)
}

const findRoomIndex = roomId => {
    return rooms.findIndex(({room}) => room === roomId)
}

const newRoom = (game) => {
    let newRoom = { room: uniqid(), game};
    rooms.push(newRoom);
    return newRoom;
}

const removeRoom = roomName => {
    const index = rooms.findIndex(({room}) => room === roomName);
    if(index === -1) {
        throw new Error("Error: Room not found.");
    }
    rooms.splice(index, 1);
}

const getRooms = () => rooms;

module.exports = {
    findRoom,
    findRoomIndex,
    getRooms,
    newRoom,
    removeRoom
}

// let room1 = newRoom('Pub-G');
// let room2 = newRoom('Air-warfare');
// console.log(rooms);
// removeRoom();
// console.log(rooms);