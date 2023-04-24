const express = require('express')
const app = express()
const port = 3000

let database = {
    users: [
        {
            firstName: 'Cas',
            lastName: 'Wouda',
            email: 'ct@server.nl'
        },
        {
            firstName: 'Piet',
            lastName: 'Hendrik',
            email: 'ph@server.nl'
        }
    ]
}

let username = 'Cas'
let password = 'password'
let users = ['Cas', 'Piet']
let id = 1

app.post('/api/user', (req, res) => {
    res.status(200).res.json(
        {
            status: 200
        }
    )
})

app.get('/api/user', (req, res) => {
    res.status(200).res.json(
        {
            status: 200,
            message: 'User info-endpoint',
            data: database.users
        }
    )
})  

app.get('/user', (req, res) => {
  res.send('Got a GET request for user with id:' + id)
    console.log('Retrieved user with id ' + id);
})

app.post('/user', (req, res) => {
    res.send('Got a POST request')
    console.log('User 1')
})

app.post('/user/details', (req, res) => {
    res.send('Username: ' + username + '\nPassword: ' + password)
    console.log('Retrieved details')
})

app.delete('/user', (req, res) => {
    res.send('Got a DELETE request at /user')
    console.log('User deleted')
})

app.use('*',(req, res, next) => {
    const method = req.method
    console.log(`Methode ${method} is aangeroepen`)
    next()
  })

app.get('/api/info', (req, res) => {
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

  app.use('*',(req, res) => {
    res.status(404).json(
        {
            status: 404,
            message: 'Endpoint not found',
            data: {}
        }
    )
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;
