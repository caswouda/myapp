let database = {
    users: []
}
let id = 0

let controller = {
    addUser:(req, res) => {
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
    },
    getAllUsers:(req, res) => {
        res.status(200).json(
            {
                status: 200,
                message: 'User info-endpoint',
                data: database.users
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