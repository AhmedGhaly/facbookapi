const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const auth = req.get('Authorization')
    if(!auth) {
        const err = new Error("not authenticate")
        err.statusCode = process.env.CODE_AUTH
        throw err
    }
    let decodeToken
    try {
        decodeToken = jwt.verify(auth, process.env.SECRETE_STRING)
    } catch(err) {
        err.statusCode = process.env.CODE_AUTH
        throw err
    }
    req.userId = decodeToken.id
    next()
}