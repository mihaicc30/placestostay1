const Sequelize = require("sequelize")
const sequelize = require("./Database")

const Acc_dates = sequelize.define('acc_dates', {
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
  availability: {
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

module.exports = Acc_dates