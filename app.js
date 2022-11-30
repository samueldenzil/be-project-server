const http = require("http");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const express = require("express");

const app = express();
const httpServer = http.createServer(app);

app.get("/", express.static(path.join(__dirname, "./public")));

const multer = require("multer");

const handleError = (err, res) => {
  res.status(500).contentType("text/plain").end("Oops! Something went wrong!");
};

const upload = multer({
  dest: `${__dirname}/uploads`,
});

app.post(
  "/upload",
  upload.single("image" /* name attribute of <file> element in your form */),
  (req, res) => {
    console.log("inside upload");
    const tempPath = req.file.path;
    console.log(req.file);
    const targetPath = path.join(__dirname, "./uploads/image.png");

    if (path.extname(req.file.originalname).toLowerCase() === ".png") {
      fs.rename(tempPath, targetPath, (err) => {
        if (err) return handleError(err, res);
        exec(`sh ${__dirname}/main.sh`, (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
          // res.sendFile(__dirname + "/Target/floorplan.blend");
        });
        res.status(200).contentType("text/plain").end("successful");
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

app.get("/hello", (req, res) => {
  console.log("hello world inside /hello");
  res.status(200);
});

app.get("/", (req, res) => res.download(`${__dirname}/Target/floorplan.gltf`));

app.get("/model", (req, res) => {
  console.log("inside /model");
  var file = fs.createReadStream(`${__dirname}/Target/floorplan.gltf`);
  var stat = fs.statSync(`${__dirname}/Target/floorplan.gltf`);
  res.setHeader("Content-Length", stat.size);
  // res.setHeader('Content-Type', '')
  res.setHeader("Content-Disposition", "attachment; filename=floorplan.gltf");
  file.pipe(res);
});

const PORT = process.env.PORT || 4001;

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
