const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGO_URL,{
    useUnifiedTopology : true,
    useNewUrlParser : true
  })
  .then(() => {
    console.log("db connect successfully");
  })
  .catch((error) => {
    console.log("error ",error.message);
  });

require("./routes/user.route")(app);
require("./routes/parentCat.route")(app);
require("./routes/childCategory.route")(app);
require("./routes/resource.route")(app);

const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Server running successfully");
});

app.listen(port, (req, res) => {
  console.log(`server connected successfully`);
});
