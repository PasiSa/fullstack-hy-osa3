const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

//app.use(morgan('tiny'))
app.use(morgan(function (tokens, req, res) { 
  const body = JSON.stringify(req.body)
  if (tokens.method(req, res) === 'POST') {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      body
    ].join(' ')
  }
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}))

app.get('/api/persons', (req, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const pers = persons.find(pers => pers.id === id)
  if (pers) {
    response.json(pers)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const nowDate = new Date();
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
    ${nowDate}`)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(pers => pers.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const pers = request.body
  if (!pers.name) {
    console.log('Name is missing')
    response.status(400).json({
      error: 'Name is missing'
    })
    return
  }
  if (!pers.number) {
    response.status(400).json({
      error: 'Number is missing'
    })
    return
  }
  const person = new Person({
    name: pers.name,
    number: pers.number,
  })
  person.save().then(savedNote => {
    response.json(savedNote)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
