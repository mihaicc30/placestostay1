const Sequelize = require("sequelize")
const sequelize = require("./Database")

const Accommodation = sequelize.define('accommodation', {
  ID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    defaultValue: 0
  },
  type: {
    type: Sequelize.STRING,
    defaultValue: 0
  },
  location: {
    type: Sequelize.TINYINT,
    defaultValue: 0
  },
  latitude: {
    type: Sequelize.FLOAT,
    defaultValue: 0
  },
  longitude: {
    type: Sequelize.FLOAT,
    defaultValue: 0
  },
  icon: {
    type: Sequelize.STRING,
    defaultValue: 0
  },
  photo: {
    type: Sequelize.STRING,
    defaultValue: 0
  },
  description: {
    type: Sequelize.STRING,
    defaultValue: 0
  }
}
,
  {
    freezeTableName: true,
    timestamps: false
  }
  )

module.exports = Accommodation