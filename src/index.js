require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')

const app = express()

// data base setup
mongoose.connect(
  process.env.MONGO_URL, {
  useNewUrlParser: true,

})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
//libera acesso a pasta local do node onde estao as fotos
app.use(
  '/files', 
  express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
)


app.use(require("./routes"))

// app.listen(3000)

app.listen(3000, function() {
  console.log('Execuntando na porta 3000')
})

