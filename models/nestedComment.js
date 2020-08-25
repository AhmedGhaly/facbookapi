const mongoose = require('mongoose')

const nestedCommentSchema = mongoose.Schema({
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'nestedComment'
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    content: String

})

module.exports = mongoose.model('nestedComment', nestedCommentSchema)