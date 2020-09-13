//Express
const express = require('express')
const router = express.Router()

//Libraries
const mongoose = require("mongoose")

//Models
const Post = mongoose.model("Post")

//Middleware
const requireLogin = require('../middleware/requireLogin')

//Routes

router.get('/myPosts', requireLogin, (req, res) => {
    Post.find({ postedBy: req.user })
        .populate("postedBy", "_id name")
        .then(mypost => {
            res.json({ mypost })
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/allPosts', (req, res) => {
    Post.find()
        .populate("postedBy", "_id name")
        .then(post => {
            res.json({ post })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/createPost', requireLogin, (req, res) => {
    const { title, body } = req.body

    if (!title || !body) {
        return res.status(422).json({ error: "Some Fields are Empty" })
    }

    //Hide Password Starts
    user = req.user
    user.password = undefined
        //Hide Password Ends

    const post = new Post({
        title,
        body,
        postedBy: user
    })
    post.save().then(result => {
        res.json({ post: result })
    }).catch(err => {
        console.log(err)
    })
})

//Export Router
module.exports = router