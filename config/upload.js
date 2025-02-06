import multer, { diskStorage } from "multer"; 
import { join } from "path"; 
const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(__dirname, "../public/admin/uploads"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

export default { upload };
