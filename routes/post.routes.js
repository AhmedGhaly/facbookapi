const router = require('express').Router()

const postController = require('../controllers/post')
const isAuth = require('../middleware/isAuth')


router.post('/post', isAuth, postController.createPost)

router.get('/post/:postId', isAuth, postController.getPost)

router.get('/posts', isAuth, postController.getAllPosts)

module.exports = router