import React, {useEffect, useState} from 'react'
import './App.css';
import socketIOClient from "socket.io-client";

function App() {
  const [messageList, setMessageList] = useState([])
  const [nickName, setNickName] = useState('')
  const [newMessageText, setNewMessageText] = useState('')
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const socket = socketIOClient('http://localhost:3000')
    setSocket(socket)
    socket.on("initialMessageList", data => {
      setMessageList(data)
    });
    socket.on("newMessageFromServer", data => {
      console.log('received message from server', data)
      setMessageList(messageList => [...messageList, data])
    });
    return () => socket.disconnect()
  }, []);

  const handleSubmit = e => {
    e.preventDefault()
    if (newMessageText && nickName) {
      socket.emit('newMessage', {author: nickName, text: newMessageText})
    }
  }

  return (
    <div className="App">
      <h2>Messages</h2>
      {messageList.map(message => {
        return (
          <div key={message.id}>
            {message.author} : {message.text}
          </div>
        )
      })}

      <form onSubmit={handleSubmit}>
        <h2>New Message</h2>
        <input type="text"
               name="author"
               placeholder="nickname"
               value={nickName}
               required
               onChange={(e) => setNickName(e.target.value)}/>
        <input type="text"
               name="messageContent"
               placeholder="message"
               value={newMessageText}
               required
               onChange={(e) => setNewMessageText(e.target.value)}/>
        <input type="submit" disabled={!nickName || !newMessageText} onClick={handleSubmit} value="send"/>
      </form>
    </div>
  );
}

export default App;
