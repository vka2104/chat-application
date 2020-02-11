//node core modules
const path = require('path')
const http = require('http')
//custom modules
const {generateMessage } = require('./utils/message')
const { addUsers, removeUser, getUsers, getUsersInRoom } = require('./utils/users')
//npm modules
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT

const publicfiles = path.join(__dirname,`../public`)
app.use(express.static(publicfiles))

io.on('connection', (socket) => {
    socket.on('join', (options, callback) => {
        console.log('new socket connection.!')
        const {error, user} = addUsers({id: socket.id, ...options})
        if(error) return callback(error)

        socket.join(user.room)

            console.log(socket.id)
        //server sends a message to the client
        socket.emit('message', generateMessage(user.username, 'welcome..!'))
        socket.broadcast.to(user.room).emit('broadcast',generateMessage(user.username, `${user.username} has joined..!`))
        io.to(user.room).emit('userslist', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })
    //the server receive's the clients return message and send the message to all client 
    socket.on('return', (reply,callback) => {
        const user = getUsers(socket.id)
        const filter = new Filter()
        if(filter.isProfane(reply)) return callback('You can not use harsh words..')

        socket.emit('reply', generateMessage(user.username, reply))
        socket.to(user.room).broadcast.emit('message', generateMessage(user.username, reply))
        callback()
    })
    socket.on('sendlocation', (coords,callback) => {
        const user = getUsers(socket.id)
        socket.emit('locationreply', generateMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        socket.to(user.room).broadcast.emit('locationmessage', generateMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user) {
            io.to(user.room).emit('broadcast', generateMessage(user.username, `${user.username} has left from the conversiation..!`))
            io.to(user.room).emit('userslist', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, '127.0.0.1', () => console.log(`Server is running on port 127.0.0.1:${port}`))