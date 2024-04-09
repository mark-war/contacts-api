const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userObj = require('../models/userModel')

//@desc Register a User
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req,res) => {
    const {username,email,password} = req.body

    if(!username || !email || !password) {
        res.status(400).json({error: 'All fields are mandatory.'})
    }

    userObj.findOne({email}).then(result => {
        if(result) {
            res.status(400).json({error: 'Email is already registered.'})
        } else {
            bcrypt.hash(password, 10).then(hashedPassword => {
                userObj.create({
                    username, email, password: hashedPassword
                }).then(result => {
                    res.json({_id: result.id, email: result.email})
                }).catch(err => {
                    res.send(err)
                })
            })
        }
    })
})

//@desc User Login
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req,res) => {
    const {email,password} = req.body

    if(!email || !password) {
        res.status(400).json({error: 'All fields are mandatory.'})
        return;
    }

    userObj.findOne({email})
        .then(result => {
            if (!result) {
                res.status(401).json({error: 'Invalid email or password.'});
                return;
            }
            bcrypt.compare(password, result.password)
                .then(cRes => {
                    if (!cRes) {
                        res.status(401).json({error: 'Invalid email or password.'});
                        return;
                    }
                    const accessToken = jwt.sign({
                        user: {
                            username: result.username,
                            email: result.email,
                            id: result.id
                        }
                    }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
                    res.status(200).json({accessToken})
                })
                .catch(err => {
                    res.status(500).send({error: err.message})
                })
        })
        .catch(err => {
            res.status(500).send({error: err.message})
        })
});

//@desc Current User
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req,res) => {
    res.json(req.user)
})

module.exports = {registerUser, loginUser, currentUser}