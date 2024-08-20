import multer from "multer";

const storage= multer.diskStorage({
    destination:function (req,file,cb) {
        cb(null,"./backend/temp")
    },
    filename:function (req,file,cb) {
        console.log("00",file);
        
        cb(null,`${file.originalname}-${Date.now()}`)
    }
})

export const upload= multer({storage})