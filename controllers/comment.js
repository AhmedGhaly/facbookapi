const Comment = require('../models/comment')
const Post = require('../models/post')
const User = require('../models/user')

// create new comment
exports.createComment = (req, res, next) => {
    const {postId} = req.params
    const {userId} = req
    const {comment} = req.body
    let theComment
    const newComment = new Comment({
        creator: userId,
        comment,
        post: postId
    })
    newComment.save().then(comment => {
        theComment = comment
        return Post.findById(postId)
    }).then(post => {
        post.comments.push(theComment._id)
        return post.save()
    }).then(post => {
        res.status(201).json({
            message: 'done',
            post
        })
    }).catch(err => {
        console.log(err)
    })
}

exports.getOneComment = (req, res, next) => {
    const {commentId} = req.params
    Comment.findById(commentId).then(comment => {
        if(!comment){
            const error = new Error('invalid id')
            error.statusCode = process.env.NOT_FOUND
            throw error
        }
        res.status(200).json({
            message: 'done',
            comment
        })
    }).catch(err => {
        console.log(err);
    })
}

// get all comment of a post
exports.getAllComment = (req, res, next) => {
    const {postId} = req.params
    Post.findById(postId).populate('comments').then(post => {
        if(!post) {
            const error = new Error('invalid id')
            error.statusCode = process.env.NOT_FOUND
            throw error
        }
        res.status(200).json({
            message: 'done',
            comments: post.comments
        })
    }).catch(err => {
        console.log(err);
    })
}

// edite comment
exports.editeComment = (req, res, next) => {
    const {commentId} = req.params
    const {comment} = req.body
    const {userId} = req
    Comment.findById(commentId).then(comm => {
        if(!comm) {
            const error = new Error('invalid id')
            error.statusCode = process.env.NOT_FOUND
            throw error
        }
        if(comm.creator != userId) {
            const error = new Error('you\' are not allow to do this')
            error.statusCode = process.env.NOT_ALLLOW
            throw error
        }
        comm.comment = comment
        return comm.save()
    }).then(comment => {
        res.status(200).json({
            message: 'done',
            comment
        })
    })
}

// delete comment
exports.deleteComment = (req, res, next) => {
    const {commentId} = req.params
    const {userId} = req
    Comment.findById(commentId).then(comment => {
        if(!comment) {
            const error = new Error('invalid id')
            error.statusCode = process.env.NOT_FOUND
            throw error  
        }
        if(comment.creator != userId) {
            const error = new Error('you\' are not allow to do this')
            error.statusCode = process.env.NOT_ALLLOW
            throw error
        }
        return Post.findById(comment.post)
    }).then(post => {
        post.comments.splice(post.comments.indexOf(commentId), 1)
        return post.save()
    }).then(post => {
        return Comment.findByIdAndDelete(commentId)
    }).then(comment => {
        res.status(200).json('done')
    })

}