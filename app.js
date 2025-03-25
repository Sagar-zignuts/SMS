const express = require("express")
const {client} = require('./config/PgConfig')
const {createStudentTable} = require('./models/students')
const { createParentTable } = require("./models/parents")
const { createAdminTable } = require("./models/admin")
const {IsAdmin} = require('./IsAdmin')
const AuthRoute = require('./routes/AuthRoute')
const StudentRoute = require('./routes/StudentRoute')

const app = express()

app.use(express.json())

const DBInit = async()=>{
    await createStudentTable()
    await createParentTable()
    await createAdminTable()

    await IsAdmin()
}

DBInit()

app.use('/api/auth' , AuthRoute)
app.use('/api/student' , StudentRoute)

app.listen(4000 , ()=>{
    console.log("Server running");
})