const express = require("express")
const {client} = require('./config/PgConfig')
const {createStudentTable} = require('./models/students')
const { createParentTable } = require("./models/parents")
const { createAdminTable } = require("./models/admin")

const app = express()

app.use(express.json())

const DBInit = async()=>{
    await createStudentTable()
    await createParentTable()
    await createAdminTable()
}

DBInit()

app.get("/" , (req,res)=>{
    console.log("Helo");
})

app.listen(3000 , ()=>{
    console.log("Server running");
})