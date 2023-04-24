const express = require('express')
const router = express.Router()
//const bodyParser = require('body-parser')

//router.use(bodyParser.json())

let database = {
    users: []
}
let id = 0

router.post('/api/user', (req, res) => {
    let user = req.body
    console.log(user);
    id++
    user = {
        id,
        ...user
    }
    database.users.push(user)
    console.log(database);
    res.status(201).json(
        {
            status: 201,
            message: 'User Created',
            data: database.users
        }
    )
})

router.get('/api/user', (req, res) => {
    res.status(200).json(
        {
            status: 200,
            message: 'User info-endpoint',
            data: database.users
        }
    )
})  

router.get('/api/user/profile', (req, res) => {
    res.status(200).json(
        {
            status: 200,
            message: 'User info-endpoint',
            data: database.users
        })
})

router.get('/api/user/:userId', (req, res) => {
    const userId = req.params.userId
    let user = database.users.filter((item) => item.id == userId)
    if(user.length > 0) {
        console.log(user)
        res.status(200).json({
            status: 200,
            message: 'Found user',
            data: user
        })
    }
    else{
        res.status(404).json({
            status: 400,
            message: `User with ID ${userId} not found`
        })
    }
})

router.post('/user/details', (req, res) => {
    res.send('Username: ' + username + '\nPassword: ' + password)
    console.log('Retrieved details')
})

router.delete('/user', (req, res) => {
    res.send('Got a DELETE request at /user')
    console.log('User deleted')
})

router.get('/api/info', (req, res) => {
    let path = req.path
    console.log(`op route ${path}`);
    res.status(201).json(
        {
            status: 201,
            message: 'Server info-endpoint',
            data: {
                studentName: 'Cas',
                studentNumber: 1234567,
                description: 'Welkom bij de server API van share a meal'
            }
        }
    )
  })

module.exports = router