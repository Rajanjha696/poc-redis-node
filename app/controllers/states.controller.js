const db = require("../models");
const redis = require("redis");
const States = db.tutorials;

const Op = db.Sequelize.Op;

const port_redis = process.env.PORT || 6379;
const redis_client = redis.createClient(port_redis);

//  Get all states from the database based on pattern match
exports.findAll = (req, res) => {
  const state = req.query.state;
  
  var condition = state ? { state: { [Op.iLike]: `%${state}%` } } : null;

  redis_client.get(state, (error, data) => {
    if (data) {
      console.log("=================================================Getting data from Redis Cache directly============================================================");
      res.send(JSON.parse(data));
    } else {
      States.findAll({ where: condition, attributes: ["state"], group: ['state'] })
        .then((data) => {
          //console.log("----------------------------------",data)
          var statesdata = data;
          redis_client.setex(
            state,
            36000,
            JSON.stringify(statesdata),
            (error, reply) => {
              if (error) {
                console.log(error);
              } else {
                console.log("======================================data successfully Saved in radis cache=======================================  ", reply);
              }
            }
          );
          console.log("==============================================Getting data for database===============================================================")
          res.send(data);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({
            message:
              err.message || "Some error occurred while getting all states",
          });
        });
    }
  });
};

// // find all data related to perticilar state
exports.findStatesData = (req, res) => {
  const state = req.query.name;
  

  redis_client.get(state, (error, data) => {
     
    if(data){
      console.log("===========================================getting data from Radis Cache directly================================================",)
     
      var jsonData=JSON.parse(data);
      
      res.send(jsonData)

    }else{
      States.findAll({ where: { state: state } })
    .then((data) => {
      console.log("===========================================getting data from db ================================================",)
      var states=data;
      redis_client.setex(
        state,
        36000,
        JSON.stringify(states),
        (error, reply) => {
          if (error) {
            console.log(error);
          } else {
            console.log("======================================data successfully Saved in radis cache=======================================  ", reply);
          }
        }
      );
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving States.",
      });
    });
    }
  })

  // States.findAll({ where: { state: state } })
  //   .then((data) => {
  //     res.send(data);
  //   })
  //   .catch((err) => {
  //     res.status(500).send({
  //       message: err.message || "Some error occurred while retrieving States.",
  //     });
  //   });
};
