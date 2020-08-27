const router = require('express').Router()

const friendController = require('../controllers/friend')
const isAuth = require('../middleware/isAuth')

router.post('/friend/:friendId', isAuth, friendController.addFriend)

router.get('/friends', isAuth, friendController.getFriends)

router.post('/unfriend/:friendId', isAuth, friendController.unfriend)

module.exports = router