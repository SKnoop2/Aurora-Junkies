const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')
const bodyParser = require('body-parser')
const db = require('./chat-queries')

const { addUser, removeUser, getUser, getUsersInRoom } = require('./chat-users')

const PORT = process.env.PORT || 5000
const socketPort = 8000;

const { emit } = require('process')
const router = require('./chat-router')

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors())
app.use(router)
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (req, res) => {
  res.json({ info: 'Chat server up and running'})
})

// connection, alert and send top 10 messages
io.on('connection', (socket) => {
  console.log('a user has connected');
  socket.on('chat message', (msg) => {
    db.createSocketMessage(JSON.parse(msg))
    .then((_) => {
      emitMostRecentMessages();
    })
    .catch(err => io.emit(err))
  })

  // close when disconnect happens
  socket.on('disconnection', () => {
    console.log('user disconnected')
  })
})


app.get('/messages', db.getMessages)

app.post('/messages', db.createMessage)


server.listen(PORT, () => console.log(`Chat running on port ${PORT}`))
server.listen(socketPort, () => console.log(`Socket listening on ${socketPort}`))

// io.on('connection', (socket) => {
//   socket.on('join', ({ name, room }, callback) => {

//     const { error, user } = addUser({ id: socket.id, name, room })

//     if(error) return callback(error);

//     socket.emit('message', { user: 'Aurora Bot', text: `${user.name} welcome to the ${room} chat` })

//     socket.broadcast.to(user.room).emit('message', { user: 'Aurora Bot', text: `${user.name} has joined!` })
    
//     socket.join(user.room);

//     io.to(user.room).emit('roomData', { room: user.room , users: getUsersInRoom(user.room)})

//     callback();
//   })

//   socket.on('sendMessage', (message, callback) => {
//     const user = getUser(socket.id)


//     io.emit('message', { user: user.name, text: message })



//     callback();
//   })
//   socket.on('disconnection', () => {
//     const user = removeUser(socket.id)

//     if(user){
//       io.emit('message', { user: 'Aurora Bot', text: `${user.name} has left the room`})
//       io.emit('roomData', { room: user.room, users: getUsersInRoom(user.room)})
//     }
//   })
// })