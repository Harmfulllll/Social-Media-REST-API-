const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const userRoute = require("./Routes/userRoute");
const authRoute = require("./Routes/auth");
const postRoute = require("./Routes/postRoute");

const app = express();
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan("common"));
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database connection successfull"))
  .catch((err) => {
    console.log(err);
  });

app.use("/api/users", userRoute);
app.use("/api", authRoute);
app.use("/api/posts", postRoute);

app.listen(process.env.PORT, () => {
  console.log("Server running");
});
