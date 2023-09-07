import cors from "cors";
import express from "express";
import http from "http";
import multer from "multer";
import path from "path";
import { Server } from "socket.io";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("ping", (msg) => {
    io.emit("capture", msg);
  });
});

app.post("/upload", upload.single("files"), function (req, res, next) {
  res.send("ok");
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
