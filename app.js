const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();

const storage = multer.diskStorage({
  destination: "C://Users//Denzil//Desktop//upload//images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
  //   fileFilter: 'png'
});

app.post("/upload", upload.single("profile"), (req, res) => {
  console.log(req.file);
});

app.get("/img", (req, res) => {
  res.sendFile("<IMAGE_LOCATION>");
});

app.listen(4000, () => {
  console.log("server running on port ", 4000);
});
