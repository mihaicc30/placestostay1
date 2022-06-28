const Sequelize = require("sequelize")
const sequelize = require("./Database")

const Accommodation_details = sequelize.define('accommodation_details', {
  accID: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  ID: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    foreignKey: true
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
    timestamps: false,
    raw: true
  }
  )

module.exports = Accommodation_details