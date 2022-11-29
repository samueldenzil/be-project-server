const express = require("express");
const multer = require("multer");
const path = require("path");
const { execFile, exec } = require("child_process");

const app = express();

const storage = multer.diskStorage({
  destination: "/home/student/Desktop",
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

// app.get("/img", (req, res) => {
//   execFile(
//     "python3",
//     [
//       "/home/student/Desktop/FloorplanToBlender3d/main.py",
//       "/home/student/Downloads/example6.png",
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

app.get("/img", (req, res) => {
  exec(
    "sh /home/student/Desktop/FloorplanToBlender3d/main.sh",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      res.sendFile(__dirname + "/Target/floorplan.blend");
    }
  );
  // res.sendFile(__dirname + "/Target/floorplan.blend");
});

app.listen(4000, () => {
  console.log("server running on port ", 4000);
});
