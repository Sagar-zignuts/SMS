const express = require("express")
const AuthAdminRoute = require('./routes/Admin/AuthRoute')
const AuthStudentRoute = require('./routes/User/AuthRoute')
const StudentRoute = require('./routes/User/StudentRoute')
const ParentRoute = require('./routes/Admin/ParentRoute')
// const Admin = require('./models/admin')// Used for add default admin data which is used just one time 
const {sequelize} = require('./config/Database')

const app = express()

//TO access data which is come from body part
app.use(express.json())

//Routes which is used in project
app.use('/api/auth/admin' , AuthAdminRoute)
app.use('/api/auth/student' , AuthStudentRoute)
app.use('/api/student' , StudentRoute)
app.use('/api/parent' , ParentRoute)


//Set admin defaut data and check connection details
const startServer =async ()=>{
    try {
        await sequelize.sync({force : false})
        app.listen(process.env.PORT , ()=>{
            console.log("Server running");
        })
    } catch (error) {
        console.log("Error in connection in sequelize connection",error);
    }
}
startServer();