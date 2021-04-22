import React from 'react';

import Kpindex from './Kpindex';
import Weather from './Weather'
import Info from './Info'

export default function Forecast() {
  return (
    <div >
      <div className="cont">
        <Kpindex />
        <Weather />
      </div>
      <div className="cont">
        <Info />
      </div>
    </div>
  );
}
