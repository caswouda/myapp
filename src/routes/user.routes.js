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

router.put('/api/user/:userId', userController.updateUser)

router.delete('/api/user/:userId', userController.deleteUserWithId)

router.get('/api/info', userController.getInfo)

module.exports = router