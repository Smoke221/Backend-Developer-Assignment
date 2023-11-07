const express = require("express");
const { connection } = require("./configs/db");
const { router } = require("./routes/domainRouter");
const cors = require("cors");

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(`
          <h1>Welcome to the Website word counter application.</h1>
    `);
});

app.use("/info", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (err) {
    console.log(err.message);
  }
  console.log(`Server is running at port ${PORT}`);
});
