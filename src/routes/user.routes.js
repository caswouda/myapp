const express = require('express')
const router = express.Router()

let database = {
    users: [
        {
            id: '0',
            firstName: 'Cas',
            lastName: 'Wouda',
            street: 'Straat 1',
            city: 'Stad',
            isActive: true,
            emailAddress: 'ct@server.nl',
            password: 'password123',
            phoneNumber: '0612345678'
        },
        {
            id: '1',
            firstName: 'Piet',
            lastName: 'Hendrik',
            street: 'Straat 2',
            city: 'Stad',
            isActive: true,
            emailAddress: 'ph@server.nl',
            password: 'password12345',
            phoneNumber: '0612345678910'
        }
    ]
}
let id = 0

router.post('/api/user', (req, res) => {
    res.status(400).res.json(
        {
            status: 400,
            message: 'User Created',
            data: {
                id: id++,
                firstName: 'Klaas',
                lastName: 'Jan',
                street: 'Straat 3',
                city: 'Stad',
                isActive: true,
                emailAddress: 'kj@server.nl',
                password: 'password123456',
                phoneNumber: '06987654321'
            }
        }
    )
})

router.get('/api/user', (req, res) => {
    res.status(200).res.json(
        {
            status: 200,
            message: 'User info-endpoint',
            data: database.users
        }
    )
})  

router.get('/api/user/profile', (req, res) => {
    res.status(200).res.json(
        {
            status: 200,
            message: 'User info-endpoint',
            data: database.users
        })
})

router.post('/user', (req, res) => {
    res.send('Got a POST request')
    console.log('User 1')
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