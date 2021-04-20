const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'lhlstudent',
  host: 'localhost',
  database: 'aurora',
  password: 'ourawesomegroup',
  port: 5432,
});

const getMessages = (req, res) => {
  pool.query(
    'SELECT * FROM messages ORDER BY id DESC LIMIT 10',
    (error, results) => {
      if(error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  )
}

const createMessage = (req, res) => {
  const { photographer_id, message } = req.body;

  pool.query(
    "INSERT INTO messages (photographer_id, message) VALUES ($1, $2) RETURNING photographer_id, message, timestamp",
      [photographer_id, message],
      (error, results) => {
        if(error) {
          throw error;
        }
        response.status(201).send(results.row)
      }
  )
}

// SOCKET DB
const getSocketMessages = () => {
  return new Promise((resolve) => {
    pool.query(
      'SELECT * FROM messages ORDER BY id DESC LIMIT 10',
      (error, results) => {
        if(error) {
          throw error;
        }
        resolve(results.rows)
      }
    )
  }
  )
}

const createSocketMessage = (message) => {
  return new Promise((resolve) => {
    pool.query(
      'INSERT INTO messages (photographer_id, message) VALUES ($1, $2) RETURNING photographer_id, message, timestamp',
      [message.photographer_id, message.message],
      (error, results) => {
        if(error) {
          throw error;
        }
        resolve(results.rows);
      }
    )
  }
  )
}

module.exports = { getMessages, createMessage, getSocketMessages, createSocketMessage }