const experss = require('express')
const authMiddleware = require('../midllewares/auth-midlleware')

const router = experss.Router()

// router.get('/welcome', (req, res) => { // if we want that it only access if the user login then we can use handlers
router.get('/welcome', authMiddleware, (req, res) => { 
    const {username, userId, role} = req.userInfo;
    res.json({
        message : 'Welcome To Home Page',
        user : {
            _id : userId,
            username,
            role
        } 
    })
})

module.exports = router