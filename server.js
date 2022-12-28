require("dotenv").config();

const express = require("express")
const app = express();
const dbConnect = require("./utils/dbconfig").dbConnect;
const cors = require("cors");
const api = require("./routes/api");



dbConnect();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api", api);





app.listen(8000, () => {
  console.log("Server started on port 8000");
})

module.exports = app;