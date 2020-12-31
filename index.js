const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
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
  const newId = Math.floor(Math.random() * 99000)
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
  if (persons.find(n => n.name === pers.name)) {
    response.status(400).json({
      error: 'Name already exists'
    })
    return
  }
  pers.id = newId
  //console.log(pers)
  persons = persons.concat(pers)
  response.json(pers)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
