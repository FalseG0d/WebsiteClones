//Express
const express = require('express')
const router = express.Router()

//Libraries
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

//Middleware
const requireLogin = require("../middleware/requireLogin")

//Models
const User = mongoose.model("User")

//Keys
const { JWT_SECRET } = require('../keys')

//Routes
router.get('/protected', requireLogin, (req, res) => {
    res.send("Hello World")
})

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body

    if (!email || !name || !password) {
        return res.status(422).json({ error: "Some Fields are Empty" })
    }

    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "Email already in use" })
            }

            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email: email,
                        name: name,
                        password: hashedpassword
                    })

                    user.save()
                        .then(user => {
                            res.json({
                                    message: "User Saved"
                                })
                                .catch(err => {
                                    console.log(err)
                                })
                        })
                })
        }).catch(err => {
            console.log(err)
        })
})

router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "Please Enter Email And Passowrd" })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid Email And Passowrd" })
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        res.json({ token })
                    } else {
                        return res.status(422).json({ error: "Invalid Email And Password" })
                    }
                })
        })
        .catch(err => {
            console.log(err)
        })
})

//Export Router
module.exports = router