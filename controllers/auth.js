const User = require('../models/user')
const bcyrpt = require('bcrypt')
const jwt = require('jsonwebtoken')


exports.signUp = (req, res, next) => {
    const {email, password} = req.body

    // check if this email is exists or no
    User.findOne({email: email}).then(user => {
        if(user) {
            const error = new Error('this emial is already exist!')
            error.statusCode = process.env.CODE_AUTH
            throw error
        }

        // hash the password
        return bcyrpt.hash(password, 12)
        
    }).then(hashedPass => {
        const newUser = new User({
            email,
            password: hashedPass
        })
        return newUser.save()
    }).then(user => {
        res.status(201).json({
            message: 'done',
            userData: user
        })
    }).catch(err => {
        console.log(err)
    })
}

exports.login = (req, res, next) => {
    const {email, password} = req.body
    let loggedUser
    // check if that email is in the database
    User.findOne({email: email}).then(user => {
        if(!user) {
            const error = new Error('invalid email')
            error.statusCode = process.env.CODE_AUTH
            throw error
        }
        loggedUser = user
        return bcyrpt.compare(password, user.password)
    }).then(isMathced => {
        if(!isMathced) {
            const error = new Error('incorrect password')
            error.statusCode = process.env.CODE_AUTH
            throw error
        }
        const token = jwt.sign({id: loggedUser._id}, process.env.SECRETE_STRING)
        res.status(201).json({
            message: 'done',
            token: token
        })
    }).catch(err => {
        console.log(err)
    })
}