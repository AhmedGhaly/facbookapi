const User = require("../models/user")

exports.Home = (req, res, next) => {
    res.json('that is good')
}


exports.getProfile = (req, res, next) => {
    const {userId} = req
    User.findById(userId).then(user => {
        if(!user) {
            const error = new Error('invalid id')
            error.statusCode = process.env.NOT_FOUND
            throw error
        }
        res.status(200).json({
            message: 'done',
            user
        })
    }).catch(err => {
        console.log(err);
    })
}


exports.getUserInfo = (req, res, next) => {
    const {userId} = req.params
    User.findById(userId).then(user => {
        if(!user) {
            const error = new Error('invalid id')
            error.statusCode = process.env.NOT_FOUND
            throw error
        }
        res.status(200).json({
            message: 'done',
            user
        })
    }).catch(err => {
        console.log(err);
    })
}

exports.blockUser = (req, res, next) => {
    const {blockUser} = req.params
    const {userId} = req

    User.findById(userId).then(user => {
        if(!user) {
            const error = new Error('invalid id')
            error.statusCode = process.env.NOT_FOUND
            throw error
        }
        if(user.blockList.find(e => e != blockUser)) {
            user.blockList.push(blockUser)
        }
        if(user.friends.find(e => e == blockUser)) {
            user.friends.splice(user.friends.indexOf(blockUser), 1)
        }
        return user.save()
    }).then(user => {
        return User.findById(blockUser)
    }).then(user => {
        console.log(blockUser)
        if(user.friends.find(e => e == userId)) {
            user.friends.splice(user.friends.indexOf(userId), 1)
        }
        return user.save()
    }).then(user => {
        res.status(200).json('done')
    }).catch(err => {
        console.log(err);
    })

}


exports.postImage = (req, res, next) => {
    console.log(req.file.path)
}