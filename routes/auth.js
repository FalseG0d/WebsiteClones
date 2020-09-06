const express = require('express')
const router = express.Router()

const mongoose = require("mongoose")

const User = mongoose.model("User")

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

            const user = new User({
                email: email,
                name: name,
                password: password
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
        }).catch(err => {
            console.log(err)
        })
})

module.exports = router