const router = require('express').Router()

const postController = require('../controllers/post')
const isAuth = require('../middleware/isAuth')


router.post('/post', isAuth, postController.createPost)

router.put('/post/:postId', isAuth, postController.editePost)

router.get('/post/:postId', postController.getPost)

router.get('/posts', isAuth, postController.getAllPosts)

router.delete('/post/:postId', isAuth, postController.deletePost)


module.exports = router