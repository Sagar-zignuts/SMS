const express = require("express")
const {client} = require('./config/PgConfig')
const {createStudentTable} = require('./models/students')
const { createParentTable } = require("./models/parents")
const { createAdminTable } = require("./models/admin")
const {IsAdmin} = require('./IsAdmin')
const AuthRoute = require('./routes/AuthRoute')
const StudentRoute = require('./routes/StudentRoute')
const ParentRoute = require('./routes/ParentRoute')

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
app.use('/api/parent' , ParentRoute)

app.listen(process.env.PORT , ()=>{
    console.log("Server running");
})