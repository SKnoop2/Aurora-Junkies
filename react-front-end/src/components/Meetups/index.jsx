import React from 'react';
import { useState, useMemo } from 'react';
import Header from './Header.jsx';
import Events from './Events.jsx'
import AddEvent from './AddEvent.jsx'
import SafetySend from './SafetySend'

import { CheckedContext } from './CheckedContext.jsx'
import MeetupPanel from './MeetupPanel.jsx';
import { AddEventContext } from './AddEventContext.jsx'

export default function Meetups() {

  const [showAddEvent, setShowAddEvent] = useState(false)
  const [checked, setChecked] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      location_id: 1,
      name: "Banff",
      date: '2021-04-22',
      time: '22:30:00',
      lat: '51.1784',
      long: '-115.5708'
    },
    {
      id: 2,
      location_id: 3,
      name: "Moberly Lake",
      date: '2021-05-21',
      time: '22:00:00',
      lat: '55.8233',
      long: '-121.7889'
    },
    {
      id: 3,
      location_id: 2,
      name: "Jasper",
      date: '2021-05-26',
      time:'01:20:00',
      lat: '53.118766',
      long: '-118.027272'
    }
  ])

  const eventCheck = useMemo(() => ({showAddEvent, setShowAddEvent}), [showAddEvent, setShowAddEvent])
  const valueCheck = useMemo(() => ({checked, setChecked}), [checked, setChecked])
  // const constructor = (props) => {
  //   super(props)
  //   this.state = {
  //     message: 'Click the button to load data!'
  //   }
  // }

  // fetchData = () => {
  //   axios.get('/api/data') // You can simply make your requests to "/api/whatever you want"
  //   .then((response) => {
  //     // handle success
  //     console.log(response.data) // The entire response from the Rails API

  //     console.log(response.data.message) // Just the message
  //     this.setState({
  //       message: response.data.message
  //     });
  //   }) 
  // }

    // delete event
    const deleteEvent = (id) => {
      setEvents(events.filter((event) => event.id !== id))
    }

    // add event
    const addEvent = (event) => {
      // temporary code; will want to write function to add next available meetup id
      // generate random number for id
      const id = Math.floor(Math.random() * 10000) + 1
      // add id to provided event info
      const newEvent = { id, ...event }

      // display existing events, and add new event to displayed data
      setEvents([...events, newEvent])
    }

    return (
      <>
        <CheckedContext.Provider value={valueCheck}>
          <div className="cont" >
            <AddEventContext.Provider value={eventCheck}>
              <div className="container-allmeets">
                <Header onAdd={() => setShowAddEvent(!showAddEvent)} showAddEvent={showAddEvent}/>        
                {showAddEvent && <AddEvent onAdd={addEvent} />}
                {events.length > 0 ? <Events events={events} onDelete={deleteEvent} /> : 'No events to show'}
              <br />
              </div>
            </AddEventContext.Provider>
            <div className="mpanel">
              <div>
                <MeetupPanel />
              </div>
            </div>
              </div>
              <div>
                <SafetySend />
              </div>
        </CheckedContext.Provider>
      </>
    );
}
