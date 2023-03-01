module.exports = (app) => {
  const states = require("../controllers/states.controller");

  var router = require("express").Router();

  // Get all States by pattern
  router.get("/", states.findAll);

  // // Retrieve all data based on name of states
  router.get("/name", states.findStatesData);

  app.use("/api/states", router);
};
