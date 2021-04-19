import React from 'react'
import axios from 'axios'
import onlineIcon from '../../icons/onlineIcon.png'

const TextContainer = () => {

  // axios.get('http://localhost:8080/api/photographers', {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // })
  //   .then(data => console.log('data from client:', data))
  const data = [];
  // console.log('data', data)
  return (
    <div className="textContainer">
    {
      data
        ? (
          <div>
            <h4>People currently chatting:</h4>
            <div className="activeContainer">
              <h4>
                {data.map(({name}) => (
                  <div key={name} className="activeItem">
                    {name}
                    <img alt="Online Icon" src={onlineIcon}/>
                  </div>
                ))}
              </h4>
            </div>
          </div>
        )
        : null
    }
  </div>
);
 
}

export default TextContainer
