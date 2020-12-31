// mongodb+srv://fullstack:<password>@cluster0.xzews.mongodb.net/persons?retryWrites=true&w=majority

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.xzews.mongodb.net/persons?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(note => {
      console.log(`${note.name} ${note.number}`)
    })
    mongoose.connection.close()
  })
} else {
  if (process.argv.length < 5) {
    console.log('give name and number')
    process.exit(1)
  }

  const pers = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  pers.save().then(response => {
    console.log('person saved')
    mongoose.connection.close()
  })
}