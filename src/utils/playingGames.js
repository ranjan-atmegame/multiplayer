const {getGames, newGame, removeGame} = require("./games");
const {getRooms, findRoomIndex, newRoom, removeRoom} = require("./rooms");
const {findUser, findUserIndex, getUsers, newUser, removeUser, updateUserRoom, updateUserScore} = require('./users');
const games = require("./games");

//List of all playing games
const playingGames = [];

//============Testing=========
const dump = (message) => {
    console.log(message);
}

const getAllData = () => {
    return {
        games: getGames(),
        rooms: getRooms(),
        users: getUsers(),
        playing: playingGames
    }
}

//==========END Testing========

const getPlayingGames = () => playingGames;

const findPlayingGameIndex = (gameId) => {
    return playingGames.findIndex(({game}) => game === gameId);
}

//Add new game in list of playing games
const addPlayingGame = (id, userName, gameId) => {
    let {game} = newGame(gameId);
    let {room} = newRoom(game);
    let user = newUser(id, userName, game);
    updateUserRoom(id, room);
    
    gameObj = {
        game,
        rooms: [
            {
                room,
                users: [{ id, name: userName, score: 0}]
            }
        ]
    }

    playingGames.push(gameObj);

    return {};
}

//Add new player in list of playing games
const newGamePlayer = (gameIndex, id, userName) => {
    let {game, rooms} = playingGames[gameIndex];
    return findRoomForPlayer(game, rooms, id, userName);
}

const findRoomForPlayer = (game, rooms, id, userName) => {
    let index = rooms.findIndex(({users}) => users.length === 1);
    
    if(index === -1) {
        let {room} = newRoom(game);
        newUser(id, userName, game);
        updateUserRoom(id, room);

        let addRoom = {
            room,
            users: [{ id, name: userName, score: 0}]
        }

        rooms.push(addRoom);
        return {};
    } else {
        let room = rooms[index];
        let user  = newUser(id, userName, game);
        updateUserRoom(id, room.room);
        room.users.push({id, name: userName, score: 0});

        return rooms[index].users[0];
    }
}

const removePlayingGame = (gameId) => {
    const index = playingGames.findIndex(({game}) => game === gameId);
    return playingGames.splice(index, 1);
}

const matchPlayer = (id, userName, gameId) => {
    let index = findPlayingGameIndex(gameId);
    let player;
    if(index === -1) {
        player = addPlayingGame(id, userName, gameId);
    } else {
        player = newGamePlayer(index, id, userName);
    }

    return player;
}

const removePlayingPlayer = (gameIndex, roomIndex, userId) => {
    let {game, rooms} = playingGames[gameIndex];
    let {room, users} = rooms[roomIndex];

    let userCount = users.length;
    let user;
    switch(userCount) {
        case 1: 
            rooms.splice(roomIndex, 1);
            removeRoom(room);
            user = removeUser(userId);
            break;
        case 2:
            let userIndex = users.findIndex(user => user.id === userId);
            users.splice(userIndex, 1);
            user = removeUser(userId);
            break;
        default:
            console.log("Removing playing condition did not matched.")
            break;
    }

    if(!rooms.length) {
        removePlayingGame(game);
        removeGame(game);
    }

    return user;
}

const removePlayer = (id) => {
    try {
        let userIndex = findUserIndex(id);
        if(userIndex !== -1) {
            let {game, room} = findUser(id);

            let gameIndex = findPlayingGameIndex(game);
            let {rooms} = playingGames[gameIndex];
            let roomIndex = findRoomIndex(room);
            let {users} = rooms[roomIndex];

            return removePlayingPlayer(gameIndex, roomIndex, id);
        }
    } catch(e) {
        //Need to add Log into file.
        return {};
    }
}

const getUsersRoomScore = (userId) => {
    try {
        const {game, room} = findUser(userId);

        let index = findPlayingGameIndex(game);
        if(index === -1) {
            throw new Error("Error: Game not found");
        }

        let {rooms} = playingGames[index];
        let roomIndex = findRoomIndex(room);
        let {users} = rooms[roomIndex];

        return {room, users};
    } catch(e) {
        //Need to add Log into file.
        return {room: {}, users: []};
    }
}

const updatePlayingUserScore = (userId, userScore) => {
    try {
        let userIndex = findUserIndex(userId);
        if(userIndex === -1) {
            throw new Error("User not found");
        }
        const {game, room} = getUsers()[userIndex];

        let gameIndex = findPlayingGameIndex(game);
        if(gameIndex === -1) {
            throw new Error("Error: Game not found");
        }

        let {rooms} = playingGames[gameIndex];

        let roomIndex = findRoomIndex(room);
        let {users} = rooms[roomIndex];

        let playginUserIndex = users.findIndex(user => user.id === userId);
        users[playginUserIndex] = {...users[playginUserIndex], score:userScore};

        updateUserScore(userId, userScore);
        return {room, users};
    } catch(e) {
        //Need to add Log into file.
        return {room: {}, users: []}
    }
}

module.exports = {
    matchPlayer,
    removePlayer,
    getPlayingGames,
    getUsersRoomScore,
    updatePlayingUserScore,

    getAllData
}


//=====================Testing================
// 1 Find player
// matchPlayer(1, 'Ansh', 'Pub-G');
// matchPlayer(2, 'Harsh', 'Pub-G');
// matchPlayer(3, 'Puchki', 'Air-warfare');
// matchPlayer(4, 'Meenu', 'Air-warfare');

// 2 Remove player
// let player = removePlayer(1);


// dump(getGames());
// dump(getRooms());
// dump(getUsers());

// dump(getPlayingGames());
