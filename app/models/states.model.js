module.exports = (sequelize, Sequelize) => {
  const States = sequelize.define("States", {
    date: {
      type: Sequelize.STRING
    },
    state: {
      type: Sequelize.STRING
    },
    fips: {
      type: Sequelize.INTEGER
    },
    cases: {
      type: Sequelize.INTEGER
    },
    deaths: {
      type: Sequelize.INTEGER
    }
  });

  return States;
};
