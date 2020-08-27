const router = require('express').Router()

const HomeController = require('../controllers/Home')

router.get('/', HomeController.Home)

// get user home
/*
check if it my page or other page */

// delete user info







module.exports = router