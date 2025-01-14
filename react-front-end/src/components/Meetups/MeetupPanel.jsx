import React, { useContext, useState } from 'react'
import { MeetupsContext } from '../../MeetupsContext.jsx'
import { CheckedContext }from './CheckedContext.jsx'
import Attendees from './Attendees.jsx'
import Chatbox from '../Chat/Chatbox'
import Fade from '@material-ui/core/Fade'

const MeetupPanel = () => {
  const contextCheck = useContext(CheckedContext)
  const context = useContext(MeetupsContext)

  const [attendees, setAttendees] = useState([
    {
      id: 1,
      name: "Alice Anderson"
    },
    {
      id: 2,
      name: "Betty Boop"
    },
    {
      id: 3,
      name: "Charlie Chapman"
    },
  ])

  return (
    <div className="mpanel-outer">
      <Fade in={contextCheck.checked}>
        <div className='mpanel'>
          <div><h1>{context.meetup.name}</h1></div>
          <div> 
            <p>Date: {context.meetup.date}</p>
            <p>Time: {context.meetup.time}</p>
            <p>Latitude: {context.meetup.lat}</p>
            <p>Longitude: {context.meetup.long}</p>
          </div>
          <h3>Attendees</h3>
          {attendees.length > 0 ? <Attendees attendees={attendees} /> : 'No Attendees to this meetup.'}
        </div>
      </Fade>
      <Fade in={contextCheck.checked}>
        <div className='mpanel-chat'>
          {context ? <Chatbox /> : 'Choose an Event'}
        </div>
      </Fade>
    </div>
  )
}

export default MeetupPanel
