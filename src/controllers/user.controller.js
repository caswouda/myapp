const logger = require('../util/utils').logger;
const assert = require('assert');
const pool = require('../util/db-example')
const Joi = require('joi');
const userSchema = require('../util/validation');

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
        logger.info('Register user');
        const user = req.body;
        logger.trace('user = ', user);
        pool.getConnection(function(err, conn) {
            if(err){
              logger.error('error ', err)
              next(err.message)
            }
            if(conn){
              pool.query('SELECT * FROM `user` WHERE `emailAdress` = ?', [user.emailAdress], function(err, results, fields) {
                if (err) {
                  logger.error('Database error: ' + err.message);
                  return next(err.message);
                }
        
            if (results.length > 0) {
                logger.error('Email address already in use');
                return res.status(400).json({
                    status: 400,
                    message: 'User with specified email address already exists',
                    data: {}
                });
            } else {
                try {
                    const newUser = {
                      firstName: user.firstName,
                      lastName: user.lastName,
                      isActive: user.isActive,
                      emailAdress: user.emailAdress,
                      password: user.password,
                      phoneNumber: user.phoneNumber,
                      street: user.street,
                      city: user.city
                    };
                  const { error, value } = userSchema.validate(newUser);
                  if (error) {
                    throw new Error(error.message);
                  }
                  sqlStatement = `INSERT INTO \`user\` (firstName,lastName,isActive,emailAdress,password,phoneNumber,street,city) VALUES ('${req.query.firstName}','${req.query.lastName}',${(req.query.isActive == undefined ? true : req.query.isActive)},'${req.query.emailAdress}','${req.query.password}','${req.query.phoneNumber}','${req.query.street}','${req.query.city}')`;
                  
                  res.status(201).json({
                    status: 201,
                    message: 'User created',
                    data: newUser
                  });
                } catch (err) {
                    logger.error('Userdata not complete: ' + err.message.toString());
                    res.status(400).json({
                    status: 400,
                    message: err.message.toString(),
                    data: {}
                    });
                }
            }
            })
            pool.releaseConnection(conn);
          }
        })
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
        logger.trace('Get user profile for user', req.userId);
        let sqlStatement = `Select * FROM \`user\` WHERE \`id\`=${req.params.userId}`;
        pool.getConnection(function (err, conn) {
            if (err) {
              logger.error(err.code, err.syscall, err.address, err.port);
              next({
                code: 500,
                message: err.code
              });
            }
            if (conn) {
              conn.query(sqlStatement, [req.userId], (err, results, fields) => {
                if (err) {
                  logger.error(err.message);
                  next({
                    status: 409,
                    message: err.message
                  });
                }
                if (results == '') {
                    res.status(404).json({
                        status: 404,
                        message: `User with id ${req.params.userId} not found`,
                        data:[]
                    })
                }else {
                  logger.trace('Found', results.length, 'results');
                  res.status(200).json({
                    status: 200,
                    message: 'Get User profile',
                    data: results[0]
                  });
                }
              });
              pool.releaseConnection(conn);
            }
        });
    },
    deleteUserWithId:(req, res, next) => {
        logger.info(`User with token ${req.query.token} called delete userdata for: ${req.params.userId}`)
        let sqlStatement = `DELETE FROM \`user\` WHERE \`id\`=${req.params.userId}`;
        logger.debug(sqlStatement)
        pool.getConnection(function (err, conn) {
            if (err) {
              logger.error(err.code, err.syscall, err.address, err.port);
              next({
                code: 500,
                message: err.code
              });
            }
            if (conn) {
              conn.query(sqlStatement, [req.userId], (err, results, fields) => {
                if (err) {
                  logger.error(err.message);
                  next({
                    status: 409,
                    message: err.message
                  });
                } else if (results.affectedRows > 0) {
                  logger.trace(`User with id ${req.params.userId} is deleted`);
                  res.status(200).json({
                    status: 200,
                    message: `User with id ${req.params.userId} is deleted`,
                    data: {}
                  });
                } else {
                    res.status(404).json({
                        status: 404,
                        message: `User with id ${req.params.userId} not found`,
                        data:[]
                    })
                }
              });
              pool.releaseConnection(conn);
            }
        });
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
    updateUser:(req, res, next) => {
        const userId = req.params.userId;
            logger.info(`User with id ${req.params.userId} wants to update userdata`)
            let sqlStatement = `Select * FROM \`user\` WHERE \`id\`=${req.params.userId}'`;
            pool.getConnection(function (err, conn) {
                if (err) {
                  logger.error(err.code, err.syscall, err.address, err.port);
                  next({
                    code: 500,
                    message: err.code
                  });
                }
                if (conn) {
                  conn.query(sqlStatement, [req.userId], (err, results, fields) => {
                    if (err) {
                        logger.error(`MySQL error: ${err}`)
                        next({
                            status: 409,
                            message: err.message
                        });
                    } else if (results.length != 0) {
                        let user = results[0]
                        let sqlStatement = `UPDATE \`user\` SET`;
                        for (let [key, value] of Object.entries((({ emailAdress, ...o }) => o)(req.query))) {
                            if (user[key] != undefined) {
                                logger.debug(`Changing ${key} for #${userId} from ${user[key]} to ${value}`)
                                user[key] = value;
                                if (key != 'isActive') {
                                    value = `'${value}'`
                                }
                                if (!sqlStatement.endsWith("SET")) {
                                    sqlStatement += `, \`${key}\` = ${value}`;
                                } else {
                                    sqlStatement += ` \`${key}\` = ${value}`;
                                }
                            } else {
                                logger.warn(`Key ${key} is not applicable to User`)
                            }
                        }
                        sqlStatement += ` WHERE \`id\`=${req.params.userId} AND \`emailAdress\`='${req.query.emailAdress}'`;
                        logger.debug(sqlStatement)
                        conn.query(sqlStatement, function (err, results, fields) {
                            if (err) {
                                logger.error(err.message);
                                next({
                                    status: 409,
                                    message: err.message
                                        });
                            } else {
                                res.status(200).json({
                                    status: 200,
                                    message: `User with Id #${userId} is updated`,
                                    data: user
                                });
                            }
                        }); 
                    } else {
                        res.status(404).json({
                            status: 404,
                            message: `User with id ${req.params.userId} not found`,
                            data:[]
                        })
                    }
                  });
                  pool.releaseConnection(conn);
                }
            });

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