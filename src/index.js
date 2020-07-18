const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { 
    matchPlayer, 
    removePlayer, 
    getPlayingGames, 
    getUsersRoomScore, 
    updatePlayingUserScore, 
    getAllData
} = require('./utils/playingGames')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    socket.on('join', ({userName, game}, callback) => {
        const { error, user } = matchPlayer(socket.id, userName, game)

        if (error) {
            return callback(error)
        }

        const {room, users} = getUsersRoomScore(socket.id);
        socket.join(room);
        io.to(room).emit('join', users);

        callback()
    })

    socket.on("showGame", (callback) => {
        const {room, users} = getUsersRoomScore(socket.id);
        socket.join(room);
        io.to(room).emit('join', users);

        callback();
    })

    socket.on('updateScore', (score, callback) => {
        let {room, users} = updatePlayingUserScore(socket.id, score);
        if(!users.length) {
            callback('Error: Room not found')
        }
        io.to(room).emit('join', users);
        callback()
    })

    socket.on('disconnect', () => {
        let user = removePlayer(socket.id)
        if(user) {
            //Next step to swith other user when one of them is disconnected.
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})