const express = require("express")
const router = express.Router()

const mongoose = require("mongoose")
const User = mongoose.model("User")

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const requireLogin = require("../middleware/requireLogin")

const {JWT_SECRET} = require("../keys")

router.get('/protected', requireLogin, (req,res)=>{
    res.send("Hello User")
})

router.post('/signup', (req,res)=>{
    const {name,email,password} = req.body

    if(!email || !password || !name){
        return res.status(422).json({
            error:"A Field is Missing"
        })
    }

    console.log(req.body)

    User.findOne({email:email}).then((saveUser)=>{
        if(saveUser){
            return res.status(422).json({erro:"Email already in user"})
        }

        bcrypt.hash(password,12)
        .then(hashedPassword=>{
            const user = new User({
                email,
                password:hashedPassword,
                name
            })
            
            user.save()
            .then(user=>{
                res.json({message:"User Saved Successfully"})
            }).catch(err=>{
                console.log("Error Creating User : ", err)
            })
        })
    })
    .catch(err=>{
        console.log("Error Creating User : ", err)
    })
})

router.post('/signin', (req,res)=>{
    const {email,password} = req.body

    if(!email || !password){
        res.status(422).json({error:"Email or Password Field Missing"})
    }

    User.findOne({email:email})
    .then(saveUser=>{
        if(!saveUser){
            return res.status(422).json({error:"Invalid Email"})
        }

        bcrypt.compare(password, saveUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"Succesfully Logged In"})
                const token = jwt.sign({_id : saveUser._id}, JWT_SECRET)

                res.json({token})
            }else{
                return res.status(422).json({message:"Invalid Password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

module.exports = router