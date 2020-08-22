const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    content: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment'
    }]
})

module.exports = mongoose.model('post', postSchema)