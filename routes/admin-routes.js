const express = require('express')
const authMiddleware = require('../midllewares/auth-midlleware')
const isAdminUser = require('../midllewares/admin-middleware')
const router = express.Router()

router.get('/welcome', authMiddleware, isAdminUser, (req, res) => {
    res.json({
        message : 'Welcome to admin page'
    })
})

module.exports = router