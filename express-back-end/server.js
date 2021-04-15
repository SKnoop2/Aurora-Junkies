const Express = require('express');
const cors = require('cors')
const App = Express();
const BodyParser = require('body-parser');
const PORT = 8080;
const http = require('https');
const LineByLineReader = require('line-by-line')


// Express Configuration
App.use(BodyParser.urlencoded({ extended: false }));
App.use(BodyParser.json());
App.use(Express.static('public'));

// cors configuration
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // For legacy browser support
}

App.use(cors(corsOptions));

// Sample GET route
App.get('/api/data', (req, res) => {
  
  const options = {
    host: 'services.swpc.noaa.gov',
    path: '/text/3-day-forecast.txt',
    method: 'GET',
  };
  
  let data = {}; 
  
  const readKpiData = () => {
    
    const request = http.request(options, (response) => {
      response.setEncoding('utf8');
      
      lr = new LineByLineReader(response);
      
      lr.on('error', function (err) {
        console.log('err', err);
      });
      
      let counter = -1;
  
      lr.on('line', function (line) {
        if (counter >= 0) {
          counter += 1
        }
  
        if (counter == 2) {
          const arr = line.split(' ')
          const filtArr = arr.filter(element => element.length >= 1)
        
          data = {
            day1: {date:`${filtArr[0]} ${filtArr[1]}`},
            day2: {date:`${filtArr[2]} ${filtArr[3]}`},
            day3: {date:`${filtArr[4]} ${filtArr[5]}`}
          };
        }
        if (line.includes('NOAA Kp index breakdown')){
          counter = 0
        }
        if (line.includes('UT') && !line.includes('UTC')) {
          const arr = line.split(' ')
          const filtArr = arr.filter(element => element.length >= 1)
          const key = filtArr[0]
          timeArr = [
            '00:00:00Z', 
            '03:00:00Z', 
            '06:00:00Z', 
            '09:00:00Z', 
            '12:00:00Z', 
            '15:00:00Z', 
            '18:00:00Z', 
            '21:00:00Z'
          ]
          // data.day1[key] = { time: timeArr[counter-3], kpi: filtArr[1]}
          // data.day2[key] = { time: timeArr[counter-3], kpi: filtArr[2]}
          // data.day3[key] = { time: timeArr[counter-3], kpi: filtArr[3]}
          data.day1[timeArr[counter-3]] = {kpi: filtArr[1]}
          data.day2[timeArr[counter-3]] = {kpi: filtArr[2]}
          data.day3[timeArr[counter-3]] = {kpi: filtArr[3]}
        }
        console.log('data: ', data)
      });
      
      lr.on('end', function () {
        // console.log(data);
        console.log('end');
        // need data to come back as json format
        res.json(data)
      });
      
    });
    
    request.on('error', (e) => {
      console.log('problem with request', e);
      request.abort();
    });
    request.end();
  }
  readKpiData();

  // res.json({result: "this is returning back"});

});

App.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Express seems to be listening on port ${PORT} so that's pretty good 👍`);
});
