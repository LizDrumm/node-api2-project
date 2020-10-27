const express = require('express');
const dbRouter = require('./data/dbRouter.js')

const server = express();

// are where we configure the app/server
server.use(express.json()); // gives Express the ability to parse the req.body
server.use(dbRouter)

server.get('/', (req, res) => {
  res.send(`
    <h2>Lambda Data API</h>
    <p>Welcome to the Lambda Data API</p>
  `);
});

// common.js equiv of export default
module.exports = server
