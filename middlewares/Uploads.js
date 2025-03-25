const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null, path.join(__dirname,'../uploads'))
    },
    filename : (req,file,cb)=>{
        cb(null , file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
})

const filterFile = (req,file ,cb)=>{
    const filetype = /jpeg|jpg|png/;
    const extname = filetype.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetype.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null , true);
    }else{
        cb(new Error('Only Jpg,Jpeg,png files are allowed'))
    }
}

const upload = multer({
    storage : storage,
    limits : {fileSize : 5 * 1024 * 1024},
    fileFilter : filterFile
})

module.exports = upload;