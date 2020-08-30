const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    /*
        username
        name
        picture
    */
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    blockList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
},{
    timestamps: true
})


module.exports = mongoose.model('user', userSchema)
