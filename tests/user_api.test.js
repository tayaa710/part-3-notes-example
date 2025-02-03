const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const helper = require('./test_helper')
const User = require('../models/user')



describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'rootsssss', passwordHash })

    await user.save()
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'rootsssss',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is not long enough', async () => {
    const usersAtStart = await helper.usersInDb

    const newUser = {
      username: 'no',
      name: 'Too Short',
      password: "Haggis",
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb

    assert.strictEqual(usersAtStart.length,usersAtEnd.length)
  })

  test('creation fails with proper statuscode and message if username contains bad characters', async () => {
    const usersAtStart = await helper.usersInDb

    const newUser = {
      username: 'aaaaaaahhhhhhhh.',
      name: 'Too Short',
      password: "Haggis",
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb

    assert.strictEqual(usersAtStart.length,usersAtEnd.length)
  })

})

after(async () => {
  await mongoose.connection.close()
})