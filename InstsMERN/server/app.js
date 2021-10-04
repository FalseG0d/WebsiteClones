// Import Libraries

const express = require("express")
const mongoose = require("mongoose")

// App Declaration
const app = express()

// Import Models

require("./models/user")

// Routes

app.use(express.json())
app.use(require("./routes/auth"))


// Import Keys

const {MONGOURI} = require("./keys")
const PORT = 5000

// Database Connection

mongoose.connect(MONGOURI)

mongoose.connection.on("connected", ()=>{
    console.log("Connected To MongoDB")
})

mongoose.connection.on("error", (error)=>{
    console.log("Error Connecting To DB : ", error)
})

// App Backend

app.listen(PORT, ()=>{
    console.log("Server is Running on Port ", PORT)
})