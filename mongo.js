const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const password = process.argv[2]

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url = process.env.MONGODB_URI
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'Baggis, Boggis, Bince',
  important: true,
})

// Note.find({}).then(result => {
//     result.forEach(note => {
//         console.log(note)
//     })
//     mongoose.connection.close()
// })

note.save().then(result => {
  console.log(result)
  mongoose.connection.close()
})