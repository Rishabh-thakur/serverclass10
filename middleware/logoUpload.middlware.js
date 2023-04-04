const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination : function(req,file,cb){
      cb(null,"./uploads/logos");
    },
    filename : function(req,file,cb){
        cb(null,Date.now()+"-"+file.originalname);
    }
});

const fileFilter = (req,file,cb) => {
    const validExts = [".png",".jpg",".jpeg"];
    
    if(!validExts.includes(path.extname(file.originalname))){
        cb(null,false);
    }

    const fileSize = parseInt(req.headers["content-length"]);
    if(fileSize > 1048576){
        cb(null,false);
    }
    cb(null,true);
}

let upload = multer({
    storage : storage,
    fileFilter : fileFilter
})


 module.exports = upload.single("logo");