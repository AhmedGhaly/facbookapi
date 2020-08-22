const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    comment: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }
})

module.exports = mongoose.model('comment', commentSchema)