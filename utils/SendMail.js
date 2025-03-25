const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    service : 'gmail',
    secure:true,
    host: "smtp.example.com",
    port : 587,
    auth:{
        user:"sagarbh@zignuts.com",
        pass:"ojffaaxwjysgzijc"
    }
})

const sendMail = async(to)=>{
    
    try {
        await transport.sendMail({
            from:"sagarbh@zignuts.com",
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