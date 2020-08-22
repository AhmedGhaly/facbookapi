
const User = require('../models/user')
const Post = require('../models/post')



// create post
exports.createPost = (req, res, next) => {
    const {content} = req.body
    const {userId} = req
    let thePost
    const newPost = new Post({
        content,
        creator: userId
    })
    newPost.save().then(post => {
        thePost = post
        return User.findById(userId)
    }).then(user => {
        user.posts.push(thePost)
        return user.save()
    }).then(user => {
        res.status(201).json({
            message: 'done',
            post: thePost,
            user: user
        })

    }).catch(err => {
        console.log(err)
    })
}

// get post by id
exports.getPost = (req, res, next) => {
    const postId = req.params.postId
    Post.findById(postId).then(post => {
        if(!post) {
            const error = new Error('invalid id')
            error.statusCode = process.env.NOT_FOUND
            throw error
        }
        res.status(200).json({
            message: 'done',
            post: post
        })
    }).catch(err => {
        console.log(err);
    })
}

// get all posts of a user
exports.getAllPosts = (req, res, next) => {
    const {userId} = req
    User.findById(userId).then(user => {
        if(!user) {
            const error = new Error('invalid id')
            error.statusCode = process.env.NOT_FOUND
            throw error
        }
        return Post.find({creator: userId}).then(posts => {
            res.status(200).json({
                message: 'done',
                posts: posts
            })
        })
    })
}