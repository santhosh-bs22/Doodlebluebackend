const express = require("express");
const dotenv = require("dotenv");
const connection = require("./src/config/dbconfig.js");
const user = require("./src/routes/user.route.js")
// const cookieParser = require("cookie-parser")

dotenv.config();


const app = express();
app.use(express.json());
// app.use(cookieParser());

app.use("/api/v1/user", user)

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Browser is running",
  });
});

const port = process.env.PORT || 5000;

connection()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(
      "Failed to start server due to DB cnnection error : ",
      error.message,
    );
    process.exit(1);
  });