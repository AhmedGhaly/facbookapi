const User = require('../models/user')
const user = require('../models/user')


// add new user
exports.addFriend = (req, res, next) => {
    const {friendId} = req.params
    const {userId} = req
    let theUser, secondUser
    User.findById(userId).then(user => {
        if(!user) {
            const error = new Error('invalid id')
            error.statusCode = process.env.NOT_FOUND
            throw error
        }
        theUser = user
        return User.findById(friendId)
    }).then(user => {
        if(!user) {
            const error = new Error('invalid id')
            error.statusCode = process.env.NOT_FOUND
            throw error
        }
        secondUser = user
        theUser.friends.push(friendId)
        return theUser.save()
    }).then(user => {
        secondUser.friends.push(userId)
        return secondUser.save()

    }).then(user => {
        res.status(201).json({
            message: 'done', 
            user
        })
    }).catch(err => {
        console.log(err);
    })

}

exports.getFriends = (req, res, next) => {
    const {userId} = req
    User.findById(userId).populate('friends').exec().then(user => {
        if(!user) {
            const error = new Error('invalid id')
            error.statusCode = process.env.NOT_FOUND
            throw error
        }
        res.status(200).json({
            messasge: 'done',
            friends: user.friends
        })
    }).catch(err => {
        console.log(err);
    })
}

// unfriend method
exports.unfriend = (req, res, next) => {
    const {userId} = req
    const {friendId} = req.params
    User.findById(userId).then(user => {
        if(!user) {
            const error = new Error('invalid id')
            error.statusCode = process.env.NOT_FOUND
            throw error
        }
        if(!user.friends.find(e => e == friendId)){
            const error = new Error('you\' are not allow to do this')
            error.statusCode = process.env.NOT_ALLLOW
            throw error
        }
        user.friends.splice(user.friends.indexOf(friendId), 1)
        return user.save()
    }).then(user => {
        return User.findById(friendId)
    }).then(user => {
        if(!user) {
            const error = new Error('invalid id')
            error.statusCode = process.env.NOT_FOUND
            throw error
        }
        user.friends.splice(user.friends.indexOf(friendId), 1)
        return user.save()
    }).then(user => {
        res.status(200).json('dine')
    }).catch(err => {
        console.log(err);
    })

}