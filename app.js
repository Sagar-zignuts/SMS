const express = require("express")
const AuthRoute = require('./routes/AuthRoute')
const StudentRoute = require('./routes/StudentRoute')
const ParentRoute = require('./routes/ParentRoute')
const Admin = require('./models/admin')


const {sequelize} = require('./config/Database')

const app = express()

app.use(express.json())

app.use('/api/auth' , AuthRoute)
app.use('/api/student' , StudentRoute)
app.use('/api/parent' , ParentRoute)
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