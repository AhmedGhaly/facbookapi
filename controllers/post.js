const path = require('path')
const fs = require('fs')

const User = require('../models/user')
const Post = require('../models/post')



// create post
exports.createPost = (req, res, next) => {
    const {content} = req.body
    const {userId} = req
    let thePost, imageUrl
    if(!req.file)
        imageUrl = null
    else
        imageUrl = req.file.path
    const newPost = new Post({
        content,
        imageUrl,
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

// edite post
exports.editePost = (req, res, next) => {
   const {userId} = req
   const {postId} = req.params
   const {content} = req.body
   User.findById(userId).then(user => {
       if(!user) {
            const error = new Error('invalid id')
            error.statusCode = process.env.NOT_FOUND
            throw error
       }
        if(!user.posts.find(e => e == postId)) {
            const error = new Error('you\' not allow to do that')
            error.statusCode = process.env.NOT_ALLLOW
            throw error
        }
        return Post.findById(postId)
   }).then(post => {
        if(!post) {
            const error = new Error('invalid id')
            error.statusCode = process.env.NOT_FOUND
            throw error
        }
        post.content = content
        if(req.file) {
            if(post.imageUrl != null)
                clearImage(post.imageUrl)
            post.imageUrl = req.file.path
        }
        return post.save()
   }).then(post => {
       res.status(200).json({
           message: 'done',
           post
       })
   }).catch(err => {
       console.log(err);
   })
}

// delete post
exports.deletePost = (req, res, next) => {
    const {postId} = req.params
    const {userId} = req
    User.findById(userId).then(user => {
        if(!user) {
            const error = new Error('invalid id')
            error.statusCode = process.env.NOT_FOUND
            throw error
        }
        if(!user.posts.find(e => e == postId)) {
            const error = new Error('you\' not allow to do that')
            error.statusCode = process.env.NOT_ALLLOW
            throw error
        }
        user.posts.splice(user.posts.indexOf(postId), 1)
        return user.save()
    }).then(user => {
        return Post.findByIdAndDelete(postId)
    }).then(post => {
        console.log(post)
        if(post.imageUrl != null){
            clearImage(post.imageUrl)
        }
        res.status(200).json('done')
    }).catch(err => {
        console.log(err);
    })
}

// clear the image url 
const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};