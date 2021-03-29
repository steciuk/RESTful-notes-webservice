require('dotenv').config()
const express = require('express')
const app = express()
const expressLayouts = require ('express-ejs-layouts')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const indexRouter = require(__dirname + '/routes/index')
const notesRouter = require(__dirname + '/routes/notes')
const archiveRouter = require(__dirname + '/routes/archive')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

mongoose.connect('mongodb://localhost/notes', { useNewUrlParser: true,  useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("Connected to database"))

app.use('/', indexRouter)
app.use('/notes', notesRouter)
app.use('/archive', archiveRouter)

app.listen(process.env.PORT || 3000) 