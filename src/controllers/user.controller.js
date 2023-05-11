const logger = require('../util/utils').logger;
const assert = require('assert');
const pool = require('../util/db-example')

let database = {
    users: [{
        id: 1,
        firstName: "Test",
        lastName: "Test",
        street: "Lovensdijkstraat",
        city: "Breda",
        isActive: "false",
        emailAdress: "Test@gmail.com",
        password: "123456",
        phoneNumber: "12345678"
    }, {
        id: 2,
        firstName: "Hendrik",
        lastName: "Jan",
        street: "Straat",
        city: "Stad",
        isActive: "true",
        emailAdress: "hj@gmail.com",
        password: "wachtwoord",
        phoneNumber: "0612345678"
    }]
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
    getAllUsers:(req, res, next) => {
        logger.info('get all users')
        let sqlStatement = 'Select * FROM `user`';
        if (Object.keys(req.query).length != 0) {
            for (let [key, value] of Object.entries(req.query)) {
                if (key != 'isActive') {
                    value = `'${value}'`
                }
                if (!sqlStatement.includes('WHERE')) {
                    sqlStatement += ` WHERE \`${key}\`= ${value}`
                } else {
                    sqlStatement += ` AND \`${key}\`= ${value}`
                }
            }
        }
        pool.getConnection(function (err, conn) {
            // Do something with the connection
            if (err) {
                logger.error(`MySQL error: ${err}`);
                next(`MySQL error: ${err.message}`)
            }
            if (conn) {
              conn.query(sqlStatement, function (err, results, fields) {
                if (err) {
                  logger.err(err.message);
                  next({
                    code: 409,
                    message: err.message
                  });
                }
                if (results) {
                  logger.info('Found', results.length, 'results');
                  res.status(200).json({
                    code: 200,
                    message: 'User getAll endpoint',
                    data: results
                  });
                }
              });
              pool.releaseConnection(conn);
            }
          });
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
    },
    filterUser:(req, res) => {
        const queryField = Object.entries(req.query);

        if(queryField.length == 2) {
            res.status(200).json({
                status: 200,
                message: 'Gefilterd op 2 parameters',
                data: {}
            })    
            console.log(`Dit is field 1 ${queryField[0][0]} = ${queryField[0][1]}`);
        } else if(queryField.length == 1) {
            res.status(200).json({
                status: 200,
                message: 'Gefilterd op 1 parameter',
                data: {}
            })    
        } else {
            res.status(200).json({
                status: 200,
                message: 'Overzicht van alle users',
                data: database.users
            })
        }

        //const field1 = req.query.firstName;
        //const field2 = req.query.isActive;
        //console.log(`Dit is field 1 ${field1}`);
        //console.log(`Dit is field 2 ${field2}`);
        res.status(200).json({
            status: 200,
            message: `Gefilterd op...`,
            data: {}
        })
    }
}

module.exports = controller