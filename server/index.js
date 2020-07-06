const express = require('express');
const cors = require('cors')
const uniqid = require('uniqid')
const app = express();
const port = 3000;

const messages = [{id: 1, author: 'server', text: 'hello'}]

app.use(cors());
const server = app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

const io = require('socket.io').listen(server)

io.origins('http://localhost:3001') // for latest version

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.join('chatroom')
  socket.emit('initialMessageList', messages)

  socket.on('newMessage', (data) => {
    console.log('received client message', data)
    const newMessage = {...data, id: uniqid()}
    messages.push(newMessage)
    io.to('chatroom').emit('newMessageFromServer', newMessage)
  })
});

