const express = require("express");
const path = require("path");
const multer = require("multer");
const MethodOverride = require("method-override");
const { exec } = require("child_process");
// const { fileURLToPath } = require("url");
// const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(MethodOverride("_method"));

// Create storage engine
const storage = multer.diskStorage({
  destination: `${__dirname}/uploads`,
  filename: (req, file, cb) => {
    return cb(
      null,
      // `${file.fieldname}${path.extname(file.originalname)}`
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

// @route POST /upload
// @desc Uploads image to the server
app.post("/upload", upload.single("image"), (req, res) => {
  console.log("inside /uploadImage");
  let idx1 = req.file.filename.lastIndexOf("_");
  let idx2 = req.file.filename.lastIndexOf(".");
  let modelFilename =
    "floorplan" + req.file.filename.substring(idx1, idx2) + ".glb";
  exec(
    `sh ${__dirname}/main.sh ${req.file.filename} ${modelFilename}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        res.status(401).json({ err: error });
        return;
      }

      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      res.json({ msg: "Model Created", filename: req.file.filename });
    }
  );
});

// @route GET /files/:filename
// @desc Display a file
app.get("/files/:filename", (req, res) => {
  // console.log(req.params.filename);
  res.sendFile(`${__dirname}/Target/${req.params.filename}`);
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
