const express = require('express')
const { registerUser, loginUser, changePassword } = require('../controllers/auth-controller')
const authMiddleware = require('../midllewares/auth-midlleware')

const router = express.Router()

// all routes are realted to authentication & authorizaion
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/change-password', authMiddleware ,changePassword)

module.exports = router