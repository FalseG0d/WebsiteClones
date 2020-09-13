const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        console.log(err)
        return res.status(401).json({ error: "User Not Authorized" })
    }

    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            console.log(err)
            return res.status(401).json({ error: "Invalid Token" })
        }

        const { _id } = payload
        User.findById(_id).then(userdata => {
            req.user = userdata
            next()
        })
    })

}