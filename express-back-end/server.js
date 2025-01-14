const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const app = express();
const BodyParser = require('body-parser');
const PORT = 8080;
const http = require('https');
const LineByLineReader = require('line-by-line');
const { getMaxListeners } = require('process');
const db = require('./db');
const { user } = require('./config');
require('dotenv').config();

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Cors configuration: blocks browser from restricting data
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // For legacy browser support
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}
app.use(cors(corsOptions));

// Express Configuration
app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());
app.use(express.static('public'));

// req.body
app.use(express.json())

app.use(function(req, res, next) {
  res.setHeader('Content-Type', 'application/json')
  next();
});

// TODO refactator to move DB queries to new file
// create an aurora location
app.post('/maps', async(req, res) => {
  res.setHeader('Content-Type', 'application/json')
  try {
    const { location_name, province, latitude, longitude, photo_url, photo_credit } = req.body.location
    console.log("req.body.location:", req.body.location)
    const query = `INSERT INTO locations (location_name, province, latitude, longitude, photo_url, photo_credit)
    VALUES ($1, $2, $3, $4, $5, $6)`
    await db.query(query, [location_name, province, latitude, longitude, photo_url, photo_credit])
    const query2 = `SELECT * FROM locations`
    // await is an implicit return; async only works with an await
    await db.query(query2).then((data) => {
      res.send(data.rows)
    }).catch((err) => {
      console.log(err.message)
    })
  } catch(err) {console.error(err)}
});

// get aurora locations
app.get('/maps', (req,res) => {
  const query = `SELECT * FROM locations`
    db.query(query).then((data) => {
      res.send(data.rows)
    }).catch((err) => {
      console.log(err.message)
  });
})

//get user from db for login
app.post('/login', (req, res) => {
  const credentials = JSON.parse(req.body.credentials);
	const email = credentials.email;
	const password = credentials.password;
	if (email && password) {
    const query = `SELECT * FROM photographers WHERE email = $1 AND password = $2`
    db.query(query, [email, password]).then((data) => {
      res.send(data.rows[0])
    }).catch((err) => {
    });
	}
});

//get user for profile page
app.get('/profile/:id', (req,res) => {
  console.log('req.params.id: ', req.params.id)
  const query = `SELECT * FROM photographers WHERE id = $1`
    db.query(query, [req.params.id]).then((data) => {
      res.send(data.rows[0])
    }).catch((err) => { 
      console.log(err.message)
  });
})

app.get('/meetups', (req,res) => {
  // console.log('meetups...:', req.body.rows[0])
  const query = `SELECT * FROM meetups`
  db.query(query).then((data) => {
      res.send(data.rows[0])
    }).catch((err) => {
      console.log(err.message)
  });
})



// GET route for Aurora Data
app.get('/api/data', (req, res) => {
  
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
          let before = line.split(' ')
          let after = before.reduce((r, v) => {
            if (v.toString().match(/\(G\d+\)/)) r[r.length - 1] += ' ' + v;
            else r.push(v);
            return r;
        }, []);
          const filtArr = after.filter(element => element.length >= 1)
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
          // Populate data object with scraped data
          data.day1[timeArr[counter-3]] = {kpi: filtArr[1]}
          data.day2[timeArr[counter-3]] = {kpi: filtArr[2]}
          data.day3[timeArr[counter-3]] = {kpi: filtArr[3]}
        }
      });
      
      lr.on('end', function () {
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
});

// Route to send texts via twilio. 
// Will try to see if possible to reconfigure this to front end react router dom
app.get('/text', (req, res) => {
  // GET variables passed via query string
  const { recipient, textmessage } = req.query
  
  // Send text
  client.messages.create({
    body: textmessage,
    to: `+1${recipient}`,
    from: '+15873271815'
  }).then((message) => console.log(message.body));
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Express seems to be listening on port ${PORT} so that's pretty good 👍`);
});