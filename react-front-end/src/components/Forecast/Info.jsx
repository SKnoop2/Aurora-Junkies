import React from 'react'

export default function Info () {
  return (
    <div className="information">
      <div className="info">
        <h3>What is a Kp-Index?</h3>
        <p>Kp Index indicates the level of geomagnetic activity measured in the atmosphere. These numbers are measured and monitored by NOAA and other agencies. The most accurate Kp predictions are 2-4 days in advance, the time it takes solar wind to reach the earth (see more below). The higher the Kp index is, the more likely you are to be able to see the northern lights. Your location also plays a factor in how likely you are to see aurora. 
        </p>
      </div>
      <div className="map-cont">
        <h3>Kp-Index and Aurora viewing locations</h3>
          <img className="mapimg" alt="Kp index Map" src="https://github.com/SKnoop2/Aurora-Junkies/blob/feature/forecast/docs/KP%20Index%20Map.jpg?raw=true" />
          {/* <figcaption className="caption" >Source: cdn.softservenews.com</figcaption> */}
          <br />
          <p>Canadian territories and northern parts of provinces are able to see aurora with low Kp index numbers around level 3. Therefor, they see the northern lights the most often. Those living further south, in areas like Calgary and Edmonton are able to see the aurora when Kp levels reach 5. The remainder of Canadians will need to wait until Kp index goes as high as 7 to see the northern lights.</p>
      </div>
      <div className="info">
        <h3>What causes the Aurora?</h3>
        <p>Protons and electrons ejected by the sun get carried by solar wind towards Earth. These particles get trapped in the earth's atmosphere and are transported towards the poles via Earth's magnetic field, where they collide with nitrogen and oxygen elements. These collisions cause the electrons to transfer energy in the form of the beautiful aurora we see in the night sky.
        </p>
      </div>
      {/* <div className="info">
        <h2>hello</h2>
      </div> */}
    </div>
  )
}

