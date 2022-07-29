/** @format */
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
//
//
const errorMiddleware = require('./middleware/errorMiddleware')
//
//
const router = require('./router/index')
//
//
const app = express()
const PORT = process.env.PORT || 4040
//
//
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
)
app.use('/api', router)
app.use(errorMiddleware)

//
//

const start = async () => {
  try {
    await mongoose
      .connect(process.env.MONGODB_PASSWORD)
      .then(() => console.log('Connect good'))
    app.listen(PORT, () => {
      return console.log(`Server start ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
