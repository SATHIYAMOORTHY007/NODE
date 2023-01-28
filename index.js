const express = require('express')
const mongodb = require('mongodb')
const mongoClient = mongodb.MongoClient
const URL = 'mongodb+srv://admin:admin123@cluster0.j6kbytn.mongodb.net/'

const cors = require('cors')
const app = express()

const bcrypt = require('bcryptjs')

app.use(express.json())
app.use(
  cors({
    origin: 'http://localhost:3000',
  }),
)

const users = []
app.get('/user', async (req, res) => {
  try {
    //connect mongobd
    const connection = await mongoClient.connect(URL)
    //select database
    const db = connection.db('')

    //select collection
    const collection = db.collection('users')

    //do operation
    const users = await collection.find({}).toArray()

    await connection.close()
    res.json(users)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'something went wrong' })
  }
})

app.post('/user', async (req, res) => {
  /* users.push({
    id: users.length - 1,
    name: 'user1',
    age: 20,
  })
  app.json('sucess') */

  //mongo connect operations
  //1.connect mongo
  //2.select database
  //3.select collection
  //4.do operation

  try {
    //connect mongobd
    const connection = await mongoClient.connect(URL)
    //select database
    const db = connection.db('')

    //select collection
    const collection = db.collection('users')

    //do operation
    const operation = await collection.insertOne(req.body)

    await connection.close()
    res.json({ message: 'user Inserted' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'something went wrong' })
  }
})

app.put('/user/:userId', (req, res) => {
  console.log(req.params.userId)
  /* const index = users.findIndex((o) => o.id == req.params.userId) */
  //users[index].age =req.body.age;
  /*   console.log(Object.keys(req.body)) */

  Object.keys(req.body).forEach((field) => {
    users[index][field] = req.body(field)
  })

  res.json({ message: 'sucess' })
})

app.delete('/user/:userId', (req, res) => {
  const index = users.findIndex((o) => o.id == req.params.userId)
  users.splice(index, 1)
})

//user registration
app.post('/register', async (req, res) => {
  try {
    //connect mongobd
    const connection = await mongoClient.connect(URL)
    //select database
    const db = connection.db('')

    //select collection
    const collection = db.collection('admin_users')

    const salt = await bcrypt.genSalt(10)

    const hash = await bcrypt.hash(req.body.password, salt)
    console.log(hash)
    req.body.password = hash
    //do operation
    const users = await collection.insertOne(req.body)

    await connection.close()
    res.json(users)
  } catch (error) {
    console.log(error)
  }
})

app.post('/login', async (req, res) => {
  try {
    //connect mongobd
    const connection = await mongoClient.connect(URL)
    //select database
    const db = connection.db('')

    //select collection
    const collection = db.collection('admin_users')

    const user = await collection.findOne({ email: req.body.name })
    if (user) {
      const compare = await bcrypt.compare(req.body.password, user.password)
      if (compare) {
        res.json({ message: 'correct' })
      } else {
        res.status(401).json({ message: 'password wrong' })
      }
    } else {
      res.status(401).json({ message: 'user not found' })
    }
    await connection.close()
    res.json(users)
  } catch (error) {
    console.log(error)
  }
})

app.listen(3100)
