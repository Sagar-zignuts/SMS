const nodemailer = require('nodemailer')
require('dotenv').config()

const transport = nodemailer.createTransport({
    service : 'gmail',
    secure:true,
    host: "smtp.example.com",
    port : 587,
    auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASSWORD
    }
})

const sendMail = async(to)=>{
    
    try {
        await transport.sendMail({
            from:process.env.SENDER_MAIL,
            to:to,
            subject:'Welcome in portal',
            text:`Hello ,\n\nWelcome to portal! Your account has been successfully created.`,
        })
        console.log("Send successfully");
        
    } catch (error) {
        console.log(`Error is there : ${error}`);
    }
}

module.exports = sendMail;