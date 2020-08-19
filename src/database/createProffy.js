const Sequelize = require("sequelize").Sequelize
const sequelize = require("./db");
const createProffy = require("../1/createProffy");

const insetedProffy = sequelize.define("proffys", {
    name: {
      type: Sequelize.STRING
    },
    avatar: {
      type: Sequelize.TEXT
    },
    whatsapp: {
      type: Sequelize.STRING
    },
    bio: {
      type: Sequelize.STRING
    }
})
const insetedClass = sequelize.define("classes", {
  subject: {
    type: Sequelize.INTEGER
  },
  cost: {
    type: Sequelize.STRING
  },
  proffy_id: {
    type: Sequelize.INTEGER,
  }
})

const insertedAllClassScheduleValues = sequelize.define("class_schedule", {
  class_id: {
    type: Sequelize.INTEGER,
  },
  weekday: {
    type: Sequelize.INTEGER
  },
  time_from: {
    type: Sequelize.INTEGER
  },
  time_to: {
    type: Sequelize.INTEGER
  }
})

// insetedProffy.sync({force:true})
// insetedClass.sync({force:true})
// insertedAllClassScheduleValues.sync({force:true})

module.exports = {insetedProffy, insetedClass, insertedAllClassScheduleValues}