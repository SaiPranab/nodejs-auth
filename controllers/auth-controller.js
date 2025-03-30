const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// register controller
const registerUser = async (req, res) => {
    try {
        // extract user infromation from our request body
        const {username, email, password, role} = req.body

        // check if the user is already exists in our database
        const checkExistingUser = await  User.findOne({$or : [{username}, {email}]})
        
        if(checkExistingUser) {
            return res.status(400).json({
                success : false,
                message : "User is alreadu exists wither with same username or same email. Please try with a different email or username"
            })
        }

        //hash user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // create a new user & save in the db
        const newlyCreatedUser = new User({
            username, 
            email,
            password : hashedPassword,
            role : role || 'user'
        })

        await newlyCreatedUser.save()

        if(newlyCreatedUser){
            res.status(201).json({
                success : true,
                message : 'User registered successfully'
            })
        } else {
            res.status(400).json({
                success : false,
                message : 'Unable to register User. Please try again !!!!'
            })
            
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Some error occured! Please try again"
        })
    }  
}

//login controller
const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body;

        // find if the current user is already registersted or not
        const user = await User.findOne({username})

        if(!user) {
            return res.status(400).json({
                success : false,
                message : "User doesn't exist"
            })
        }

        // if the password is correct or not
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if(!isPasswordMatch) {
            return res.status(400).json({
                success : false,
                message : "Invalid credentials"
            })
        }

        // create user token
        const accessToken  = jwt.sign({
            userId : user._id,
            username : user.username,
            role : user.role
        }, 
        process.env.JWT_SECRET_KEY, 
        {
            expiresIn: '15m'
        }
    )

    res.status(200).json({
        success : true,
        message : "Logged in sucessfull",
        accessToken
    })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Some error occured! Please try again"
        })
    }  
}

// change password
const changePassword = async(req, res) => {
    try {
        const userId = req.userInfo.userId;

        // extract old and new password
        const {oldPassword, newPassword} = req.body;

        // find the current logged in user
        const user = await User.findById(userId)

        if(!user) {
            return res.status(400).json({
                success : false,
                message : "User Not Found"
            })
        }

        // check if the old password is correct
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)

        if(!isPasswordMatch) {
            return res.status(400).json({
                success : false,
                message : "Old password is not correct!!! Please try again"
            })
        }

        // hash the new password here
        const salt = await bcrypt.genSalt(10)
        const newHashedPassword = await bcrypt.hash(newPassword, salt)

        // update the userpassword
        user.password = newHashedPassword
        await user.save()

        return res.status(200).json({
            success : true,
            message : "Password changed successfully"
        })
    } catch(error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Some error occured! Please try again"
        })
    }
}

module.exports = {registerUser, loginUser, changePassword}