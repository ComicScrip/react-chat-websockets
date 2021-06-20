const express = require('express');
const uniqid = require('uniqid');
const app = express();
const port = 3001;

const server = app.listen(port, () =>
  console.log(`app listening at http://localhost:${port}`)
);
const socketIO = require('socket.io');

const io = socketIO(server, {
  cors: {
    origin: ['http://localhost:3000'],
  },
});

const messages = [
  { id: uniqid(), author: 'server', text: 'welcome to WildChat' },
];

io.on('connect', (socket) => {
  console.log('user connected');

  socket.emit('initialMessageList', messages);

  socket.on('messageFromClient', (messageTextAndAuthor) => {
    const newMessage = { id: uniqid(), ...messageTextAndAuthor };
    console.log('new message from a client: ', newMessage);
    messages.push(newMessage);
    io.emit('messageFromServer', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
