const express = require('express');
const {AuthAdminRoute} = require('./routes/Admin/index');
const {StudentRouteByAdmin} = require('./routes/Admin/index');
const {ParentRouteByAdmin} = require('./routes/Admin/index');
const {AuthStudentRoute} = require('./routes/User/index');
const {StudentRoute} = require('./routes/User/index')
const Admin = require('./models/Admin/admin'); // Used for add default admin data which is used just one time
const { sequelize } = require('./config/Database');

const app = express();

//TO access data which is come from body part
app.use(express.json());

//Routes which is used in project
app.use('/api/auth/admin', AuthAdminRoute);
app.use('/api/auth/student', AuthStudentRoute);
app.use('/api/parentByAdmin',ParentRouteByAdmin)
app.use('/api/studentByAdmin', StudentRouteByAdmin);
app.use('/api/student' , StudentRoute)


//Set admin defaut data and check connection details
const startServer = async () => {
  try {
    await sequelize.sync({ force: false });
    // await Admin.create({
    //   email: 'admin123@gmail.com',
    //   password: 'admin@123',
    // });
    // console.log('Admin created successfully');
    app.listen(process.env.PORT, () => {
      console.log('Server running');
    });
  } catch (error) {
    console.log('Error in connection in sequelize connection', error);
  }
};
startServer();
