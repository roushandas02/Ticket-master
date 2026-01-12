// import multer from "multer";

// const storage = multer.diskStorage({
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   }
// });

// const upload=multer({ storage });
// export default upload;
//Multer takes image from frontend and stores it in the public folder
import multer from "multer";

//takes a portion of disk storage to keep the files and name it accordingly
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./public")
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

//Multer instance called upload, configured to use your custom storage.
const upload=multer({storage})
export default upload