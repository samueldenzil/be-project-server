const http = require("http");
const path = require("path");
const fs = require("fs");

const express = require("express");

const app = express();
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// put the HTML file containing your form in a directory named "public" (relative to where this script is located)
app.get("/", express.static(path.join(__dirname, "./public")));

const multer = require("multer");

const storage = multer.diskStorage({
  destination: `${__dirname}/uploads`,
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

app.post(
  "/upload",
  upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "./uploads/image.png");

    if (path.extname(req.file.originalname).toLowerCase() === ".png") {
      fs.rename(tempPath, targetPath, (err) => {
        if (err) return handleError(err, res);

        res.status(200).contentType("text/plain").end("File uploaded!");
      });
    } else {
      fs.unlink(tempPath, (err) => {
        if (err) return handleError(err, res);

        res
          .status(403)
          .contentType("text/plain")
          .end("Only .png files are allowed!");
      });
    }
  }
);

// app.post("/upload", upload.single("profile"), (req, res) => {});

// app.get("/img", (req, res) => {
//   execFile(
//     "python3",
//     [
//       "/home/denzil/Desktop/FloorplanToBlender3d/main.py",
//       "/home/denzil/Downloads/example6.png",
//     ],
//     (error, stdout, stderr) => {
//       if (error) {
//         console.error(`exec error: ${error}`);
//         return;
//       }
//       console.log(`stdout: ${stdout}`);
//       console.error(`stderr: ${stderr}`);
//     }
//   );
//   // res.sendFile("<IMAGE_LOCATION>");
// });

app.get("/hello", (req, res) => {
  res.json({ message: `${__dirname}` });
});

app.get("/img", (req, res) => {
  exec(`sh ${__dirname}/main.sh`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.sendFile(__dirname + "/Target/floorplan.blend");
  });
  // res.sendFile(__dirname + "/Target/floorplan.blend");
});

httpServer.listen(4000, () => {
  console.log(`Server is listening on port ${4000}`);
});
