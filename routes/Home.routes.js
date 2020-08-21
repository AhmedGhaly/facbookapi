const router = require('express').Router()

router.get('/', (req, res, next) => {
    res.send('there is no error')
})


module.exports = router