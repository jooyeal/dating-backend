const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const notificationRoute = require("./routes/notification");
const chatRoute = require("./routes/chat");
const app = express();

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(function (req, res, next) {
  res.header("Content-Type", "application/json;charset=UTF-8");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/notification", notificationRoute);
app.use("/chat", chatRoute);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.listen(5000, () => {
  console.log("listening...");
});
