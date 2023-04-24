const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const userController = require('../controllers/user.controller')

router.use(bodyParser.json())

let database = {
    users: []
}
let id = 0

router.post('/api/user', userController.addUser)

router.get('/api/user', userController.getAllUsers)  

router.get('/api/user/profile', userController.getUserProfile)

router.get('/api/user/:userId', userController.getUserFromId)

router.put('/api/user/:userId', (req, res) => {
    const userId = req.params.userId
    let oldUser = database.users.filter((item) => item.id == userId)
    let newUser = req.body
    newUser = {
        ...newUser
    }
    if(oldUser.length > 0) {
        console.log(newUser)
        res.status(200).json({
            status: 200,
            message: 'Found user',
            data: oldUser
        })
        
    }
    else{
        res.status(404).json({
            status: 400,
            message: `User with ID ${userId} not found`
        })
    }

})

router.delete('/api/user/:userId', userController.deleteUserWithId)

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