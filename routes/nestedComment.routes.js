const router = require('express').Router()

const nestedCommentComtroller = require('../controllers/nestedComment')
const isAuth = require('../middleware/isAuth')

router.post('/comment/:commentId', isAuth, nestedCommentComtroller.createComment)

router.get('/comment/:nestedCommentId', nestedCommentComtroller.getOneComment)

router.get('/nestedComments/:commentId', nestedCommentComtroller.getAllNestedComment)

router.put('/comment/:nestedCommentId', isAuth, nestedCommentComtroller.editeNestedComment)

router.delete('/comment/:nestedCommentId', isAuth, nestedCommentComtroller.deleteNestedComment)

module.exports = router