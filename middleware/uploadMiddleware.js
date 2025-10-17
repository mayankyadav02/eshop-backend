import multer from "multer";
import path from "path";
import fs from "fs";

// Upload folder create if not exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Storage engine
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir); // save in /uploads
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter (only images)
function fileFilter(req, file, cb) {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
}

const upload = multer({ storage, fileFilter });

export default upload;
