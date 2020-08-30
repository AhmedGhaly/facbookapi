const Comment = require('../models/comment')
const NestedComment = require('../models/nestedComment')

exports.createComment = (req, res, next) => {
    const {content} = req.body
    const {commentId} = req.params
    const {userId} = req
    let theNestedComment, imageUrl
    if(!req.file)
        imageUrl = null
    else
        imageUrl = req.file.path
    const newNestedComment = new NestedComment({
        content,
        creator: userId,
        imageUrl,
        comment: commentId 
    })
    newNestedComment.save().then(nestedComment => {
        theNestedComment = nestedComment
        return Comment.findById(commentId)
    }).then(comment => {
        comment.nestedComments.push(theNestedComment._id)
        return comment.save()
    }).then(comment => {
        res.status(201).json({
            message: 'done',
            comment
        })
    }).catch(err => {
        console.log(err)
    })

}

exports.getOneComment = (req, res, next) => {
    const {nestedCommentId} = req.params

    NestedComment.findById(nestedCommentId).then(nestedcomment => {
        if(!nestedCommentId) {
            const error = new Error('invlaid id')
            error.statusCode = process.env.NOT_FOUND
            throw error
        }
        res.status(200).json({
            message: 'done',
            nestedcomment
        })
    }).catch(err => {
        console.log(err)
    })
}

// get all nested comment of a comment
exports.getAllNestedComment = (req, res, next) => {
    const {commentId} = req.params
    Comment.findById(commentId).populate('nestedComments').exec().then(comment => {
        if(!comment) {
            const error = new Error('invalid id')
            error.statusCode = process.env.NOT_FOUND
            throw error
        }
        res.status(200).json({
            message: 'done',
            comment
        })
    }).catch(err => {
        console.log(err)
    })
} 

// edite one nested comment
exports.editeNestedComment = (req, res, next) => {
    const {nestedCommentId} = req.params
    const {comment} = req.body
    const {userId} = req
    NestedComment.findById(nestedCommentId).then(nestedComment => {
        if(!nestedComment) {
            const error = new Error('invalid id')
            error.statusCode = process.env.NOT_FOUND
            throw error
        }
        if(nestedComment.creator != userId) {
            const error = new Error('you not allow to do that')
            error.statusCode = process.env.NOT_ALLLOW
            throw error
        }
        nestedComment.content = comment
        if(req.file) {
            if(nestedComment.imageUrl != null)
                clearImage(nestedComment.imageUrl)
            nestedComment.imageUrl = req.file.path
        }
        return nestedComment.save()
    }).then(nestedComment => {
        res.status(201).json({
            message: 'done',
            nestedComment
        })
    }).catch(err => {
        console.log(err)
    })
}

// delete nestedcomment
exports.deleteNestedComment = (req, res, next) => {
    const {nestedCommentId} = req.params
    const {userId} = req
    NestedComment.findById(nestedCommentId).then(nestedComment => {
        if(!nestedComment) {
            const error = new Error('invalid id')
            error.statusCode = process.env.NOT_FOUND
            throw error
        }
        if(nestedComment.creator != userId) {
            const error = new Error('you not allow to do that')
            error.statusCode = process.env.NOT_ALLLOW
            throw error
        }
        return NestedComment.findByIdAndDelete(nestedCommentId)
    }).then(nestedComment => {
        if(nestedComment.imageUrl != null){
            clearImage(nestedComment.imageUrl)
        }
        return Comment.findById(nestedComment.comment)
    }).then(comment => {
        comment.nestedComments.splice(comment.nestedComments.indexOf(nestedCommentId), 1)
        return comment.save()
    }).then(comment => {
        res.status(200).json({
            message: 'done'
        })
    }).catch(err => {
        console.log(err)
    })
}

// clear the image url 
const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};