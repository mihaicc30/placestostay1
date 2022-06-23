const Sequelize = require("sequelize")
const sequelize = require("./Database")

const Acc_bookings = sequelize.define('acc_bookings', {
  ID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  accID: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  thedate: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  username: {
    type: Sequelize.STRING,
    defaultValue: 0
  },
  npeople: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}
,
  {
    freezeTableName: true,
    timestamps: false
  }
  )

module.exports = Acc_bookings