const router = require('express').Router()

const HomeController = require('../controllers/Home')

router.get('/', HomeController.Home)







module.exports = router