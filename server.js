const express = require("express");
const app = express();

const db = require("./app/models");
db.sequelize.sync();

// Base route for checking api is running or not
app.get("/", (req, res) => {
  res.json({ message: "Base API running" });
});

require("./app/routes/states.routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
