const router = require('express').Router()

const isAuth = require('../middleware/isAuth')
const commentController = require('../controllers/comment')

router.post('/comment/:postId', isAuth, commentController.createComment)

router.get('/comment/:commentId', commentController.getOneComment)

router.get('/comments/:postId', commentController.getAllComment)

router.put('/comment/:commentId', isAuth, commentController.editeComment)

router.delete('/comment/:commentId', isAuth, commentController.deleteComment)

module.exports = router