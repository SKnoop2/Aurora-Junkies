import React, { useState, useEffect, useContext, useRef } from 'react'
import io from 'socket.io-client'

import Input from './Input'
import InfoBar from './InfoBar'
import Messages from './Messages'
import TextContainer from './TextContainer'
import { authContext } from '../../AuthProvider'
import { MeetupsContext } from '../../MeetupsContext'


const ENDPOINT = 'http://localhost:5000'

const Chatbox = () => {

  let socket = useRef(null)

  const [ name, setName ] = useState('')
  const [ room, setRoom ] = useState('')
  const [ message, setMessage ] = useState([])
  const [ messages, setMessages ] = useState([])
  const [ users, setUsers ] = useState('')

  const { user } = useContext(authContext);
  const { meetup } = useContext(MeetupsContext)

  useEffect(() => {
    
    socket.current = io(ENDPOINT);
    
    
    setName(user.name);
    setRoom(meetup.name);
    


    socket.current.emit('join', { name: user.name, room: meetup.name }, () => {

    });


    return () => {
      socket.current.emit('disconnection');

      socket.current.off();
    }
  }, [ ENDPOINT ])

  useEffect(() => {

    socket.current.on('message', (message) => {
      setMessages([...messages, message])
    })

    socket.current.on('roomData', ({ users }) => {
      setUsers(users);
    })
  }, [ messages ])

  const sendMessage = e => {
    e.preventDefault();

    if(message) {
      socket.current.emit('sendMessage', message, () => setMessage(''))
    }
  }

  return (<>{user  ?  (<>
    <div className='outerContainer'>
      <div className='innerContainer'>
        <InfoBar room={meetup.name} />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
    </div>
    </>) : (<><p>Hello</p></>)}</>)
  
}

export default Chatbox