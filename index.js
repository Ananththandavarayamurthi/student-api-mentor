const express = require("express");
const db = require("./db/connect");
const app = express();
const student = require("./routes/student.route");
const mentor = require("./routes/mentor.route");
const cors = require("cors");
require("dotenv").config();
db();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT;
app.get("/", (request, response) => {
    response.send("Welcome to Day41 Task");
  });
 
  app.use("/api/mentor", mentor);
  app.use("/api/student", student);

  app.listen(PORT, () => {
    console.log(`the app is running in the port ${PORT}`);
  });