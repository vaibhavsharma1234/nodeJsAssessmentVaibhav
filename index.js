const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
require('dotenv').config()
const connection = require('./config/db')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.json())
app.use(cors())
app.use('/v1', require('./routes/routes'))
connection()
app.listen(8000, () => {
  console.log('server is runninng at port 8000')
})
