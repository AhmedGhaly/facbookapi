const router = require('express').Router()

const HomeController = require('../controllers/Home')
const isAuth = require('../middleware/isAuth')

router.get('/', HomeController.Home)

router.get('/profile', isAuth, HomeController.getProfile)

router.get('/user/:userId', HomeController.getUserInfo)

router.post('/block/:blockUser', isAuth, HomeController.blockUser)

// block list
// delete user info

module.exports = router