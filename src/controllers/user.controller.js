const logger = require('../util/utils.js').logger;
const assert = require('assert');

let database = {
    users: []
}
let id = 0

let controller = {
    addUser:(req, res) => {
        let user = req.body
        console.log(user);
        try {
            // assert(user === {}, 'Userinfo is missing');
            assert(typeof user.firstName === 'string', 'firstName must be a string');
            assert(typeof user.emailAddress === 'string','emailAddress must be a string');
        } catch (err) {
            logger.warn(err.message.toString());
            // Als één van de asserts failt sturen we een error response.
            res.status(400).json({
              status: 400,
              message: err.message.toString(),
              data: {}
            });
            // Nodejs is asynchroon. We willen niet dat de applicatie verder gaat
            // wanneer er al een response is teruggestuurd.
            return;
        }
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
    },
    getAllUsers:(req, res) => {
        let result = ''
        if (database.users == '') {
            result = 'There are no users yet.'
        } else {
            result = database.users
        }
        res.status(200).json(
            {
                status: 200,
                message: 'User getAll endpoint',
                data: result
            }
        )
    },
    getUserFromId:(req, res) => {
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
                status: 404,
                message: `User with ID ${userId} not found`
            })
        }
    },
    deleteUserWithId:(req, res) => {
        const userId = req.params.userId
        let user = database.users.filter((item) => item.id == userId)
        if(user.length > 0){
            console.log(user)
            res.status(200).json({
                status: 200,
                message: 'Found user',
                data: user
            })
            database.users = database.users.filter((item => item.id != userId))
            console.log(`Deleted user with ID ${userId}`);
        } else {
            res.status(404).json({
                status: 404,
                message: `User with ID ${userId} not found`
            })
        }
    },
    getUserProfile:(req, res) => {
        res.status(200).json({
            status: 200,
            message: 'Found profile',
            data: {
                id: 200,
                firstName: 'Cas',
                lastName: 'Wouda',
                street: 'Straat 101',
                city: 'stad',
                isActive: true,
                emailAddress: 'ct.wouda@student.avans.nl',
                password: 'Wachtwoord',
                phoneNumber: '1233444555'
            }
        })
    },
    getInfo: (req, res) => {
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
    )},
    updateUser:(req, res) => {
        const userId = req.params.userId
        let oldUser = database.users.filter((item) => item.id == userId)
        let newUser = req.body
        newUser = {
            ...newUser
        }
        if(oldUser != undefined) {
            console.log(newUser)
            res.status(200).json({
                status: 200,
                message: 'Found user',
                data: newUser
            })
            oldUser.id = newUser.id
            oldUser.firstName = newUser.firstName
            oldUser.lastName = newUser.lastName
            oldUser.street = newUser.street
            oldUser.city = newUser.city
            oldUser.isActive = newUser.isActive
            oldUser.emailAddress = newUser.emailAddress
            oldUser.password = newUser.password
            oldUser.phoneNumber = newUser.phoneNumber
        }
        else{
            res.status(404).json({
                status: 400,
                message: `User with ID ${userId} not found`
            })
        }
    }
}

module.exports = controller