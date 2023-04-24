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
            database.users.splice(user)
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
    }
}

module.exports = controller