const jwt = require('jsonwebtoken')
const authMiddleware = (req, res, next) => {
    console.log('auth midlleware is called');

    // =========================
    const authHeader = req.headers['authorization']
    console.log('token is ', authHeader); // bearer - token
    const token = authHeader && authHeader.split(" ")[1]

    // if token is not there
    if(!token) {
        return res.status(401).json({
            success : false,
            message : 'Access denied, No token provided, please login to continue '
        })
    }

    // if token is there, then decode the the token
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        console.log('decode token', decodedToken);

        req.userInfo = decodedToken
        next();

    } catch (error) {
        return res.status(500).json({
            success : false,
            message : 'token cannot be decoded '
        })
    }
}

module.exports = authMiddleware